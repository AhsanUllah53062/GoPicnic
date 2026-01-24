import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type InboxItem = {
  id: string;
  type: 'chat' | 'notification';
  sender: string;
  message: string;
  timestamp: string;
};

const mockInbox: InboxItem[] = [
  { id: '1', type: 'notification', sender: 'Carpool', message: 'Khan wants to join your trip', timestamp: 'Sun' },
  { id: '2', type: 'chat', sender: 'Musavir256', message: 'Hi, What’s up', timestamp: 'Fri' },
  { id: '3', type: 'chat', sender: 'Khan345', message: 'How was your trip?', timestamp: '27-Feb-2022' },
  { id: '4', type: 'notification', sender: 'Go-Picnic', message: 'Your booking is confirmed', timestamp: '25-Feb-2022' },
];

export default function InboxTab() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Inbox</Text>
        <MaterialIcons name="search" size={24} color="#000" />
      </View>

      {/* List of mock messages */}
      <FlatList
        data={mockInbox}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.messageRow}
            onPress={() => {
              if (item.type === 'chat') {
                router.push({ pathname: '/chat/[username]', params: { username: item.sender } });
              } else {
                router.push({ pathname: '/notification/[id]', params: { id: item.id } });
              }
            }}
          >
            <View>
              <Text style={styles.sender}>{item.sender}</Text>
              <Text style={styles.preview}>{item.message}</Text>
            </View>
            <Text style={styles.timestamp}>{item.timestamp}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f7fa', padding: 16 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: { fontSize: 20, fontWeight: '700' },
  messageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderColor: '#ddd',
  },
  sender: { fontSize: 16, fontWeight: '600', marginBottom: 2 },
  preview: { fontSize: 13, color: '#666' },
  timestamp: { fontSize: 12, color: '#999', alignSelf: 'center' },
});
