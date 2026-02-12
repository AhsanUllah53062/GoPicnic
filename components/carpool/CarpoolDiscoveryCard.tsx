// components/carpool/CarpoolDiscoveryCard.tsx
import { Carpool } from "@/services/carpool";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  carpool: Carpool;
  onPress: () => void;
  onJoin: () => void;
  onChat: () => void;
  isOwner?: boolean; // Whether the current user is the carpool owner
};

export default function CarpoolDiscoveryCard({
  carpool,
  onPress,
  onJoin,
  onChat,
  isOwner = false,
}: Props) {
  const seatsRemaining = carpool.availableSeats;
  const isFull = seatsRemaining === 0;
  const isAlmostFull = seatsRemaining <= 2 && seatsRemaining > 0;

  // Extract vibe tags from preferences
  const vibeTags = carpool.preferences
    ? carpool.preferences
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0)
        .slice(0, 3) // Show max 3 tags
    : [];

  // Format date and time
  const departureDate = new Date(carpool.departureDate);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  let dateLabel = "";
  if (departureDate.toDateString() === today.toDateString()) {
    dateLabel = "Today";
  } else if (departureDate.toDateString() === tomorrow.toDateString()) {
    dateLabel = "Tomorrow";
  } else {
    dateLabel = departureDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  }

  // Calculate capacity percentage for visual indicator
  const capacityPercentage =
    ((carpool.totalSeats - seatsRemaining) / carpool.totalSeats) * 100;

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.95}
    >
      {/* Header with Driver Info */}
      <View style={styles.header}>
        <View style={styles.driverInfo}>
          <View style={styles.avatarContainer}>
            {carpool.driverName ? (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarText}>
                  {carpool.driverName.charAt(0).toUpperCase()}
                </Text>
              </View>
            ) : (
              <MaterialIcons name="person" size={24} color="#6366F1" />
            )}
          </View>
          <View style={styles.driverDetails}>
            <Text style={styles.driverName}>{carpool.driverName}</Text>
            <View style={styles.carInfo}>
              <MaterialIcons name="directions-car" size={14} color="#6B7280" />
              <Text style={styles.carModel}>{carpool.carModel}</Text>
              {carpool.carColor && (
                <>
                  <View style={styles.dot} />
                  <Text style={styles.carColor}>{carpool.carColor}</Text>
                </>
              )}
            </View>
          </View>
        </View>

        {/* Price Badge */}
        <View style={styles.priceBadge}>
          <Text style={styles.currency}>{carpool.currency}</Text>
          <Text style={styles.price}>{carpool.chargePerPerson}</Text>
          <Text style={styles.perPerson}>/person</Text>
        </View>
      </View>

      {/* Route with Vertical Path */}
      <View style={styles.routeContainer}>
        <View style={styles.routePath}>
          <View style={styles.startDot} />
          <View style={styles.pathLine} />
          <View style={styles.endDot} />
        </View>

        <View style={styles.routeDetails}>
          {/* Departure */}
          <View style={styles.routePoint}>
            <Text style={styles.routeLabel}>From</Text>
            <Text style={styles.routeLocation}>{carpool.meetingPoint}</Text>
            {carpool.meetingPointAddress && (
              <Text style={styles.routeAddress} numberOfLines={1}>
                {carpool.meetingPointAddress}
              </Text>
            )}
            <View style={styles.timeContainer}>
              <MaterialIcons name="schedule" size={14} color="#6B7280" />
              <Text style={styles.timeText}>
                {dateLabel} at {carpool.departureTime}
              </Text>
            </View>
          </View>

          {/* Destination (if available from trip context) */}
          <View style={styles.routePoint}>
            <Text style={styles.routeLabel}>To</Text>
            <Text style={styles.routeLocation}>Destination</Text>
            {carpool.returnDate && carpool.returnTime && (
              <View style={styles.returnBadge}>
                <MaterialIcons name="repeat" size={12} color="#059669" />
                <Text style={styles.returnText}>
                  Return:{" "}
                  {new Date(carpool.returnDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}{" "}
                  at {carpool.returnTime}
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>

      {/* Vibe Tags */}
      {vibeTags.length > 0 && (
        <View style={styles.vibeContainer}>
          {vibeTags.map((tag, index) => (
            <View key={index} style={styles.vibeTag}>
              <Text style={styles.vibeText}>#{tag}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Capacity Indicator */}
      <View style={styles.capacityContainer}>
        <View style={styles.capacityHeader}>
          <View style={styles.capacityInfo}>
            <MaterialIcons
              name="event-seat"
              size={16}
              color={isFull ? "#DC2626" : isAlmostFull ? "#F59E0B" : "#059669"}
            />
            <Text
              style={[
                styles.capacityText,
                {
                  color: isFull
                    ? "#DC2626"
                    : isAlmostFull
                      ? "#F59E0B"
                      : "#059669",
                },
              ]}
            >
              {isFull
                ? "Full"
                : `${seatsRemaining} seat${seatsRemaining !== 1 ? "s" : ""} left`}
            </Text>
          </View>
          <Text style={styles.totalSeats}>of {carpool.totalSeats}</Text>
        </View>

        {/* Visual Capacity Bar */}
        <View style={styles.capacityBar}>
          <View
            style={[
              styles.capacityFill,
              {
                width: `${capacityPercentage}%`,
                backgroundColor: isFull
                  ? "#DC2626"
                  : isAlmostFull
                    ? "#F59E0B"
                    : "#059669",
              },
            ]}
          />
        </View>
      </View>

      {/* Action Buttons - Hidden if user is the owner */}
      {!isOwner && (
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.chatButton]}
            onPress={onChat}
          >
            <MaterialIcons
              name="chat-bubble-outline"
              size={18}
              color="#6366F1"
            />
            <Text style={styles.chatButtonText}>Chat</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.actionButton,
              styles.joinButton,
              isFull && styles.joinButtonDisabled,
            ]}
            onPress={onJoin}
            disabled={isFull}
          >
            <MaterialIcons
              name={isFull ? "block" : "person-add"}
              size={18}
              color="#fff"
            />
            <Text style={styles.joinButtonText}>
              {isFull ? "Full" : "Request to Join"}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Notes Preview */}
      {carpool.notes && (
        <View style={styles.notesPreview}>
          <MaterialIcons name="info-outline" size={14} color="#6B7280" />
          <Text style={styles.notesText} numberOfLines={2}>
            {carpool.notes}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#6366F1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },
  driverInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 12,
  },
  avatarContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    overflow: "hidden",
  },
  avatarPlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: "#6366F1",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 22,
    fontWeight: "700",
    color: "#fff",
  },
  driverDetails: {
    flex: 1,
  },
  driverName: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  carInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  carModel: {
    fontSize: 14,
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
    fontSize: 14,
    color: "#6B7280",
  },
  priceBadge: {
    backgroundColor: "#10B981",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    alignItems: "center",
    minWidth: 90,
  },
  currency: {
    fontSize: 11,
    fontWeight: "600",
    color: "#fff",
    opacity: 0.9,
  },
  price: {
    fontSize: 20,
    fontWeight: "800",
    color: "#fff",
  },
  perPerson: {
    fontSize: 11,
    color: "#fff",
    opacity: 0.9,
  },
  routeContainer: {
    flexDirection: "row",
    marginBottom: 16,
    gap: 16,
  },
  routePath: {
    width: 24,
    alignItems: "center",
    paddingVertical: 4,
  },
  startDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#6366F1",
    borderWidth: 2,
    borderColor: "#fff",
    shadowColor: "#6366F1",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  pathLine: {
    flex: 1,
    width: 2,
    backgroundColor: "#E5E7EB",
    marginVertical: 6,
  },
  endDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#10B981",
    borderWidth: 2,
    borderColor: "#fff",
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  routeDetails: {
    flex: 1,
    gap: 20,
  },
  routePoint: {
    gap: 4,
  },
  routeLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#9CA3AF",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  routeLocation: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  routeAddress: {
    fontSize: 13,
    color: "#6B7280",
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 4,
  },
  timeText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6B7280",
  },
  returnBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#D1FAE5",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: "flex-start",
    marginTop: 4,
  },
  returnText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#059669",
  },
  vibeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  vibeTag: {
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  vibeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#92400E",
  },
  capacityContainer: {
    marginBottom: 16,
  },
  capacityHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  capacityInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  capacityText: {
    fontSize: 14,
    fontWeight: "700",
  },
  totalSeats: {
    fontSize: 13,
    color: "#9CA3AF",
    fontWeight: "500",
  },
  capacityBar: {
    height: 6,
    backgroundColor: "#F3F4F6",
    borderRadius: 3,
    overflow: "hidden",
  },
  capacityFill: {
    height: "100%",
    borderRadius: 3,
  },
  actions: {
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
  },
  chatButton: {
    backgroundColor: "#EEF2FF",
    borderWidth: 1.5,
    borderColor: "#6366F1",
  },
  chatButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#6366F1",
  },
  joinButton: {
    backgroundColor: "#6366F1",
  },
  joinButtonDisabled: {
    backgroundColor: "#D1D5DB",
  },
  joinButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#fff",
  },
  notesPreview: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    backgroundColor: "#F9FAFB",
    padding: 12,
    borderRadius: 10,
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  notesText: {
    flex: 1,
    fontSize: 13,
    color: "#6B7280",
    lineHeight: 18,
  },
});
