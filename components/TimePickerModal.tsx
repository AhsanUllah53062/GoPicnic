import DateTimePicker from '@react-native-community/datetimepicker';
import { useState } from 'react';
import {
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

type Props = {
  visible: boolean;
  onSave: (label: string) => void;
  onClose: () => void;
};

export default function TimePickerBottomSheet({ visible, onSave, onClose }: Props) {
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [showPicker, setShowPicker] = useState<'start' | 'end' | null>(null);

  const formatTime = (date: Date | null) => {
    if (!date) return 'Not set';
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <Text style={styles.title}>Select Time</Text>

          <TouchableOpacity onPress={() => setShowPicker('start')}>
            <Text style={styles.field}>Start Time: {formatTime(startTime)}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setShowPicker('end')}>
            <Text style={styles.field}>End Time: {formatTime(endTime)}</Text>
          </TouchableOpacity>

          {showPicker && (
            <DateTimePicker
              value={new Date()}
              mode="time"
              display="clock"
              onChange={(event, date) => {
                if (date) {
                  if (showPicker === 'start') setStartTime(date);
                  else setEndTime(date);
                }
                setShowPicker(null);
              }}
            />
          )}

          <TouchableOpacity
            style={styles.saveBtn}
            onPress={() => {
              const label = `${formatTime(startTime)} - ${formatTime(endTime)}`;
              onSave(label);
            }}
          >
            <Text style={styles.saveText}>Save</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.3)' },
  sheet: { backgroundColor: '#fff', borderTopLeftRadius: 16, borderTopRightRadius: 16, padding: 20 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  field: { fontSize: 16, marginVertical: 12 },
  saveBtn: {
    marginTop: 20,
    backgroundColor: '#000',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveText: { color: '#fff', fontWeight: 'bold' },
  closeBtn: { marginTop: 10, alignItems: 'center' },
  closeText: { color: '#000', fontWeight: 'bold' },
});
