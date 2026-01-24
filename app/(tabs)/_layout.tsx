import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Tabs, useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');

function CustomTabBar({ state, descriptors, navigation }: any) {
  const router = useRouter();
  const [showPopup, setShowPopup] = useState(false);

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(24)).current;

  const openPopup = () => {
    setShowPopup(true);
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 220, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 220, useNativeDriver: true }),
    ]).start();
  };

  const closePopup = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 0, duration: 160, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 24, duration: 160, useNativeDriver: true }),
    ]).start(() => setShowPopup(false));
  };

  const togglePopup = () => (showPopup ? closePopup() : openPopup());

  return (
    <View style={styles.wrapper}>
      {/* Dim backdrop (clickable to close) */}
      {showPopup && (
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={closePopup}>
          <Animated.View style={{ flex: 1, opacity: fadeAnim }} />
        </TouchableOpacity>
      )}

      {/* Popup centered above the plus */}
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
              router.push('/start-planning');
            }}
          >
            <Text style={styles.popupText}>Start Plan</Text>
          </TouchableOpacity>
        </Animated.View>
      )}

      {/* Actual tab bar */}
      <View style={styles.tabBar}>
        {state.routes.map((route: any, index: number) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const label =
            options.tabBarLabel ?? options.title ?? route.name;

          const renderIcon = () => {
            switch (route.name) {
              case 'index':
                return <Ionicons name="home-outline" size={24} color={isFocused ? '#111' : '#999'} />;
              case 'shopping':
                return <Ionicons name="cart-outline" size={24} color={isFocused ? '#111' : '#999'} />;
              case 'carpool':
                return <Ionicons name="car-outline" size={24} color={isFocused ? '#111' : '#999'} />;
              case 'create-plan':
                return (
                  <View style={styles.plusContainer}>
                    <TouchableOpacity style={styles.plusBtn} onPress={togglePopup}>
                      <Ionicons name="add" size={26} color="#fff" />
                    </TouchableOpacity>
                  </View>
                );
              case 'InboxTab':
                return <MaterialIcons name="inbox" size={24} color={isFocused ? '#111' : '#999'} />;
              case 'profile':
                return <Ionicons name="person-outline" size={24} color={isFocused ? '#111' : '#999'} />;
              default:
                return null;
            }
          };

          const onPress = () => {
            if (route.name === 'create-plan') {
              togglePopup();
              return;
            }
            if (showPopup) closePopup();
            const event = navigation.emit({
              type: 'tabPress',
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
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              onPress={onPress}
              style={styles.tabItem}
              activeOpacity={0.8}
            >
              {renderIcon()}
              {route.name !== 'create-plan' && (
                <Text style={[styles.tabLabel, { color: isFocused ? '#111' : '#999' }]}>
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
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="shopping" options={{ title: 'Shopping' }} />
      <Tabs.Screen name="carpool" options={{ title: 'Carpool' }} />
      <Tabs.Screen name="create-plan" options={{ title: 'Create Plan' }} />
      <Tabs.Screen name="InboxTab" options={{ tabBarLabel: 'Inbox' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    inset: 0,
    justifyContent: 'flex-end',
  },
  backdrop: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 70,
    top: 0,
    backgroundColor: 'rgba(0,0,0,0.08)',
    zIndex: 5,
  },
  popupWrapper: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
  },
  popupBtn: {
    backgroundColor: '#0A84FF',
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 24,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  popupText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  tabBar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 70,
    backgroundColor: '#fff',
    borderTopWidth: 0,
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: -2 },
    paddingHorizontal: 10,
    justifyContent: 'space-around',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  tabLabel: {
    fontSize: 11,
    marginTop: 2,
  },
  plusContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusBtn: {
    backgroundColor: '#0A84FF',
    borderRadius: 28,
    padding: 12,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
});
