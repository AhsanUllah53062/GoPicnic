import { MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useState } from 'react';
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTrip } from '../../src/context/TripContext';
import CarpoolPlaceCard from '../CarpoolPlaceCard';

export default function CarpoolTab() {
  const { carpools, setCarpools } = useTrip();

  const [driverName, setDriverName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [seats, setSeats] = useState('');
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [meetingPoint, setMeetingPoint] = useState('');
  const [showMeetingModal, setShowMeetingModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [carModel, setCarModel] = useState('');
  const [charge, setCharge] = useState('');
  const [note, setNote] = useState('');
  const [showForm, setShowForm] = useState(false); // ✅ default false

  const mockLocations = [
    'University Gate',
    'Mall Entrance',
    'Bus Stop',
    'Main Square',
    'City Center',
  ];

  const validateAndSave = () => {
    if (!driverName.trim()) return Alert.alert('Validation', 'Driver name is required');
    if (!contactNumber.trim()) return Alert.alert('Validation', 'Contact number is required');
    if (!seats || parseInt(seats) <= 0) return Alert.alert('Validation', 'Seats must be > 0');
    if (!date || !time) return Alert.alert('Validation', 'Date and time are required');
    if (!meetingPoint.trim()) return Alert.alert('Validation', 'Meeting point is required');
    if (!carModel.trim()) return Alert.alert('Validation', 'Car model is required');
    if (!charge || parseFloat(charge) <= 0) return Alert.alert('Validation', 'Charge must be > 0');

    const carpoolObj = {
      id: Date.now().toString(),
      driverName,
      contactNumber,
      seats: parseInt(seats),
      departure: `${date.toLocaleDateString()} ${time.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })}`,
      meetingPoint,
      carModel,
      charge: parseFloat(charge),
      note,
    };

    setCarpools(prev => [...prev, carpoolObj]);
    setShowForm(false);
    Alert.alert('Success', 'Carpool created successfully!');
  };

  const resetForm = () => {
    setDriverName('');
    setContactNumber('');
    setSeats('');
    setDate(null);
    setTime(null);
    setMeetingPoint('');
    setCarModel('');
    setCharge('');
    setNote('');
  };

  const handleCreateNew = () => {
    resetForm();
    setShowForm(true);
  };

  const handleEditCard = (carpool: any) => {
    // preload values for editing
    setDriverName(carpool.driverName);
    setContactNumber(carpool.contactNumber);
    setSeats(carpool.seats.toString());
    setDate(new Date(carpool.departure.split(' ')[0]));
    setTime(new Date());
    setMeetingPoint(carpool.meetingPoint);
    setCarModel(carpool.carModel);
    setCharge(carpool.charge.toString());
    setNote(carpool.note);
    setShowForm(true);
  };

  const filteredLocations = mockLocations.filter(loc =>
    loc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      {showForm ? (
        <>
          <Text style={styles.heading}>Create Carpool</Text>

          {/* Driver Name */}
          <View style={styles.inputRow}>
            <MaterialIcons name="person" size={22} color="#000" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Driver Name"
              value={driverName}
              onChangeText={setDriverName}
            />
          </View>

          {/* Contact Number */}
          <View style={styles.inputRow}>
            <MaterialIcons name="phone" size={22} color="#000" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Contact Number"
              keyboardType="phone-pad"
              value={contactNumber}
              onChangeText={setContactNumber}
            />
          </View>

          {/* Seats */}
          <View style={styles.inputRow}>
            <MaterialIcons name="event-seat" size={22} color="#000" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Available Seats"
              keyboardType="numeric"
              value={seats}
              onChangeText={setSeats}
            />
          </View>

          {/* Date */}
          <TouchableOpacity style={styles.inputRow} onPress={() => setShowDatePicker(true)}>
            <MaterialIcons name="calendar-today" size={22} color="#000" style={styles.icon} />
            <Text style={styles.inputText}>
              {date ? date.toLocaleDateString() : 'Select Date'}
            </Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={date || new Date()}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                if (event.type === 'set' && selectedDate) setDate(selectedDate);
                setShowDatePicker(false);
              }}
            />
          )}

          {/* Time */}
          <TouchableOpacity style={styles.inputRow} onPress={() => setShowTimePicker(true)}>
            <MaterialIcons name="access-time" size={22} color="#000" style={styles.icon} />
            <Text style={styles.inputText}>
              {time
                ? time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                : 'Select Time'}
            </Text>
          </TouchableOpacity>
          {showTimePicker && (
            <DateTimePicker
              value={time || new Date()}
              mode="time"
              display="default"
              onChange={(event, selectedTime) => {
                if (event.type === 'set' && selectedTime) setTime(selectedTime);
                setShowTimePicker(false);
              }}
            />
          )}

          {/* Meeting Point */}
          <TouchableOpacity style={styles.inputRow} onPress={() => setShowMeetingModal(true)}>
            <MaterialIcons name="place" size={22} color="#000" style={styles.icon} />
            <Text style={styles.inputText}>
              {meetingPoint || 'Select Meeting Point'}
            </Text>
          </TouchableOpacity>

          <Modal visible={showMeetingModal} transparent animationType="slide">
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Search Meeting Point</Text>
                <TextInput
                  style={styles.inputField}
                  placeholder="Search..."
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
                {filteredLocations.map(loc => (
                  <TouchableOpacity
                    key={loc}
                    style={styles.modalOption}
                    onPress={() => {
                      setMeetingPoint(loc);
                      setShowMeetingModal(false);
                      setSearchQuery('');
                    }}
                  >
                    <Text style={styles.modalOptionText}>{loc}</Text>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity style={styles.modalBtn} onPress={() => setShowMeetingModal(false)}>
                  <Text style={styles.modalBtnText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          {/* Car Model */}
          <View style={styles.inputRow}>
            <MaterialIcons name="directions-car" size={22} color="#000" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Car Model"
              value={carModel}
              onChangeText={setCarModel}
            />
          </View>

          {/* Charge */}
          <View style={styles.inputRow}>
            <MaterialIcons name="attach-money" size={22} color="#000" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Charge per Person"
              keyboardType="numeric"
              value={charge}
              onChangeText={setCharge}
            />
          </View>

                    {/* Note */}
          <View style={styles.inputRow}>
            <MaterialIcons name="note" size={22} color="#000" style={styles.icon} />
            <TextInput
              style={[styles.input, { height: 80 }]}
              placeholder="Leave a Note"
              multiline
              value={note}
              onChangeText={setNote}
            />
          </View>

          {/* Save Button */}
          <TouchableOpacity style={styles.saveBtn} onPress={validateAndSave}>
            <Text style={styles.saveBtnText}>Save</Text>
          </TouchableOpacity>
        </>
      ) : carpools.length === 0 ? (
        // ✅ Empty state if no carpools exist
        <View style={{ alignItems: 'center', marginTop: 40 }}>
          <Text style={{ fontSize: 16, color: '#555', marginBottom: 20 }}>
            No carpool created yet. You can add one anytime.
          </Text>
          <TouchableOpacity style={styles.newBtn} onPress={handleCreateNew}>
            <Text style={styles.newBtnText}>Create Carpool</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {/* Create New Carpool Button */}
          <TouchableOpacity style={styles.newBtn} onPress={handleCreateNew}>
            <Text style={styles.newBtnText}>Create New Carpool</Text>
          </TouchableOpacity>

          {/* Show Saved Carpools */}
          {carpools.map(c => (
            <CarpoolPlaceCard key={c.id} carpool={c} onPress={() => handleEditCard(c)} />
          ))}
        </>
      )}
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    color: '#222',
    marginBottom: 24,
    textAlign: 'center',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  icon: { marginRight: 10 },
  input: { flex: 1, fontSize: 16, color: '#000' },
  inputText: { flex: 1, fontSize: 16, color: '#555' },
  inputField: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: '#000',
    marginBottom: 18,
  },
  saveBtn: {
    backgroundColor: '#000', // default black
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 3,
  },
  saveBtnText: { color: '#fff', fontSize: 17, fontWeight: '600' },
  newBtn: {
    backgroundColor: '#000', // default black
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 3,
  },
  newBtnText: { color: '#fff', fontSize: 17, fontWeight: '600' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    width: '85%',
    borderRadius: 14,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
    color: '#222',
    textAlign: 'center',
  },
  modalOption: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalOptionText: { fontSize: 16, color: '#333' },
  modalBtn: { marginTop: 16, alignSelf: 'flex-end' },
  modalBtnText: { fontSize: 15, color: '#007AFF', fontWeight: '500' },
});
