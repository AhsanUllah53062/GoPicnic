// components/ReviewsModal.tsx
import { Button, FlatList, Modal, StyleSheet, Text, View } from 'react-native';

type Props = {
  visible: boolean;
  onClose: () => void;
  reviews: string[];
};

export default function ReviewsModal({ visible, onClose, reviews }: Props) {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.content}>
          <Text style={styles.title}>Reviews</Text>
          <FlatList
            data={reviews}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => <Text style={styles.review}>• {item}</Text>}
          />
          <Button title="Close" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  content: { backgroundColor: '#fff', padding: 20, borderRadius: 10, width: '80%', maxHeight: '70%' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  review: { fontSize: 14, marginBottom: 6 },
});
