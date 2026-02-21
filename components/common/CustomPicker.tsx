import { InputStyles } from "@/constants/componentStyles";
import { Colors, Spacing } from "@/constants/styles";
import { Picker } from "@react-native-picker/picker";
import { StyleSheet, View } from "react-native";

type PickerItem = {
  label: string;
  value: string;
};

type Props = {
  selectedValue: string;
  onValueChange: (value: string) => void;
  items: PickerItem[];
};

export default function CustomPicker({
  selectedValue,
  onValueChange,
  items,
}: Props) {
  return (
    <View style={styles.container}>
      <Picker
        selectedValue={selectedValue}
        onValueChange={onValueChange}
        style={styles.picker}
      >
        {items.map((item) => (
          <Picker.Item key={item.value} label={item.label} value={item.value} />
        ))}
      </Picker>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...InputStyles.baseInput,
    marginTop: Spacing.md,
  },
  picker: {
    height: 50,
    color: Colors.text.primary,
  },
});
