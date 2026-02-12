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
    paddingTop: 60,
    paddingBottom: 24,
    alignItems: "center",
    position: "relative",
  },
  gradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 180,
    backgroundColor: "#6366F1",
  },
  settingsButton: {
    position: "absolute",
    top: 60,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
  },
  photoContainer: {
    position: "relative",
    marginBottom: 16,
  },
  photo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: "#fff",
  },
  photoPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: "#fff",
  },
  initials: {
    fontSize: 32,
    fontWeight: "700",
    color: "#6B7280",
  },
  editPhotoButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#6366F1",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  name: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  bio: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    paddingHorizontal: 40,
    marginBottom: 12,
  },
  badgesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 8,
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#D1FAE5",
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#059669",
  },
  joinedText: {
    fontSize: 13,
    color: "#9CA3AF",
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    gap: 24,
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "500",
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: "#E5E7EB",
  },
});
