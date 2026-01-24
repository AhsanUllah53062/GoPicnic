// components/TemperatureModal.tsx
import { Button, Modal, StyleSheet, Text, View } from 'react-native';

type Props = {
  visible: boolean;
  onClose: () => void;
  temperature: string;
};

export default function TemperatureModal({ visible, onClose, temperature }: Props) {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.content}>
          <Text style={styles.title}>Temperature Details</Text>
          <Text style={styles.value}>{temperature}</Text>
          {/* Later: add chart or forecast here */}
          <Button title="Close" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  content: { backgroundColor: '#fff', padding: 20, borderRadius: 10, width: '80%' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  value: { fontSize: 18, marginBottom: 20 },
});
