import { useRouter } from 'expo-router';
import { useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

type Activity = { id: string; title: string };

export default function ItineraryBuilder() {
  const router = useRouter();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [newActivity, setNewActivity] = useState('');

  const addActivity = () => {
    if (!newActivity.trim()) return;
    setActivities([...activities, { id: Date.now().toString(), title: newActivity }]);
    setNewActivity('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Itinerary Builder</Text>

      <FlatList
        data={activities}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.activityCard}>
            <Text style={styles.activityText}>{item.title}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={{ color: '#666' }}>No activities yet</Text>}
      />

      <TextInput
        style={styles.input}
        placeholder="Add activity..."
        value={newActivity}
        onChangeText={setNewActivity}
      />

      <TouchableOpacity style={styles.primaryBtn} onPress={addActivity}>
        <Text style={styles.primaryBtnText}>Add Activity</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.primaryBtn, { marginTop: 10 }]}
        onPress={() => router.push('/trip-confirmation')}
      >
        <Text style={styles.primaryBtnText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  activityCard: {
    padding: 14, borderWidth: 1, borderColor: '#ccc', borderRadius: 6, marginBottom: 10,
  },
  activityText: { fontSize: 16 },
  input: {
    borderWidth: 1, borderColor: '#ccc', borderRadius: 6,
    padding: 12, marginTop: 20, fontSize: 16,
  },
  primaryBtn: {
    backgroundColor: '#000',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  primaryBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
