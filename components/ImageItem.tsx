// components/ImageItem.tsx
import { Image, ImageSourcePropType, StyleSheet, TouchableOpacity } from 'react-native';

type Props = {
  source: ImageSourcePropType;
  onPress?: () => void;
};

export default function ImageItem({ source, onPress }: Props) {
  return (
    <TouchableOpacity onPress={onPress}>
      <Image source={source} style={styles.image} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  image: {
    width: 120,
    height: 80,
    borderRadius: 8,
    marginRight: 10,
  },
});
