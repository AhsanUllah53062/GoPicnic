import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';

export default function EditProfile() {
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(true);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Profile</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Avatar */}
      <Image source={require('../../assets/logo.png')} style={styles.avatar} />
      <TouchableOpacity style={styles.changeBtn}>
        <Text style={styles.changeText}>Change Profile Picture</Text>
      </TouchableOpacity>

      {/* Section 1: Account Settings */}
      <View style={styles.section}>
        <TouchableOpacity style={styles.row} onPress={() => router.push('/profile/details')}>
          <MaterialIcons name="person" size={22} color="#000" style={styles.icon} />
          <View style={styles.textBlock}>
            <Text style={styles.label}>Personal Details</Text>
            <Text style={styles.subtext}>Check and update your information</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.row}>
          <MaterialIcons name="folder" size={22} color="#000" style={styles.icon} />
          <View style={styles.textBlock}>
            <Text style={styles.label}>Saved Documents</Text>
            <Text style={styles.subtext}>Manage your saved documents</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.row} onPress={() => router.push('/profile/security')}>
          <MaterialIcons name="security" size={22} color="#000" style={styles.icon} />
          <View style={styles.textBlock}>
            <Text style={styles.label}>Password & Security</Text>
            <Text style={styles.subtext}>Update password and enable 2FA</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.row}>
          <MaterialIcons name="brightness-6" size={22} color="#000" style={styles.icon} />
          <View style={styles.textBlock}>
            <Text style={styles.label}>Light / Dark</Text>
            <Text style={styles.subtext}>Manage dark and light mode</Text>
          </View>
          <Switch value={darkMode} onValueChange={setDarkMode} />
        </View>

        <TouchableOpacity style={styles.row}>
          <MaterialIcons name="logout" size={22} color="#000" style={styles.icon} />
          <View style={styles.textBlock}>
            <Text style={styles.label}>Log out</Text>
            <Text style={styles.subtext}>Secure your account</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Section 2: App Info */}
      <View style={styles.section}>
        <TouchableOpacity style={styles.row}>
          <MaterialIcons name="support-agent" size={22} color="#000" style={styles.icon} />
          <Text style={styles.label}>Help & Support</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.row}>
          <MaterialIcons name="privacy-tip" size={22} color="#000" style={styles.icon} />
          <Text style={styles.label}>Privacy Policy</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.row}>
          <MaterialIcons name="info" size={22} color="#000" style={styles.icon} />
          <Text style={styles.label}>About App</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f7fa', padding: 20 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: { fontSize: 20, fontWeight: '700', textAlign: 'center', flex: 1 },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: 'center',
    marginBottom: 8,
  },
  changeBtn: { alignSelf: 'center', marginBottom: 20 },
  changeText: { fontSize: 14, color: '#007AFF', fontWeight: '500' },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderColor: '#eee',
  },
  icon: { marginRight: 12 },
  textBlock: { flex: 1 },
  label: { fontSize: 16, fontWeight: '600', color: '#000' },
  subtext: { fontSize: 12, color: '#666' },
});
