// components/SectionHeader.tsx
import { StyleSheet, Text } from 'react-native';

type SectionHeaderProps = {
  title: string;
};

export default function SectionHeader({ title }: SectionHeaderProps) {
  return <Text style={styles.header}>{title}</Text>;
}

const styles = StyleSheet.create({
  header: { fontSize: 20, fontWeight: 'bold', marginVertical: 15 },
});
