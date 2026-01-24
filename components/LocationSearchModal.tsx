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

type Props = {
  visible: boolean;
  onClose: () => void;
  onSelect: (location: string) => void;
};

// Sample fallback destinations
const sampleLocations = [
  'Karachi, Pakistan',
  'Lahore, Pakistan',
  'Islamabad, Pakistan',
  'Quetta, Pakistan',
  'Peshawar, Pakistan',
];

export default function LocationSearchModal({ visible, onClose, onSelect }: Props) {
  const [query, setQuery] = useState('');

  const filtered = sampleLocations.filter((loc) =>
    loc.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Search location..."
          value={query}
          onChangeText={setQuery}
        />

        <FlatList
          data={filtered}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.item}
              onPress={() => {
                onSelect(item);
                onClose();
              }}
            >
              <Text style={styles.itemText}>{item}</Text>
            </TouchableOpacity>
          )}
        />

        <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
          <Text style={styles.closeText}>Close</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  item: { padding: 14, borderBottomWidth: 1, borderBottomColor: '#eee' },
  itemText: { fontSize: 16 },
  closeBtn: {
    marginTop: 20,
    backgroundColor: '#000',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeText: { color: '#fff', fontWeight: 'bold' },
});
