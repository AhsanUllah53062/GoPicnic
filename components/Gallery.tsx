import { Asset } from 'expo-asset';
import { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import ImageViewing from 'react-native-image-viewing';
import ImageItem from './ImageItem';

type Props = {
  images: (number | { uri: string })[];   // ✅ supports require() and remote
};

export default function Gallery({ images }: Props) {
  const [visible, setVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openViewer = (index: number) => {
    setCurrentIndex(index);
    setVisible(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gallery</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {images.map((img, idx) => (
          <ImageItem key={idx} source={img} onPress={() => openViewer(idx)} />
        ))}
      </ScrollView>

      <ImageViewing
        images={images.map((img) => {
          if (typeof img === 'number') {
            const asset = Asset.fromModule(img);
            return { uri: asset.uri };
          } else if ('uri' in img) {
            return { uri: img.uri };
          }
          return { uri: '' };
        })}
        imageIndex={currentIndex}
        visible={visible}
        onRequestClose={() => setVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 20 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
});
