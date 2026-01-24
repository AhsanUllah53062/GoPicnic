import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ExpenseEditorBottomSheet from './ExpenseEditorBottomSheet';
import TimePickerBottomSheet from './TimePickerBottomSheet';

type Props = {
  name: string;
};

export default function PlaceRow({ name }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [showTimeModal, setShowTimeModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);

  const [timeLabel, setTimeLabel] = useState<string>('');
  const [expenseLabel, setExpenseLabel] = useState<string>('');
  const [expenseIcon, setExpenseIcon] = useState<string | null>(null);

  return (
    <View style={styles.placeRow}>
      {/* Collapsible header */}
      <TouchableOpacity
        style={styles.headerRow}
        onPress={() => setExpanded(!expanded)}
      >
        <Text style={styles.placeName}>{name}</Text>
        <MaterialIcons
          name={expanded ? 'expand-less' : 'expand-more'}
          size={20}
          color="#000"
        />
      </TouchableOpacity>

      {expanded && (
        <View style={styles.details}>
          {/* Time */}
          <TouchableOpacity
            style={styles.detailRow}
            onPress={() => setShowTimeModal(true)}
          >
            <MaterialIcons name="schedule" size={22} color="#000" />
            <Text style={styles.detailText}>
              {timeLabel !== '' ? timeLabel : 'Set time'}
            </Text>
          </TouchableOpacity>

          {/* Expense */}
          <TouchableOpacity
            style={styles.detailRow}
            onPress={() => setShowExpenseModal(true)}
          >
            {expenseIcon ? (
              <MaterialIcons name={expenseIcon as any} size={22} color="#000" />
            ) : (
              <MaterialIcons name="attach-money" size={22} color="#000" />
            )}
            <Text style={styles.detailText}>
              {expenseLabel !== '' ? expenseLabel : 'Add expense'}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Time Picker Bottom Sheet */}
      <TimePickerBottomSheet
        visible={showTimeModal}
        onSave={(label: string) => {
          setTimeLabel(label);
          setShowTimeModal(false);
        }}
        onClose={() => setShowTimeModal(false)}
      />

      {/* Expense Editor Bottom Sheet */}
      <ExpenseEditorBottomSheet
        visible={showExpenseModal}
        onClose={() => setShowExpenseModal(false)}
        onSave={(expense) => {
          setExpenseLabel(`${expense.amount} ${expense.currency} - ${expense.category}`);
          // map category to icon
          const cat = categories.find((c) => c.name === expense.category);
          setExpenseIcon(cat ? cat.icon : 'attach-money');
          setShowExpenseModal(false);
        }}
      />
    </View>
  );
}

const categories = [
  { name: 'Flights', icon: 'flight' },
  { name: 'Lodging', icon: 'hotel' },
  { name: 'Car rental', icon: 'directions-car' },
  { name: 'Transit', icon: 'train' },
  { name: 'Food', icon: 'restaurant' },
  { name: 'Drinks', icon: 'local-bar' },
  { name: 'Sightseeing', icon: 'map' },
  { name: 'Activities', icon: 'sports-soccer' },
  { name: 'Shopping', icon: 'shopping-bag' },
  { name: 'Gas', icon: 'local-gas-station' },
  { name: 'Groceries', icon: 'shopping-cart' },
  { name: 'Other', icon: 'more-horiz' },
];

const styles = StyleSheet.create({
  placeRow: { marginVertical: 6, borderWidth: 1, borderColor: '#ddd', borderRadius: 8 },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
  },
  placeName: { fontSize: 14, color: '#000', fontWeight: '600' },
  details: { paddingHorizontal: 12, paddingBottom: 12 },
  detailRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  detailText: { marginLeft: 8, fontSize: 14, color: '#000' },
});
