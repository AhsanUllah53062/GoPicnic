import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { Todo } from "../../services/itinerary";

type Props = {
  todo: Todo;
  onUpdate: (updates: Partial<Todo>) => void;
  onDelete: () => void;
};

export default function TodoItem({ todo, onUpdate, onDelete }: Props) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => onUpdate({ done: !todo.done })}
        style={styles.checkbox}
      >
        <MaterialIcons
          name={todo.done ? "check-box" : "check-box-outline-blank"}
          size={24}
          color={todo.done ? "#34C759" : "#C7C7CC"}
        />
      </TouchableOpacity>

      <TextInput
        style={[styles.input, todo.done && styles.inputCompleted]}
        placeholder="Enter to-do item..."
        placeholderTextColor="#C7C7CC"
        value={todo.text}
        onChangeText={(text) => onUpdate({ text })}
      />

      <TouchableOpacity onPress={onDelete} style={styles.deleteBtn}>
        <MaterialIcons name="close" size={20} color="#FF3B30" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  checkbox: {
    padding: 4,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: "#000",
    paddingVertical: 8,
  },
  inputCompleted: {
    textDecorationLine: "line-through",
    color: "#8E8E93",
  },
  deleteBtn: {
    padding: 4,
  },
});
