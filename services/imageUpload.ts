import * as ImagePicker from "expo-image-picker";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { Alert } from "react-native";

const storage = getStorage();

/**
 * Request camera permissions
 */
export const requestCameraPermission = async (): Promise<boolean> => {
  const { status } = await ImagePicker.requestCameraPermissionsAsync();

  if (status !== "granted") {
    Alert.alert(
      "Permission Required",
      "Camera permission is required to take photos",
    );
    return false;
  }

  return true;
};

/**
 * Request gallery permissions
 */
export const requestGalleryPermission = async (): Promise<boolean> => {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (status !== "granted") {
    Alert.alert(
      "Permission Required",
      "Gallery permission is required to select photos",
    );
    return false;
  }

  return true;
};

/**
 * Take photo with camera
 */
export const takePhoto = async (): Promise<string | null> => {
  try {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) return null;

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      return result.assets[0].uri;
    }

    return null;
  } catch (error) {
    console.error("Error taking photo:", error);
    Alert.alert("Error", "Failed to take photo");
    return null;
  }
};

/**
 * Pick image from gallery
 */
export const pickImage = async (): Promise<string | null> => {
  try {
    const hasPermission = await requestGalleryPermission();
    if (!hasPermission) return null;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      return result.assets[0].uri;
    }

    return null;
  } catch (error) {
    console.error("Error picking image:", error);
    Alert.alert("Error", "Failed to pick image");
    return null;
  }
};

/**
 * Upload image to Firebase Storage
 */
export const uploadImage = async (
  uri: string,
  path: string,
): Promise<string> => {
  try {
    console.log("📤 Uploading image to:", path);

    // Fetch the image
    const response = await fetch(uri);
    const blob = await response.blob();

    // Create storage reference
    const storageRef = ref(storage, path);

    // Upload the blob
    await uploadBytes(storageRef, blob);

    // Get download URL
    const downloadURL = await getDownloadURL(storageRef);

    console.log("✅ Image uploaded successfully");
    return downloadURL;
  } catch (error: any) {
    console.error("❌ Error uploading image:", error);
    throw new Error(`Failed to upload image: ${error.message}`);
  }
};

/**
 * Upload profile photo
 */
export const uploadProfilePhoto = async (
  userId: string,
  uri: string,
): Promise<string> => {
  const path = `users/${userId}/profile.jpg`;
  return uploadImage(uri, path);
};
