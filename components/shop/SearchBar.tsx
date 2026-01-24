import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

type SearchBarProps = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
};

export default function SearchBar({
  value,
  onChangeText,
  placeholder = 'Search products...',
}: SearchBarProps) {
  return (
    <View style={styles.container}>
      {/* Search icon */}
      <Ionicons name="search" size={20} color="#999" style={styles.icon} />

      {/* Input */}
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#999"
      />

      {/* Clear (X) icon */}
      {value.length > 0 && (
        <TouchableOpacity onPress={() => onChangeText('')}>
          <Ionicons name="close-circle" size={20} color="#999" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 40,
    flex: 1,
  },
  icon: {
    marginRight: 6,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
});
