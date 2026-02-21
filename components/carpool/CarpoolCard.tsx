//components/carpool/CarpoolCard.tsx
import {
    CardStyles,
    TypographyStyles
} from "@/constants/componentStyles";
import { BorderRadius, Colors, Spacing } from "@/constants/styles";
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
          <MaterialIcons
            name="directions-car"
            size={24}
            color={Colors.primary}
          />
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
            {
              backgroundColor: isFull ? Colors.errorLight : Colors.successLight,
            },
          ]}
        >
          <Text
            style={[
              styles.statusText,
              { color: isFull ? Colors.error : Colors.success },
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
    ...CardStyles.elevatedCard,
    marginBottom: Spacing.md,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.md,
    gap: Spacing.md,
  },
  carIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primaryLight,
    opacity: 0.15,
    justifyContent: "center",
    alignItems: "center",
  },
  headerInfo: {
    flex: 1,
  },
  driverName: {
    ...TypographyStyles.label,
    color: Colors.text.primary,
    fontWeight: "600",
    marginBottom: Spacing.xs,
  },
  carInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  carModel: {
    ...TypographyStyles.caption,
    color: Colors.text.secondary,
    fontWeight: "500",
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: Colors.neutral.gray300,
  },
  carColor: {
    ...TypographyStyles.caption,
    color: Colors.text.secondary,
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.lg,
  },
  statusText: {
    ...TypographyStyles.caption,
    fontWeight: "600",
  },
  detailsGrid: {
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.md,
  },
  detailIcon: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.neutral.gray50,
    justifyContent: "center",
    alignItems: "center",
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    ...TypographyStyles.caption,
    color: Colors.text.tertiary,
    marginBottom: Spacing.xs,
    fontWeight: "500",
  },
  detailValue: {
    ...TypographyStyles.label,
    color: Colors.text.primary,
    fontWeight: "500",
  },
  preferencesContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    backgroundColor: Colors.warningLight,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
  },
  preferencesText: {
    flex: 1,
    ...TypographyStyles.caption,
    color: Colors.warning,
  },
  notesContainer: {
    backgroundColor: Colors.neutral.gray50,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
  },
  notesText: {
    ...TypographyStyles.caption,
    color: Colors.text.secondary,
    lineHeight: 20,
  },
  actions: {
    flexDirection: "row",
    gap: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
    paddingTop: Spacing.md,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.neutral.gray50,
  },
  actionButtonText: {
    ...TypographyStyles.label,
    fontWeight: "600",
    color: Colors.primary,
  },
});
