import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Tabs, useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

function CustomTabBar({ state, descriptors, navigation }: any) {
  const router = useRouter();
  const [showPopup, setShowPopup] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(24)).current;

  const openPopup = () => {
    setShowPopup(true);
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closePopup = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 160,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 24,
        duration: 160,
        useNativeDriver: true,
      }),
    ]).start(() => setShowPopup(false));
  };

  const togglePopup = () => (showPopup ? closePopup() : openPopup());

  return (
    <View>
      {/* Popup */}
      {showPopup && (
        <Animated.View
          style={[
            styles.popupWrapper,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          <TouchableOpacity
            style={styles.popupBtn}
            onPress={() => {
              closePopup();
              router.push("/start-planning"); // make sure this file exists
            }}
          >
            <Text style={styles.popupText}>Start Plan</Text>
          </TouchableOpacity>
        </Animated.View>
      )}

      {/* Tab bar */}
      <View style={styles.tabBar}>
        {state.routes.map((route: any, index: number) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;
          const label = options.tabBarLabel ?? options.title ?? route.name;

          const renderIcon = () => {
            switch (route.name) {
              case "index":
                return (
                  <Ionicons
                    name="home-outline"
                    size={24}
                    color={isFocused ? "#000" : "#999"}
                  />
                );
              case "shopping":
                return (
                  <Ionicons
                    name="cart-outline"
                    size={24}
                    color={isFocused ? "#000" : "#999"}
                  />
                );
              case "carpool":
                return (
                  <Ionicons
                    name="car-outline"
                    size={24}
                    color={isFocused ? "#000" : "#999"}
                  />
                );
              case "create-plan":
                return (
                  <TouchableOpacity
                    style={styles.plusBtn}
                    onPress={togglePopup}
                  >
                    <Ionicons name="add" size={26} color="#fff" />
                  </TouchableOpacity>
                );
              case "InboxTab":
                return (
                  <MaterialIcons
                    name="inbox"
                    size={24}
                    color={isFocused ? "#000" : "#999"}
                  />
                );
              case "profile":
                return (
                  <Ionicons
                    name="person-outline"
                    size={24}
                    color={isFocused ? "#000" : "#999"}
                  />
                );
              default:
                return null;
            }
          };

          const onPress = () => {
            if (route.name === "create-plan") {
              togglePopup();
              return;
            }
            if (showPopup) closePopup();
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              style={styles.tabItem}
              activeOpacity={0.8}
            >
              {renderIcon()}
              {route.name !== "create-plan" && (
                <Text
                  style={[
                    styles.tabLabel,
                    { color: isFocused ? "#000" : "#999" },
                  ]}
                >
                  {label}
                </Text>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="shopping" options={{ title: "Shopping" }} />
      <Tabs.Screen name="carpool" options={{ title: "Carpool" }} />
      <Tabs.Screen name="create-plan" options={{ title: "Create Plan" }} />
      <Tabs.Screen name="InboxTab" options={{ tabBarLabel: "Inbox" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  popupWrapper: {
    position: "absolute",
    bottom: 100,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 10,
  },
  popupBtn: {
    backgroundColor: "#000",
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 24,
  },
  popupText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
  tabBar: {
    flexDirection: "row",
    alignItems: "center",
    height: 70,
    backgroundColor: "#fff",
    borderTopWidth: 0.5,
    borderColor: "#ccc",
    justifyContent: "space-around",
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
  },
  tabLabel: {
    fontSize: 11,
    marginTop: 2,
  },
  plusBtn: {
    backgroundColor: "#000",
    borderRadius: 28,
    padding: 12,
  },
});
