import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { NewExpense, useTrip } from '../src/context/TripContext';
import PlaceRow from './PlaceRow';

const mockPlaces = [
  'Clifton, Karachi',
  'Dolmen Mall Clifton',
  'Port Grand Karachi',
  'Pakistan Maritime Museum',
];

type Props = {
  dateLabel: string;
  dayIndex: number;
  date: Date;
};

export default function DayCard({ dateLabel, dayIndex, date }: Props) {
  const { setItinerary, addExpense } = useTrip();
  const [expanded, setExpanded] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [places, setPlaces] = useState<string[]>([]);
  const [notes, setNotes] = useState<string[]>([]);
  const [todos, setTodos] = useState<{ text: string; done: boolean }[]>([]);
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseCategory, setExpenseCategory] = useState('');

  // 🔑 Sync local changes into TripContext
  const syncToContext = () => {
    const updatedDay = { dayIndex, date, places, notes, todos };
    setItinerary(prev => {
      const others = prev.filter(d => d.dayIndex !== dayIndex);
      return [...others, updatedDay];
    });
  };

  const addPlaceWithExpense = (place: string) => {
    setPlaces([...places, place]);
    syncToContext();

    if (expenseAmount.trim()) {
      const newExpense: NewExpense = {
        amount: expenseAmount,
        currency: 'PKR',
        category: expenseCategory || 'General',
        categoryIcon: 'attach-money',
        paidBy: 'You',
        split: 'Equal',
        date: date.toDateString(),
        description: `Expense for ${place}`,
      };
      addExpense(newExpense); // ✅ context generates id
    }

    // reset
    setExpenseAmount('');
    setExpenseCategory('');
    setShowModal(false);
  };

  return (
    <View style={styles.card}>
      <TouchableOpacity style={styles.headerRow} onPress={() => setExpanded(!expanded)}>
        <Text style={styles.dateText}>{dateLabel}</Text>
        <MaterialIcons name={expanded ? 'expand-less' : 'expand-more'} size={22} color="#000" />
      </TouchableOpacity>

      {expanded && (
        <View style={styles.details}>
          {/* Notes */}
          {notes.map((note, i) => (
            <View key={i} style={styles.noteRow}>
              <TextInput
                style={styles.notesField}
                placeholder="Write notes..."
                value={note}
                onChangeText={(text) => {
                  const updated = [...notes];
                  updated[i] = text;
                  setNotes(updated);
                  syncToContext();
                }}
                multiline
              />
              <TouchableOpacity onPress={() => {
                const updated = notes.filter((_, idx) => idx !== i);
                setNotes(updated);
                syncToContext();
              }}>
                <MaterialIcons name="delete" size={22} color="#000" />
              </TouchableOpacity>
            </View>
          ))}

          {/* Add Place */}
          <TouchableOpacity style={styles.addBtn} onPress={() => setShowModal(true)}>
            <MaterialIcons name="add-location" size={20} color="#fff" />
            <Text style={styles.addBtnText}>Add a place</Text>
          </TouchableOpacity>

          {places.map((p, i) => (
            <PlaceRow key={i} name={p} />
          ))}

          {/* Actions */}
          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.iconBtn} onPress={() => {
              setNotes([...notes, '']);
              syncToContext();
            }}>
              <MaterialIcons name="note-add" size={22} color="#000" />
              <Text style={styles.iconLabel}>Notes</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.iconBtn} onPress={() => {
              if (todos.length === 0 || todos[todos.length - 1].text.trim() !== '') {
                setTodos([...todos, { text: '', done: false }]);
                syncToContext();
              }
            }}>
              <MaterialIcons name="checklist" size={22} color="#000" />
              <Text style={styles.iconLabel}>Todo</Text>
            </TouchableOpacity>
          </View>

          {/* Todos */}
          {todos.map((t, i) => (
            <View key={i} style={styles.todoRow}>
              <TouchableOpacity onPress={() => {
                const updated = [...todos];
                updated[i].done = !updated[i].done;
                setTodos(updated);
                syncToContext();
              }}>
                <MaterialIcons
                  name={t.done ? 'check-box' : 'check-box-outline-blank'}
                  size={20}
                  color="#000"
                />
              </TouchableOpacity>
              <TextInput
                style={[
                  styles.todoText,
                  t.done && { textDecorationLine: 'line-through', color: '#888' },
                ]}
                placeholder="Enter item..."
                value={t.text}
                onChangeText={(text) => {
                  const updated = [...todos];
                  updated[i].text = text;
                  setTodos(updated);
                  syncToContext();
                }}
              />
              <TouchableOpacity onPress={() => {
                const updated = todos.filter((_, idx) => idx !== i);
                setTodos(updated);
                syncToContext();
              }}>
                <MaterialIcons name="delete" size={20} color="#000" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      {/* Modal for mock places + expense */}
      <Modal visible={showModal} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Select a place & expense</Text>
          <FlatList
            data={mockPlaces}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.modalItem} onPress={() => addPlaceWithExpense(item)}>
                <Text style={styles.modalItemText}>{item}</Text>
              </TouchableOpacity>
            )}
          />

          <TextInput
            style={styles.notesField}
            placeholder="Expense Amount"
            keyboardType="numeric"
            value={expenseAmount}
            onChangeText={setExpenseAmount}
          />
          <TextInput
            style={styles.notesField}
            placeholder="Expense Category"
            value={expenseCategory}
            onChangeText={setExpenseCategory}
          />

          <TouchableOpacity style={styles.closeBtn} onPress={() => setShowModal(false)}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#eee',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  dateText: { fontSize: 16, fontWeight: 'bold', color: '#000' },
  details: { marginTop: 10 },
  noteRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  notesField: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    fontSize: 14,
    color: '#000',
    marginBottom: 10,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 6,
    marginTop: 10,
    marginBottom: 20,
  },
  addBtnText: { color: '#fff', fontSize: 14, fontWeight: 'bold', marginLeft: 8 },
  actionsRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 10 },
  iconBtn: { flexDirection: 'row', alignItems: 'center' },
  iconLabel: { marginLeft: 6, fontSize: 14, color: '#000' },
  todoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
    todoText: { flex: 1, fontSize: 14, color: '#000', marginLeft: 8 },
  modalContainer: { flex: 1, padding: 20, backgroundColor: '#fff' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  modalItem: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#eee' },
  modalItemText: { fontSize: 14, color: '#000' },
  closeBtn: {
    marginTop: 20,
    backgroundColor: '#000',
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  closeText: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
});
