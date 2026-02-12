import * as ImagePicker from "expo-image-picker";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { Alert } from "react-native";
import app, { auth } from "./firebase";

const storage = getStorage(app);

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
      presentationStyle: "fullScreen",
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
      presentationStyle: "fullScreen",
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

    // Check authentication
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error("User not authenticated. Please log in first.");
    }
    console.log("✅ User authenticated:", currentUser.uid);

    // Fetch the image
    console.log("📥 Fetching image from URI:", uri);
    const response = await fetch(uri);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }
    const blob = await response.blob();
    console.log("✅ Image fetched, blob size:", blob.size, "bytes");

    // Create storage reference
    const storageRef = ref(storage, path);
    console.log("📍 Storage reference created for path:", path);
    console.log("📍 Storage bucket:", storage.app.options.storageBucket);

    // Upload the blob
    console.log("📤 Starting upload...");
    const uploadResult = await uploadBytes(storageRef, blob, {
      contentType: "image/jpeg",
    });
    console.log("✅ Blob uploaded, metadata:", uploadResult.metadata);

    // Get download URL
    const downloadURL = await getDownloadURL(storageRef);
    console.log("✅ Download URL obtained:", downloadURL);
    console.log("✅ Image uploaded successfully");
    return downloadURL;
  } catch (error: any) {
    console.error("❌ Error uploading image:", error);
    console.error("❌ Error code:", error.code);
    console.error("❌ Error message:", error.message);
    console.error("❌ Full error object:", JSON.stringify(error));
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
