import { MaterialIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useEffect, useState } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { Carpool, CreateCarpoolData } from "../../services/carpool";
import MeetingPointSelector from "./MeetingPointSelector";

type Props = {
  visible: boolean;
  tripId: string;
  userId: string;
  carpool?: Carpool | null;
  onClose: () => void;
  onSave: (carpool: CreateCarpoolData) => void;
};

export default function CarpoolEditorModal({
  visible,
  tripId,
  userId,
  carpool,
  onClose,
  onSave,
}: Props) {
  // Driver Info
  const [driverName, setDriverName] = useState("");
  const [contactNumber, setContactNumber] = useState("");

  // Car Info
  const [carModel, setCarModel] = useState("");
  const [carColor, setCarColor] = useState("");
  const [licensePlate, setLicensePlate] = useState("");

  // Seats
  const [totalSeats, setTotalSeats] = useState("");
  const [availableSeats, setAvailableSeats] = useState("");

  // Schedule
  const [departureDate, setDepartureDate] = useState<Date>(new Date());
  const [departureTime, setDepartureTime] = useState<Date>(new Date());
  const [hasReturn, setHasReturn] = useState(false);
  const [returnDate, setReturnDate] = useState<Date>(new Date());
  const [returnTime, setReturnTime] = useState<Date>(new Date());

  // Date/Time Pickers
  const [showDepartureDatePicker, setShowDepartureDatePicker] = useState(false);
  const [showDepartureTimePicker, setShowDepartureTimePicker] = useState(false);
  const [showReturnDatePicker, setShowReturnDatePicker] = useState(false);
  const [showReturnTimePicker, setShowReturnTimePicker] = useState(false);

  // Location
  const [meetingPoint, setMeetingPoint] = useState("");
  const [meetingPointAddress, setMeetingPointAddress] = useState("");
  const [showMeetingPointSelector, setShowMeetingPointSelector] =
    useState(false);

  // Pricing
  const [chargePerPerson, setChargePerPerson] = useState("");
  const [currency, setCurrency] = useState("PKR");

  // Additional
  const [preferences, setPreferences] = useState("");
  const [notes, setNotes] = useState("");

  // Load carpool data when editing
  useEffect(() => {
    if (carpool) {
      setDriverName(carpool.driverName);
      setContactNumber(carpool.contactNumber);
      setCarModel(carpool.carModel);
      setCarColor(carpool.carColor || "");
      setLicensePlate(carpool.licensePlate || "");
      setTotalSeats(carpool.totalSeats.toString());
      setAvailableSeats(carpool.availableSeats.toString());
      setDepartureDate(carpool.departureDate);
      setDepartureTime(parseTime(carpool.departureTime));

      if (carpool.returnDate && carpool.returnTime) {
        setHasReturn(true);
        setReturnDate(carpool.returnDate);
        setReturnTime(parseTime(carpool.returnTime));
      }

      setMeetingPoint(carpool.meetingPoint);
      setMeetingPointAddress(carpool.meetingPointAddress || "");
      setChargePerPerson(carpool.chargePerPerson.toString());
      setCurrency(carpool.currency);
      setPreferences(carpool.preferences || "");
      setNotes(carpool.notes || "");
    }
  }, [carpool]);

  const parseTime = (timeStr: string): Date => {
    const [hours, minutes] = timeStr.split(":").map(Number);
    const date = new Date();
    date.setHours(hours, minutes);
    return date;
  };

  const formatTime = (date: Date): string => {
    return date.toTimeString().slice(0, 5); // "HH:MM"
  };

  const resetForm = () => {
    setDriverName("");
    setContactNumber("");
    setCarModel("");
    setCarColor("");
    setLicensePlate("");
    setTotalSeats("");
    setAvailableSeats("");
    setDepartureDate(new Date());
    setDepartureTime(new Date());
    setHasReturn(false);
    setReturnDate(new Date());
    setReturnTime(new Date());
    setMeetingPoint("");
    setMeetingPointAddress("");
    setChargePerPerson("");
    setCurrency("PKR");
    setPreferences("");
    setNotes("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const validateForm = (): boolean => {
    if (!driverName.trim()) {
      Alert.alert("Missing Info", "Please enter driver name");
      return false;
    }
    if (!contactNumber.trim()) {
      Alert.alert("Missing Info", "Please enter contact number");
      return false;
    }
    if (!carModel.trim()) {
      Alert.alert("Missing Info", "Please enter car model");
      return false;
    }
    if (!totalSeats || parseInt(totalSeats) <= 0) {
      Alert.alert("Invalid Seats", "Please enter valid total seats");
      return false;
    }
    if (
      !availableSeats ||
      parseInt(availableSeats) < 0 ||
      parseInt(availableSeats) > parseInt(totalSeats)
    ) {
      Alert.alert(
        "Invalid Seats",
        "Available seats must be between 0 and total seats",
      );
      return false;
    }
    if (!meetingPoint.trim()) {
      Alert.alert("Missing Info", "Please select meeting point");
      return false;
    }
    if (!chargePerPerson || parseFloat(chargePerPerson) < 0) {
      Alert.alert("Invalid Charge", "Please enter valid charge per person");
      return false;
    }
    return true;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    const carpoolData: CreateCarpoolData = {
      tripId,
      driverName: driverName.trim(),
      contactNumber: contactNumber.trim(),
      carModel: carModel.trim(),
      carColor: carColor.trim() || undefined,
      licensePlate: licensePlate.trim() || undefined,
      totalSeats: parseInt(totalSeats),
      availableSeats: parseInt(availableSeats),
      departureDate,
      departureTime: formatTime(departureTime),
      returnDate: hasReturn ? returnDate : undefined,
      returnTime: hasReturn ? formatTime(returnTime) : undefined,
      meetingPoint: meetingPoint.trim(),
      meetingPointAddress: meetingPointAddress.trim() || undefined,
      chargePerPerson: parseFloat(chargePerPerson),
      currency,
      preferences: preferences.trim() || undefined,
      notes: notes.trim() || undefined,
      status: parseInt(availableSeats) === 0 ? "full" : "active",
      participants: [],
      createdBy: userId,
    };

    onSave(carpoolData);
    handleClose();
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={handleClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose}>
            <MaterialIcons name="close" size={24} color="#111827" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {carpool ? "Edit Carpool" : "Create Carpool"}
          </Text>
          <TouchableOpacity onPress={handleSave}>
            <Text style={styles.saveText}>Save</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Driver Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Driver Information</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Driver Name *</Text>
              <View style={styles.inputContainer}>
                <MaterialIcons
                  name="person-outline"
                  size={20}
                  color="#9CA3AF"
                />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your name"
                  placeholderTextColor="#9CA3AF"
                  value={driverName}
                  onChangeText={setDriverName}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Contact Number *</Text>
              <View style={styles.inputContainer}>
                <MaterialIcons name="phone" size={20} color="#9CA3AF" />
                <TextInput
                  style={styles.input}
                  placeholder="+92 300 1234567"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="phone-pad"
                  value={contactNumber}
                  onChangeText={setContactNumber}
                />
              </View>
            </View>
          </View>

          {/* Car Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Car Details</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Car Model *</Text>
              <View style={styles.inputContainer}>
                <MaterialIcons
                  name="directions-car"
                  size={20}
                  color="#9CA3AF"
                />
                <TextInput
                  style={styles.input}
                  placeholder="e.g., Honda Civic 2020"
                  placeholderTextColor="#9CA3AF"
                  value={carModel}
                  onChangeText={setCarModel}
                />
              </View>
            </View>

            <View style={styles.row}>
              <View style={[styles.inputGroup, styles.halfWidth]}>
                <Text style={styles.inputLabel}>Color</Text>
                <View style={styles.inputContainer}>
                  <MaterialIcons name="palette" size={20} color="#9CA3AF" />
                  <TextInput
                    style={styles.input}
                    placeholder="White"
                    placeholderTextColor="#9CA3AF"
                    value={carColor}
                    onChangeText={setCarColor}
                  />
                </View>
              </View>

              <View style={[styles.inputGroup, styles.halfWidth]}>
                <Text style={styles.inputLabel}>License Plate</Text>
                <View style={styles.inputContainer}>
                  <MaterialIcons name="credit-card" size={20} color="#9CA3AF" />
                  <TextInput
                    style={styles.input}
                    placeholder="ABC-123"
                    placeholderTextColor="#9CA3AF"
                    value={licensePlate}
                    onChangeText={setLicensePlate}
                  />
                </View>
              </View>
            </View>
          </View>

          {/* Seats */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Seating</Text>

            <View style={styles.row}>
              <View style={[styles.inputGroup, styles.halfWidth]}>
                <Text style={styles.inputLabel}>Total Seats *</Text>
                <View style={styles.inputContainer}>
                  <MaterialIcons name="event-seat" size={20} color="#9CA3AF" />
                  <TextInput
                    style={styles.input}
                    placeholder="4"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="numeric"
                    value={totalSeats}
                    onChangeText={setTotalSeats}
                  />
                </View>
              </View>

              <View style={[styles.inputGroup, styles.halfWidth]}>
                <Text style={styles.inputLabel}>Available *</Text>
                <View style={styles.inputContainer}>
                  <MaterialIcons
                    name="event-available"
                    size={20}
                    color="#9CA3AF"
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="3"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="numeric"
                    value={availableSeats}
                    onChangeText={setAvailableSeats}
                  />
                </View>
              </View>
            </View>
          </View>

          {/* Schedule */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Schedule</Text>

            <Text style={styles.subsectionTitle}>Departure</Text>

            <View style={styles.row}>
              <TouchableOpacity
                style={[styles.inputGroup, styles.halfWidth]}
                onPress={() => setShowDepartureDatePicker(true)}
              >
                <Text style={styles.inputLabel}>Date *</Text>
                <View style={styles.inputContainer}>
                  <MaterialIcons
                    name="calendar-today"
                    size={20}
                    color="#9CA3AF"
                  />
                  <Text style={styles.inputText}>
                    {departureDate.toLocaleDateString()}
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.inputGroup, styles.halfWidth]}
                onPress={() => setShowDepartureTimePicker(true)}
              >
                <Text style={styles.inputLabel}>Time *</Text>
                <View style={styles.inputContainer}>
                  <MaterialIcons name="access-time" size={20} color="#9CA3AF" />
                  <Text style={styles.inputText}>
                    {formatTime(departureTime)}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* Date/Time Pickers for Departure */}
            {showDepartureDatePicker && (
              <DateTimePicker
                value={departureDate}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={(event, date) => {
                  setShowDepartureDatePicker(Platform.OS === "ios");
                  if (date) setDepartureDate(date);
                }}
                minimumDate={new Date()}
              />
            )}
            {showDepartureTimePicker && (
              <DateTimePicker
                value={departureTime}
                mode="time"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={(event, time) => {
                  setShowDepartureTimePicker(Platform.OS === "ios");
                  if (time) setDepartureTime(time);
                }}
              />
            )}

            {/* Return Trip Toggle */}
            <TouchableOpacity
              style={styles.toggleContainer}
              onPress={() => setHasReturn(!hasReturn)}
            >
              <MaterialIcons
                name={hasReturn ? "check-box" : "check-box-outline-blank"}
                size={24}
                color="#6366F1"
              />
              <Text style={styles.toggleText}>Add return trip</Text>
            </TouchableOpacity>

            {/* Return Schedule */}
            {hasReturn && (
              <>
                <Text style={styles.subsectionTitle}>Return</Text>

                <View style={styles.row}>
                  <TouchableOpacity
                    style={[styles.inputGroup, styles.halfWidth]}
                    onPress={() => setShowReturnDatePicker(true)}
                  >
                    <Text style={styles.inputLabel}>Date</Text>
                    <View style={styles.inputContainer}>
                      <MaterialIcons
                        name="calendar-today"
                        size={20}
                        color="#9CA3AF"
                      />
                      <Text style={styles.inputText}>
                        {returnDate.toLocaleDateString()}
                      </Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.inputGroup, styles.halfWidth]}
                    onPress={() => setShowReturnTimePicker(true)}
                  >
                    <Text style={styles.inputLabel}>Time</Text>
                    <View style={styles.inputContainer}>
                      <MaterialIcons
                        name="access-time"
                        size={20}
                        color="#9CA3AF"
                      />
                      <Text style={styles.inputText}>
                        {formatTime(returnTime)}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>

                {/* Date/Time Pickers for Return */}
                {showReturnDatePicker && (
                  <DateTimePicker
                    value={returnDate}
                    mode="date"
                    display={Platform.OS === "ios" ? "spinner" : "default"}
                    onChange={(event, date) => {
                      setShowReturnDatePicker(Platform.OS === "ios");
                      if (date) setReturnDate(date);
                    }}
                    minimumDate={departureDate}
                  />
                )}
                {showReturnTimePicker && (
                  <DateTimePicker
                    value={returnTime}
                    mode="time"
                    display={Platform.OS === "ios" ? "spinner" : "default"}
                    onChange={(event, time) => {
                      setShowReturnTimePicker(Platform.OS === "ios");
                      if (time) setReturnTime(time);
                    }}
                  />
                )}
              </>
            )}
          </View>

          {/* Meeting Point */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Meeting Point</Text>

            <TouchableOpacity
              style={styles.inputGroup}
              onPress={() => setShowMeetingPointSelector(true)}
            >
              <Text style={styles.inputLabel}>Location *</Text>
              <View style={styles.inputContainer}>
                <MaterialIcons name="place" size={20} color="#9CA3AF" />
                <Text
                  style={[
                    styles.inputText,
                    !meetingPoint && styles.placeholder,
                  ]}
                >
                  {meetingPoint || "Select meeting point"}
                </Text>
                <MaterialIcons name="chevron-right" size={20} color="#9CA3AF" />
              </View>
            </TouchableOpacity>

            {meetingPointAddress && (
              <Text style={styles.addressText}>{meetingPointAddress}</Text>
            )}
          </View>

          {/* Pricing */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Pricing</Text>

            <View style={styles.row}>
              <View style={[styles.inputGroup, styles.thirdWidth]}>
                <Text style={styles.inputLabel}>Currency</Text>
                <View style={styles.inputContainer}>
                  <Text style={styles.input}>{currency}</Text>
                </View>
              </View>

              <View style={[styles.inputGroup, styles.twoThirdWidth]}>
                <Text style={styles.inputLabel}>Charge per Person *</Text>
                <View style={styles.inputContainer}>
                  <MaterialIcons name="payments" size={20} color="#9CA3AF" />
                  <TextInput
                    style={styles.input}
                    placeholder="500"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="decimal-pad"
                    value={chargePerPerson}
                    onChangeText={setChargePerPerson}
                  />
                </View>
              </View>
            </View>
          </View>

          {/* Preferences */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Additional Information</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Preferences</Text>
              <TextInput
                style={styles.textArea}
                placeholder="e.g., No smoking, Pets allowed, Music okay"
                placeholderTextColor="#9CA3AF"
                value={preferences}
                onChangeText={setPreferences}
                multiline
                numberOfLines={2}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Notes</Text>
              <TextInput
                style={styles.textArea}
                placeholder="Any additional information for passengers"
                placeholderTextColor="#9CA3AF"
                value={notes}
                onChangeText={setNotes}
                multiline
                numberOfLines={3}
              />
            </View>
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>

        {/* Meeting Point Selector Modal */}
        <MeetingPointSelector
          visible={showMeetingPointSelector}
          onClose={() => setShowMeetingPointSelector(false)}
          onSelect={(point, address) => {
            setMeetingPoint(point);
            setMeetingPointAddress(address || "");
          }}
        />
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 60 : 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  saveText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6366F1",
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 16,
  },
  subsectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
    marginTop: 16,
    marginBottom: 12,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: "500",
    color: "#6B7280",
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 12,
    height: 48,
    gap: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: "#111827",
  },
  inputText: {
    flex: 1,
    fontSize: 15,
    color: "#111827",
  },
  placeholder: {
    color: "#9CA3AF",
  },
  textArea: {
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 12,
    fontSize: 15,
    color: "#111827",
    minHeight: 80,
    textAlignVertical: "top",
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  thirdWidth: {
    flex: 1,
  },
  twoThirdWidth: {
    flex: 2,
  },
  addressText: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 8,
    paddingLeft: 12,
  },
  toggleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
  },
  toggleText: {
    fontSize: 15,
    color: "#374151",
    fontWeight: "500",
  },
});
