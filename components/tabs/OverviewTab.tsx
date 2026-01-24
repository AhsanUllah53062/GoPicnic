import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTrip } from '../../src/context/TripContext';

export default function OverviewTab() {
  const { tripMeta, budget, expenses } = useTrip();
  const router = useRouter();
  const [isSaved, setIsSaved] = useState(false);

  const spentPercent = budget.total > 0 ? (budget.spent / budget.total) * 100 : 0;
  const progressWidth = Math.min(spentPercent, 100);
  const progressColor = spentPercent <= 100 ? '#007AFF' : '#FF3B30';

  return (
    <View style={styles.container}>
      {!isSaved ? (
        <>
          {/* Trip Summary */}
          <View style={styles.card}>
            <Text style={styles.title}>{tripMeta.tripName || 'Unnamed Trip'}</Text>
            <Text style={styles.subtitle}>{tripMeta.tripDates || 'No dates set'}</Text>
          </View>

          {/* Budget Summary */}
          <View style={styles.card}>
            <Text style={styles.title}>Budget</Text>
            <Text style={styles.amount}>PKR {budget.total.toFixed(2)}</Text>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${progressWidth}%`, backgroundColor: progressColor },
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              Spent: PKR {budget.spent.toFixed(2)} ({spentPercent.toFixed(0)}%)
            </Text>
          </View>

          {/* Expenses Summary */}
          <View style={styles.card}>
            <Text style={styles.title}>Recent Expenses</Text>
            {expenses.length === 0 ? (
              <Text style={styles.placeholder}>No expenses added yet.</Text>
            ) : (
              <FlatList
                data={expenses.slice(-5)} // show last 5 expenses
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <View style={styles.expenseRow}>
                    <MaterialIcons name={item.categoryIcon as any} size={20} color="#000" />
                    <Text style={styles.expenseText}>
                      {item.category} — {item.amount} {item.currency}
                    </Text>
                  </View>
                )}
              />
            )}
          </View>

          {/* Save Button */}
          <TouchableOpacity style={styles.saveBtn} onPress={() => setIsSaved(true)}>
            <Text style={styles.saveBtnText}>Save</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          {/* Collapsed Summary */}
          <View style={styles.card}>
            <Text style={styles.title}>{tripMeta.tripName || 'Unnamed Trip'}</Text>
            <Text style={styles.subtitle}>{tripMeta.tripDates || 'No dates set'}</Text>
            <Text style={styles.amount}>Budget: PKR {budget.total.toFixed(2)}</Text>
            <Text style={styles.progressText}>
              Spent: PKR {budget.spent.toFixed(2)} ({spentPercent.toFixed(0)}%)
            </Text>
          </View>

          {/* Back to Home Button */}
          <TouchableOpacity style={styles.homeBtn} onPress={() => router.push('/(tabs)')}>
            <Text style={styles.homeBtnText}>Back to Home</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f7fa', padding: 16 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  title: { fontSize: 18, fontWeight: '700', color: '#000', marginBottom: 6 },
  subtitle: { fontSize: 14, color: '#666' },
  amount: { fontSize: 16, fontWeight: '600', color: '#000', marginTop: 6 },
  progressBar: {
    height: 10,
    width: '100%',
    borderRadius: 5,
    overflow: 'hidden',
    marginTop: 8,
    backgroundColor: '#eee',
  },
  progressFill: { height: '100%', borderRadius: 5 },
  progressText: { fontSize: 12, color: '#333', marginTop: 6 },
  placeholder: { fontSize: 14, color: '#666', marginTop: 6 },
  expenseRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  expenseText: { marginLeft: 8, fontSize: 14, color: '#000' },
  saveBtn: {
    backgroundColor: '#000',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  saveBtnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  homeBtn: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 30,
  },
  homeBtnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
