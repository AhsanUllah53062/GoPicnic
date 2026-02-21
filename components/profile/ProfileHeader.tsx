import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import {
    ActionSheetIOS,
    ActivityIndicator,
    Alert,
    Image,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import {
    pickImage,
    takePhoto,
    uploadProfilePhoto,
} from "../../services/imageUpload";
import { updateUserProfile, UserProfile } from "../../services/profile";

type Props = {
  profile: UserProfile;
  onEditPhoto: () => void;
  onSettings: () => void;
  onPhotoUpdated?: (url: string) => void;
};

export default function ProfileHeader({
  profile,
  onEditPhoto,
  onSettings,
  onPhotoUpdated,
}: Props) {
  const [uploading, setUploading] = useState(false);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handlePhotoEdit = async () => {
    const options = ["Take Photo", "Choose from Library", "Cancel"];

    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options,
          cancelButtonIndex: 2,
        },
        async (buttonIndex) => {
          if (buttonIndex === 0) {
            await handleTakePhoto();
          } else if (buttonIndex === 1) {
            await handlePickImage();
          }
        },
      );
    } else {
      Alert.alert("Choose Photo", "Select photo source", [
        { text: "Take Photo", onPress: handleTakePhoto },
        { text: "Choose from Library", onPress: handlePickImage },
        { text: "Cancel", style: "cancel" },
      ]);
    }
  };

  const handleTakePhoto = async () => {
    const uri = await takePhoto();
    if (uri) {
      await uploadPhoto(uri);
    }
  };

  const handlePickImage = async () => {
    const uri = await pickImage();
    if (uri) {
      await uploadPhoto(uri);
    }
  };

  const uploadPhoto = async (uri: string) => {
    setUploading(true);
    try {
      const downloadURL = await uploadProfilePhoto(profile.userId, uri);
      await updateUserProfile(profile.userId, { photoURL: downloadURL });
      onPhotoUpdated?.(downloadURL);
      Alert.alert("Success", "Profile photo updated");
    } catch (error: any) {
      console.error("Upload error details:", error);
      Alert.alert(
        "Error",
        `Failed to upload photo: ${error?.message || "Unknown error"}`,
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Background Gradient */}
      <View style={styles.gradient} />

      {/* Settings Button */}
      <TouchableOpacity style={styles.settingsButton} onPress={onSettings}>
        <MaterialIcons name="more-vert" size={24} color="#fff" />
      </TouchableOpacity>

      {/* Profile Photo */}
      <View style={styles.photoContainer}>
        {profile.photoURL ? (
          <Image source={{ uri: profile.photoURL }} style={styles.photo} />
        ) : (
          <View style={styles.photoPlaceholder}>
            <Text style={styles.initials}>
              {getInitials(profile.displayName)}
            </Text>
          </View>
        )}
        <TouchableOpacity
          style={styles.editPhotoButton}
          onPress={handlePhotoEdit}
          disabled={uploading}
        >
          {uploading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <MaterialIcons name="camera-alt" size={16} color="#fff" />
          )}
        </TouchableOpacity>
      </View>

      {/* User Info */}
      <Text style={styles.name}>{profile.displayName}</Text>
      {profile.bio && <Text style={styles.bio}>{profile.bio}</Text>}

      {/* Trust Badges */}
      <View style={styles.badgesContainer}>
        {profile.trustBadges.map((badge) => (
          <View key={badge} style={styles.badge}>
            <MaterialIcons
              name={
                badge === "email"
                  ? "email"
                  : badge === "phone"
                    ? "phone"
                    : badge === "id"
                      ? "badge"
                      : "card-membership"
              }
              size={14}
              color="#10B981"
            />
            <Text style={styles.badgeText}>
              {badge === "email"
                ? "Email"
                : badge === "phone"
                  ? "Phone"
                  : badge === "id"
                    ? "ID"
                    : "License"}{" "}
              Verified
            </Text>
          </View>
        ))}
      </View>

      {/* Joined Date */}
      <Text style={styles.joinedText}>
        Joined{" "}
        {profile.joinedDate.toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
        })}
      </Text>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{profile.stats.tripsCompleted}</Text>
          <Text style={styles.statLabel}>Trips</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{profile.friends.length}</Text>
          <Text style={styles.statLabel}>Friends</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {profile.stats.driverRating.toFixed(1)}
          </Text>
          <Text style={styles.statLabel}>Rating</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    paddingTop: 20,
    paddingBottom: 32,
    alignItems: "center",
    position: "relative",
  },
  gradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 0,
    backgroundColor: "transparent",
  },
  settingsButton: {
    position: "absolute",
    top: 20,
    right: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
  },
  photoContainer: {
    position: "relative",
    marginBottom: 24,
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
  },
  photo: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
    borderColor: "#fff",
  },
  photoPlaceholder: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#fff",
  },
  initials: {
    fontSize: 38,
    fontWeight: "700",
    color: "#9CA3AF",
  },
  editPhotoButton: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#6366F1",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 6,
  },
  name: {
    fontSize: 26,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  bio: {
    fontSize: 15,
    color: "#6B7280",
    textAlign: "center",
    paddingHorizontal: 40,
    marginBottom: 16,
    lineHeight: 22,
  },
  badgesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 8,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#F0FDF4",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#DCFCE7",
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#15803D",
  },
  joinedText: {
    fontSize: 13,
    color: "#9CA3AF",
    marginBottom: 24,
    fontWeight: "500",
  },
  statsContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 14,
    gap: 20,
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#9CA3AF",
    fontWeight: "600",
    letterSpacing: 0.2,
  },
  statDivider: {
    width: 1,
    height: 36,
    backgroundColor: "#E5E7EB",
  },
});
