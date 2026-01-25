import { MaterialIcons } from "@expo/vector-icons";
import {
    Alert,
    Share,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { Carpool } from "../../services/carpool";

type Props = {
  carpool: Carpool;
  onEdit: () => void;
  onDelete: () => void;
  onJoin?: () => void;
};

export default function CarpoolCard({
  carpool,
  onEdit,
  onDelete,
  onJoin,
}: Props) {
  const seatsRemaining = carpool.availableSeats;
  const seatsFilled = carpool.totalSeats - carpool.availableSeats;
  const isFull = seatsRemaining === 0;

  const handleShare = async () => {
    try {
      const message = `🚗 Carpool to ${carpool.meetingPoint}

Driver: ${carpool.driverName}
Car: ${carpool.carModel}${carpool.carColor ? ` (${carpool.carColor})` : ""}
Departure: ${carpool.departureDate.toLocaleDateString()} at ${carpool.departureTime}
Seats Available: ${seatsRemaining}/${carpool.totalSeats}
Charge: ${carpool.currency} ${carpool.chargePerPerson}/person

Contact: ${carpool.contactNumber}`;

      await Share.share({
        message,
        title: "Join my carpool!",
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Carpool",
      "Are you sure you want to delete this carpool?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: onDelete,
        },
      ],
    );
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onEdit}
      activeOpacity={0.9}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.carIcon}>
          <MaterialIcons name="directions-car" size={24} color="#6366F1" />
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.driverName}>{carpool.driverName}</Text>
          <View style={styles.carInfo}>
            <Text style={styles.carModel}>{carpool.carModel}</Text>
            {carpool.carColor && (
              <>
                <View style={styles.dot} />
                <Text style={styles.carColor}>{carpool.carColor}</Text>
              </>
            )}
          </View>
        </View>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: isFull ? "#FEE2E2" : "#D1FAE5" },
          ]}
        >
          <Text
            style={[
              styles.statusText,
              { color: isFull ? "#DC2626" : "#059669" },
            ]}
          >
            {isFull ? "Full" : "Available"}
          </Text>
        </View>
      </View>

      {/* Details Grid */}
      <View style={styles.detailsGrid}>
        {/* Departure */}
        <View style={styles.detailRow}>
          <View style={styles.detailIcon}>
            <MaterialIcons name="event" size={18} color="#6B7280" />
          </View>
          <View style={styles.detailContent}>
            <Text style={styles.detailLabel}>Departure</Text>
            <Text style={styles.detailValue}>
              {carpool.departureDate.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}{" "}
              at {carpool.departureTime}
            </Text>
          </View>
        </View>

        {/* Return (if available) */}
        {carpool.returnDate && carpool.returnTime && (
          <View style={styles.detailRow}>
            <View style={styles.detailIcon}>
              <MaterialIcons name="event-available" size={18} color="#6B7280" />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Return</Text>
              <Text style={styles.detailValue}>
                {carpool.returnDate.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}{" "}
                at {carpool.returnTime}
              </Text>
            </View>
          </View>
        )}

        {/* Meeting Point */}
        <View style={styles.detailRow}>
          <View style={styles.detailIcon}>
            <MaterialIcons name="place" size={18} color="#6B7280" />
          </View>
          <View style={styles.detailContent}>
            <Text style={styles.detailLabel}>Meeting Point</Text>
            <Text style={styles.detailValue}>{carpool.meetingPoint}</Text>
          </View>
        </View>

        {/* Seats */}
        <View style={styles.detailRow}>
          <View style={styles.detailIcon}>
            <MaterialIcons name="event-seat" size={18} color="#6B7280" />
          </View>
          <View style={styles.detailContent}>
            <Text style={styles.detailLabel}>Seats</Text>
            <Text style={styles.detailValue}>
              {seatsRemaining} available of {carpool.totalSeats}
            </Text>
          </View>
        </View>

        {/* Charge */}
        <View style={styles.detailRow}>
          <View style={styles.detailIcon}>
            <MaterialIcons name="payments" size={18} color="#6B7280" />
          </View>
          <View style={styles.detailContent}>
            <Text style={styles.detailLabel}>Charge</Text>
            <Text style={styles.detailValue}>
              {carpool.currency} {carpool.chargePerPerson}/person
            </Text>
          </View>
        </View>

        {/* Contact */}
        <View style={styles.detailRow}>
          <View style={styles.detailIcon}>
            <MaterialIcons name="phone" size={18} color="#6B7280" />
          </View>
          <View style={styles.detailContent}>
            <Text style={styles.detailLabel}>Contact</Text>
            <Text style={styles.detailValue}>{carpool.contactNumber}</Text>
          </View>
        </View>
      </View>

      {/* Preferences */}
      {carpool.preferences && (
        <View style={styles.preferencesContainer}>
          <MaterialIcons name="info-outline" size={16} color="#6B7280" />
          <Text style={styles.preferencesText}>{carpool.preferences}</Text>
        </View>
      )}

      {/* Notes */}
      {carpool.notes && (
        <View style={styles.notesContainer}>
          <Text style={styles.notesText}>{carpool.notes}</Text>
        </View>
      )}

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
          <MaterialIcons name="share" size={20} color="#6366F1" />
          <Text style={styles.actionButtonText}>Share</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={handleDelete}>
          <MaterialIcons name="delete-outline" size={20} color="#EF4444" />
          <Text style={[styles.actionButtonText, { color: "#EF4444" }]}>
            Delete
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 12,
  },
  carIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
  },
  headerInfo: {
    flex: 1,
  },
  driverName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  carInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  carModel: {
    fontSize: 13,
    color: "#6B7280",
    fontWeight: "500",
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: "#D1D5DB",
  },
  carColor: {
    fontSize: 13,
    color: "#6B7280",
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  detailsGrid: {
    gap: 12,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  detailIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#F9FAFB",
    justifyContent: "center",
    alignItems: "center",
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: "#9CA3AF",
    marginBottom: 2,
    fontWeight: "500",
  },
  detailValue: {
    fontSize: 14,
    color: "#374151",
    fontWeight: "500",
  },
  preferencesContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#FEF3C7",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  preferencesText: {
    flex: 1,
    fontSize: 13,
    color: "#92400E",
  },
  notesContainer: {
    backgroundColor: "#F9FAFB",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  notesText: {
    fontSize: 13,
    color: "#6B7280",
    lineHeight: 20,
  },
  actions: {
    flexDirection: "row",
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    paddingTop: 16,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: "#F9FAFB",
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6366F1",
  },
});
