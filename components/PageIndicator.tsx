import { StyleSheet, View } from 'react-native';

export default function PageIndicator() {
  return <View style={styles.line} />;
}

const styles = StyleSheet.create({
  line: {
    width: 30,
    height: 3,
    backgroundColor: '#000',
    marginBottom: 40,
  },
});
