// components/carpool/CarpoolDetailsModal.tsx
import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Alert,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Carpool } from "@/services/carpool";
import { createJoinRequest } from "@/services/carpoolRequests";

type Props = {
  visible: boolean;
  carpool: Carpool;
  currentUserId: string;
  currentUserName: string;
  onClose: () => void;
  onJoinSuccess: () => void;
};

export default function CarpoolDetailsModal({
  visible,
  carpool,
  currentUserId,
  currentUserName,
  onClose,
  onJoinSuccess,
}: Props) {
  const [message, setMessage] = useState("");
  const [joining, setJoining] = useState(false);

  const isFull = carpool.availableSeats === 0;
  const isDriver = carpool.createdBy === currentUserId;

  const handleJoinRequest = async () => {
    if (isFull) {
      Alert.alert("Carpool Full", "This carpool is already full.");
      return;
    }

    if (isDriver) {
      Alert.alert("Cannot Join", "You cannot join your own carpool.");
      return;
    }

    Alert.alert(
      "Confirm Join Request",
      `Send a request to join this carpool?\n\n${message ? `Message: "${message}"` : "No message included."}`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Send Request",
          onPress: async () => {
            try {
              setJoining(true);

              await createJoinRequest({
                carpoolId: carpool.id!,
                tripId: carpool.tripId,
                requesterId: currentUserId,
                requesterName: currentUserName,
                driverId: carpool.createdBy,
                message: message.trim() || undefined,
                status: "pending",
              });

              Alert.alert(
                "Request Sent!",
                "Your join request has been sent to the driver. They will be notified.",
                [{ text: "OK", onPress: onJoinSuccess }],
              );

              setMessage("");
              onClose();
            } catch (error: any) {
              Alert.alert("Error", error.message || "Failed to send join request");
            } finally {
              setJoining(false);
            }
          },
        },
      ],
    );
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <MaterialIcons name="close" size={24} color="#111827" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Carpool Details</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Driver Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Driver</Text>
            <View style={styles.driverCard}>
              <View style={styles.avatarContainer}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {carpool.driverName.charAt(0).toUpperCase()}
                  </Text>
                </View>
              </View>
              <View style={styles.driverInfo}>
                <Text style={styles.driverName}>{carpool.driverName}</Text>
                <View style={styles.contactRow}>
                  <MaterialIcons name="phone" size={16} color="#6B7280" />
                  <Text style={styles.contactText}>{carpool.contactNumber}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Car Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Vehicle</Text>
            <View style={styles.detailsCard}>
              <View style={styles.detailRow}>
                <MaterialIcons name="directions-car" size={20} color="#6366F1" />
                <Text style={styles.detailLabel}>Model</Text>
                <Text style={styles.detailValue}>{carpool.carModel}</Text>
              </View>
              {carpool.carColor && (
                <View style={styles.detailRow}>
                  <MaterialIcons name="palette" size={20} color="#6366F1" />
                  <Text style={styles.detailLabel}>Color</Text>
                  <Text style={styles.detailValue}>{carpool.carColor}</Text>
                </View>
              )}
              {carpool.licensePlate && (
                <View style={styles.detailRow}>
                  <MaterialIcons name="credit-card" size={20} color="#6366F1" />
                  <Text style={styles.detailLabel}>Plate</Text>
                  <Text style={styles.detailValue}>{carpool.licensePlate}</Text>
                </View>
              )}
            </View>
          </View>

          {/* Schedule */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Schedule</Text>
            <View style={styles.scheduleCard}>
              <View style={styles.scheduleItem}>
                <View style={styles.scheduleIcon}>
                  <MaterialIcons name="flight-takeoff" size={20} color="#6366F1" />
                </View>
                <View style={styles.scheduleDetails}>
                  <Text style={styles.scheduleLabel}>Departure</Text>
                  <Text style={styles.scheduleDate}>
                    {formatDate(carpool.departureDate)}
                  </Text>
                  <Text style={styles.scheduleTime}>{carpool.departureTime}</Text>
                </View>
              </View>

              {carpool.returnDate && carpool.returnTime && (
                <View style={styles.scheduleItem}>
                  <View style={styles.scheduleIcon}>
                    <MaterialIcons name="flight-land" size={20} color="#10B981" />
                  </View>
                  <View style={styles.scheduleDetails}>
                    <Text style={styles.scheduleLabel}>Return</Text>
                    <Text style={styles.scheduleDate}>
                      {formatDate(carpool.returnDate)}
                    </Text>
                    <Text style={styles.scheduleTime}>{carpool.returnTime}</Text>
                  </View>
                </View>
              )}
            </View>
          </View>

          {/* Meeting Point */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Meeting Point</Text>
            <View style={styles.locationCard}>
              <MaterialIcons name="place" size={24} color="#EF4444" />
              <View style={styles.locationDetails}>
                <Text style={styles.locationName}>{carpool.meetingPoint}</Text>
                {carpool.meetingPointAddress && (
                  <Text style={styles.locationAddress}>
                    {carpool.meetingPointAddress}
                  </Text>
                )}
              </View>
            </View>
          </View>

          {/* Seats & Pricing */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Seats & Pricing</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <MaterialIcons name="event-seat" size={28} color="#6366F1" />
                <Text style={styles.statValue}>{carpool.availableSeats}</Text>
                <Text style={styles.statLabel}>Available</Text>
              </View>
              <View style={styles.statCard}>
                <MaterialIcons name="group" size={28} color="#10B981" />
                <Text style={styles.statValue}>{carpool.totalSeats}</Text>
                <Text style={styles.statLabel}>Total Seats</Text>
              </View>
              <View style={styles.statCard}>
                <MaterialIcons name="payments" size={28} color="#F59E0B" />
                <Text style={styles.statValue}>
                  {carpool.currency} {carpool.chargePerPerson}
                </Text>
                <Text style={styles.statLabel}>Per Person</Text>
              </View>
            </View>
          </View>

          {/* Preferences */}
          {carpool.preferences && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Preferences</Text>
              <View style={styles.preferencesCard}>
                <MaterialIcons name="info-outline" size={20} color="#6366F1" />
                <Text style={styles.preferencesText}>{carpool.preferences}</Text>
              </View>
            </View>
          )}

          {/* Notes */}
          {carpool.notes && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Additional Notes</Text>
              <View style={styles.notesCard}>
                <Text style={styles.notesText}>{carpool.notes}</Text>
              </View>
            </View>
          )}

          {/* Join Request Form */}
          {!isDriver && !isFull && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Add a Message (Optional)</Text>
              <TextInput
                style={styles.messageInput}
                placeholder="Introduce yourself or share why you'd like to join..."
                placeholderTextColor="#9CA3AF"
                value={message}
                onChangeText={setMessage}
                multiline
                numberOfLines={4}
                maxLength={200}
              />
              <Text style={styles.characterCount}>{message.length}/200</Text>
            </View>
          )}

          <View style={{ height: 120 }} />
        </ScrollView>

        {/* Bottom Actions */}
        {!isDriver && (
          <View style={styles.bottomActions}>
            {isFull ? (
              <View style={styles.fullBanner}>
                <MaterialIcons name="block" size={24} color="#DC2626" />
                <Text style={styles.fullText}>This carpool is full</Text>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.joinButton}
                onPress={handleJoinRequest}
                disabled={joining}
              >
                {joining ? (
                  <Text style={styles.joinButtonText}>Sending Request...</Text>
                ) : (
                  <>
                    <MaterialIcons name="person-add" size={20} color="#fff" />
                    <Text style={styles.joinButtonText}>Confirm Join Request</Text>
                  </>
                )}
              </TouchableOpacity>
            )}
          </View>
        )}

        {isDriver && (
          <View style={styles.bottomActions}>
            <View style={styles.driverBanner}>
              <MaterialIcons name="info-outline" size={20} color="#6366F1" />
              <Text style={styles.driverBannerText}>
                This is your carpool. Manage it from your trips.
              </Text>
            </View>
          </View>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 60 : 20,
    paddingBottom: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  driverCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    gap: 16,
  },
  avatarContainer: {
    shadowColor: "#6366F1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#6366F1",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 28,
    fontWeight: "700",
    color: "#fff",
  },
  driverInfo: {
    flex: 1,
  },
  driverName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  contactText: {
    fontSize: 15,
    color: "#6B7280",
    fontWeight: "500",
  },
  detailsCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    gap: 16,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  detailLabel: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
    flex: 1,
  },
  detailValue: {
    fontSize: 15,
    color: "#111827",
    fontWeight: "600",
  },
  scheduleCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    gap: 20,
  },
  scheduleItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 16,
  },
  scheduleIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
  },
  scheduleDetails: {
    flex: 1,
  },
  scheduleLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6B7280",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  scheduleDate: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 2,
  },
  scheduleTime: {
    fontSize: 15,
    color: "#6366F1",
    fontWeight: "600",
  },
  locationCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    gap: 12,
  },
  locationDetails: {
    flex: 1,
  },
  locationName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  locationAddress: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
  },
  statsGrid: {
    flexDirection: "row",
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    gap: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111827",
  },
  statLabel: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "500",
    textAlign: "center",
  },
  preferencesCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#FEF3C7",
    padding: 16,
    borderRadius: 16,
    gap: 12,
  },
  preferencesText: {
    flex: 1,
    fontSize: 14,
    color: "#92400E",
    lineHeight: 20,
  },
  notesCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
  },
  notesText: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 22,
  },
  messageInput: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 16,
    fontSize: 15,
    color: "#111827",
    minHeight: 100,
    textAlignVertical: "top",
  },
  characterCount: {
    fontSize: 12,
    color: "#9CA3AF",
    textAlign: "right",
    marginTop: 8,
  },
  bottomActions: {
    padding: 20,
    paddingBottom: Platform.OS === "ios" ? 34 : 20,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  joinButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: "#6366F1",
    paddingVertical: 16,
    borderRadius: 14,
    shadowColor: "#6366F1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  joinButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
  },
  fullBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: "#FEE2E2",
    paddingVertical: 16,
    borderRadius: 14,
  },
  fullText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#DC2626",
  },
  driverBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#EEF2FF",
    padding: 16,
    borderRadius: 14,
  },
  driverBannerText: {
    flex: 1,
    fontSize: 14,
    color: "#6366F1",
    fontWeight: "500",
  },
});
