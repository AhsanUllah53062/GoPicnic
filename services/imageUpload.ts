import * as ImagePicker from "expo-image-picker";
import { Alert } from "react-native";
import app, { auth } from "./firebase";

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
 * Upload image to Firebase Storage using REST API
 * Bypasses Firebase SDK Blob limitation in React Native
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

    // Get auth token
    const idToken = await currentUser.getIdToken();
    console.log("✅ Got ID token for upload");

    // Validate path
    if (!path || path.trim() === "") {
      throw new Error("Invalid storage path: cannot be empty");
    }

    // Fetch the image
    console.log("📥 Fetching image from URI:", uri);
    const response = await fetch(uri);
    console.log("📥 Fetch response status:", response.status);

    if (!response.ok) {
      throw new Error(`Failed to fetch image: HTTP ${response.status}`);
    }

    // Get the blob directly from the response (works in React Native)
    console.log("📥 Getting blob from response...");
    const imageBlob = await response.blob();
    console.log("✅ Image blob obtained, size:", imageBlob.size);

    // Validate size
    if (imageBlob.size === 0) {
      throw new Error(
        "Image blob is empty. Try taking or selecting a different photo.",
      );
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (imageBlob.size > maxSize) {
      console.warn(
        "⚠️ Image is large:",
        (imageBlob.size / 1024 / 1024).toFixed(2),
        "MB",
      );
    }

    // Upload using Firebase Storage REST API
    const bucket = app.options.storageBucket;
    const uploadUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket}/o?uploadType=media&name=${encodeURIComponent(path)}`;

    console.log("📤 Uploading via REST API...");
    console.log("📍 Upload URL:", uploadUrl);
    console.log("📤 Image size:", imageBlob.size, "bytes");

    const uploadResponse = await fetch(uploadUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${idToken}`,
        "Content-Type": "image/jpeg",
      },
      body: imageBlob,
    });

    console.log("📤 Upload response status:", uploadResponse.status);

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      console.error("❌ Upload response error:", errorText);
      throw new Error(
        `Upload failed: HTTP ${uploadResponse.status} - ${errorText}`,
      );
    }

    // Get download URL from REST API
    // Profile photos are publicly readable per storage rules, so no token needed
    // Add cache-busting parameter to ensure fresh image loads
    const downloadUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket}/o/${encodeURIComponent(path)}?alt=media&cb=${Date.now()}`;
    console.log("✅ Download URL:", downloadUrl);
    console.log("✅ Image uploaded successfully");

    return downloadUrl;
  } catch (error: any) {
    console.error("❌ Error in uploadImage:", error);
    console.error("❌ Error message:", error.message);
    throw new Error(
      `Failed to upload image: ${error.message || "Unknown error"}`,
    );
  }
};

/**
 * Upload profile photo
 */
export const uploadProfilePhoto = async (
  userId: string,
  uri: string,
): Promise<string> => {
  if (!userId || userId.trim() === "") {
    throw new Error("Invalid userId: cannot be empty");
  }

  // Use a timestamp to avoid caching issues and ensure unique filenames
  const timestamp = Date.now();
  const path = `users/${userId}/profile/${timestamp}.jpg`;
  return uploadImage(uri, path);
};
