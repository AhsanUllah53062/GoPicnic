import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import ProfileHeader from "../../components/profile/ProfileHeader";
import ProfileMenuItem from "../../components/profile/ProfileMenuItem";
import SettingsModal from "../../components/profile/SettingsModal";
import TripCard from "../../components/profile/TripCard";
import { auth } from "../../services/firebase";
import { getUserProfile, UserProfile } from "../../services/profile";
import { getUserTrips, Trip } from "../../services/trips";
import { useUser } from "../../src/context/UserContext";

export default function ProfileTab() {
  const router = useRouter();
  const { user, setUser } = useUser();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    if (user) {
      loadProfile();
      loadTrips();
    }
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;

    try {
      let userProfile = await getUserProfile(user.id);

      // Create default profile if doesn't exist
      if (!userProfile) {
        userProfile = {
          userId: user.id,
          displayName: user.name,
          email: user.email,
          joinedDate: new Date(),
          trustBadges: ["email"],
          stats: {
            tripsCompleted: 0,
            carpoolMiles: 0,
            seatsOffered: 0,
            driverRating: 0,
          },
          favoritePlaces: [],
          friends: [],
          gearInventory: [],
          emergencyContacts: [],
          preferences: {
            places: {
              terrain: [],
              maxDistance: 100,
              amenities: [],
            },
            weather: {
              idealTemp: { min: 15, max: 30 },
              rainAlerts: true,
            },
            people: {
              maxGroupSize: 10,
              friendsOnlyCarpooling: false,
            },
            carpoolVibes: [],
          },
          documents: {},
        };
      }

      setProfile(userProfile);
    } catch (error) {
      console.error("Error loading profile:", error);
      Alert.alert("Error", "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const loadTrips = async () => {
    if (!user) return;

    try {
      const userTrips = await getUserTrips(user.id);
      setTrips(userTrips);
    } catch (error) {
      console.error("Error loading trips:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      router.replace("/(auth)/welcome");
    } catch (error) {
      Alert.alert("Error", "Failed to logout");
    }
  };

  const upcomingTrips = trips.filter((t) => new Date(t.startDate) > new Date());
  const pastTrips = trips.filter((t) => new Date(t.endDate) < new Date());

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366F1" />
      </View>
    );
  }

  if (!profile || !user) {
    return (
      <View style={styles.errorContainer}>
        <MaterialIcons name="error-outline" size={48} color="#EF4444" />
        <Text style={styles.errorText}>Profile not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <ProfileHeader
          profile={profile}
          onEditPhoto={() => {}} // Not needed anymore, handled in component
          onSettings={() => setShowSettings(true)}
          onPhotoUpdated={(url) => {
            setProfile({ ...profile, photoURL: url });
          }}
        />

        {/* Trip Dashboard */}
        {(upcomingTrips.length > 0 || pastTrips.length > 0) && (
          <View style={styles.section}>
            {upcomingTrips.length > 0 && (
              <>
                <Text style={styles.sectionTitle}>Upcoming Trips</Text>
                <FlatList
                  horizontal
                  data={upcomingTrips}
                  keyExtractor={(item) => item.id!}
                  renderItem={({ item }) => (
                    <TripCard
                      trip={item}
                      onPress={() =>
                        router.push({
                          pathname: "/trip-details/trip-details",
                          params: { tripId: item.id },
                        })
                      }
                    />
                  )}
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.tripsList}
                />
              </>
            )}

            {pastTrips.length > 0 && (
              <>
                <Text style={[styles.sectionTitle, { marginTop: 24 }]}>
                  Past Picnics
                </Text>
                <FlatList
                  horizontal
                  data={pastTrips}
                  keyExtractor={(item) => item.id!}
                  renderItem={({ item }) => (
                    <TripCard
                      trip={item}
                      onPress={() =>
                        router.push({
                          pathname: "/trip-details/trip-details",
                          params: { tripId: item.id },
                        })
                      }
                    />
                  )}
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.tripsList}
                />
              </>
            )}
          </View>
        )}

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Access</Text>
          <View style={styles.menuCard}>
            <ProfileMenuItem
              icon="favorite"
              iconColor="#EC4899"
              iconBgColor="#FCE7F3"
              title="Favorite Places"
              subtitle={`${profile.favoritePlaces.length} saved spots`}
              onPress={() => router.push("/profile/favorites")}
            />
            <ProfileMenuItem
              icon="group"
              iconColor="#14B8A6"
              iconBgColor="#CCFBF1"
              title="Friends & Connections"
              subtitle={`${profile.friends.length} connections`}
              onPress={() => router.push("/profile/friends")}
            />
            <ProfileMenuItem
              icon="backpack"
              iconColor="#F59E0B"
              iconBgColor="#FEF3C7"
              title="The Picnic Trunk"
              subtitle={`${profile.gearInventory.length} items in inventory`}
              onPress={() => router.push("/profile/gear")}
            />
          </View>
        </View>

        {/* Carpool Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Carpool Statistics</Text>
          <View style={styles.statsCard}>
            <View style={styles.statRow}>
              <View style={styles.statIconContainer}>
                <MaterialIcons
                  name="directions-car"
                  size={24}
                  color="#6366F1"
                />
              </View>
              <View style={styles.statContent}>
                <Text style={styles.statLabel}>Total Miles Shared</Text>
                <Text style={styles.statValue}>
                  {profile.stats.carpoolMiles.toLocaleString()} mi
                </Text>
              </View>
            </View>

            <View style={styles.statRow}>
              <View style={styles.statIconContainer}>
                <MaterialIcons name="event-seat" size={24} color="#8B5CF6" />
              </View>
              <View style={styles.statContent}>
                <Text style={styles.statLabel}>Seats Offered</Text>
                <Text style={styles.statValue}>
                  {profile.stats.seatsOffered}
                </Text>
              </View>
            </View>

            <View style={styles.statRow}>
              <View style={styles.statIconContainer}>
                <MaterialIcons name="star" size={24} color="#F59E0B" />
              </View>
              <View style={styles.statContent}>
                <Text style={styles.statLabel}>Driver Rating</Text>
                <Text style={styles.statValue}>
                  {profile.stats.driverRating > 0
                    ? `${profile.stats.driverRating.toFixed(1)} / 5.0`
                    : "Not rated yet"}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Settings Modal */}
      <SettingsModal
        visible={showSettings}
        onClose={() => setShowSettings(false)}
        onLogout={handleLogout}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    padding: 40,
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: "600",
    color: "#EF4444",
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  tripsList: {
    paddingHorizontal: 16,
  },
  menuCard: {
    marginHorizontal: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  statsCard: {
    marginHorizontal: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    gap: 16,
  },
  statRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },
  statContent: {
    flex: 1,
  },
  statLabel: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
});
