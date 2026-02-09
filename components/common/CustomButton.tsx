import { Pressable, StyleSheet, Text } from 'react-native';

type Props = {
  title: string;
  onPress: () => void;
  filled?: boolean;
};

export default function CustomButton({ title, onPress, filled = false }: Props) {
  return (
    <Pressable
      style={[styles.button, filled ? styles.filled : styles.outlined]}
      onPress={onPress}
    >
      <Text style={[styles.text, filled ? styles.filledText : styles.outlinedText]}>
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 250,
    paddingVertical: 12,
    borderRadius: 6,
    marginVertical: 8,
    alignItems: 'center',
    borderWidth: 1,
  },
  filled: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  outlined: {
    backgroundColor: '#fff',
    borderColor: '#000',
  },
  text: {
    fontSize: 16,
  },
  filledText: {
    color: '#fff',
  },
  outlinedText: {
    color: '#000',
  },
});
