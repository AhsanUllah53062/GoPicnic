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

type Expense = {
  amount: string;
  currency: string;
  category: string;
  categoryIcon: string;
  paidBy: string;
  split: string;
};

type Props = {
  visible: boolean;
  onClose: () => void;
  onSave?: (expense: Expense) => void;
};

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

export default function ExpenseEditorBottomSheet({ visible, onClose, onSave }: Props) {
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [showCurrencyPopup, setShowCurrencyPopup] = useState(false);

  const [category, setCategory] = useState('Shopping');
  const [categoryIcon, setCategoryIcon] = useState('shopping-bag');
  const [showCategoryPopup, setShowCategoryPopup] = useState(false);

  const [paidBy, setPaidBy] = useState('You');
  const [showPaidByPopup, setShowPaidByPopup] = useState(false);

  const [split, setSplit] = useState('Don\'t split');
  const [showSplitPopup, setShowSplitPopup] = useState(false);

  const currencies = ['USD', 'PKR', 'EUR', 'GBP', 'INR', 'CNY'];

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => {
                onSave?.({ amount, currency, category, categoryIcon, paidBy, split });
                onClose();
              }}
            >
              <Text style={styles.doneText}>Done</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Add Expense</Text>
            <View style={{ width: 40 }} />
          </View>

          {/* Currency + Amount */}
          <View style={styles.row}>
            <TouchableOpacity onPress={() => setShowCurrencyPopup(true)} style={styles.field}>
              <Text>{currency}</Text>
              <MaterialIcons name="arrow-drop-down" size={22} />
            </TouchableOpacity>
            <TextInput
              style={styles.amountInput}
              placeholder="Amount"
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
            />
          </View>

          {/* Category */}
          <TouchableOpacity style={styles.row} onPress={() => setShowCategoryPopup(true)}>
            <Text style={styles.fieldText}>{category}</Text>
            <MaterialIcons name={categoryIcon as any} size={22} />
          </TouchableOpacity>

          {/* Paid By */}
          <TouchableOpacity style={styles.row} onPress={() => setShowPaidByPopup(true)}>
            <MaterialIcons name="person" size={22} />
            <Text style={styles.fieldText}>Paid by: {paidBy}</Text>
          </TouchableOpacity>

          {/* Split */}
          <TouchableOpacity style={styles.row} onPress={() => setShowSplitPopup(true)}>
            <MaterialIcons name="group" size={22} />
            <Text style={styles.fieldText}>Split: {split}</Text>
          </TouchableOpacity>

          {/* Save button */}
          <TouchableOpacity
            style={styles.saveBtn}
            onPress={() => {
              onSave?.({ amount, currency, category, categoryIcon, paidBy, split });
              onClose();
            }}
          >
            <Text style={styles.saveText}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Currency Popup */}
      {showCurrencyPopup && (
        <Modal transparent animationType="fade">
          <View style={styles.popupOverlay}>
            <View style={styles.popup}>
              <FlatList
                data={currencies}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.popupItem}
                    onPress={() => {
                      setCurrency(item);
                      setShowCurrencyPopup(false);
                    }}
                  >
                    <Text>{item}</Text>
                  </TouchableOpacity>
                )}
              />
              <TouchableOpacity onPress={() => setShowCurrencyPopup(false)}>
                <Text style={styles.closePopup}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      {/* Category Popup */}
      {showCategoryPopup && (
        <Modal transparent animationType="fade">
          <View style={styles.popupOverlay}>
            <View style={styles.popupGrid}>
              {categories.map((c) => (
                <TouchableOpacity
                  key={c.name}
                  style={styles.categoryItem}
                  onPress={() => {
                    setCategory(c.name);
                    setCategoryIcon(c.icon);
                    setShowCategoryPopup(false);
                  }}
                >
                  <MaterialIcons name={c.icon as any} size={28} />
                  <Text>{c.name}</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity onPress={() => setShowCategoryPopup(false)}>
                <Text style={styles.closePopup}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      {/* Paid By Popup */}
      {showPaidByPopup && (
        <Modal transparent animationType="fade">
          <View style={styles.popupOverlay}>
            <View style={styles.popup}>
              <TouchableOpacity
                style={styles.popupItem}
                onPress={() => {
                  setPaidBy('You');
                  setShowPaidByPopup(false);
                }}
              >
                <Text>You</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setShowPaidByPopup(false)}>
                <Text style={styles.closePopup}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      {/* Split Popup */}
      {showSplitPopup && (
        <Modal transparent animationType="fade">
          <View style={styles.popupOverlay}>
            <View style={styles.popup}>
              {['Don\'t split', 'Individual', 'Equal split'].map((opt) => (
                <TouchableOpacity
                  key={opt}
                  style={styles.popupItem}
                  onPress={() => {
                    setSplit(opt);
                    setShowSplitPopup(false);
                  }}
                >
                  <Text>{opt}</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity onPress={() => setShowSplitPopup(false)}>
                <Text style={styles.closePopup}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </Modal>
  );
}
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  doneText: {
    fontSize: 16,
    color: '#000',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    justifyContent: 'space-between',
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fieldText: {
    fontSize: 16,
  },
  amountInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 8,
    flex: 1,
    marginLeft: 10,
  },
  saveBtn: {
    marginTop: 20,
    backgroundColor: '#000',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  popupOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  popup: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    width: '80%',
  },
  popupGrid: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    width: '90%',
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  popupItem: {
    padding: 12,
  },
  categoryItem: {
    alignItems: 'center',
    margin: 12,
  },
  closePopup: {
    marginTop: 20,
    textAlign: 'center',
    color: '#000',
    fontWeight: 'bold',
  },
});

