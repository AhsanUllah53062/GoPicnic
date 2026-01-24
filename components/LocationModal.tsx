// components/LocationModal.tsx
import { Button, Modal, StyleSheet, Text, View } from 'react-native';
// Later: import MapView from 'react-native-maps'

type Props = {
  visible: boolean;
  onClose: () => void;
  location: string;
};

export default function LocationModal({ visible, onClose, location }: Props) {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.content}>
          <Text style={styles.title}>Location</Text>
          <Text>{location}</Text>
          {/* Later: replace with <MapView /> */}
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
});
