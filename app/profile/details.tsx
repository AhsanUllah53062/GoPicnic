import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useUser } from '../../src/context/UserContext';

export default function PersonalDetails() {
  const router = useRouter();

  let userSafe: any = { name: '', email: '', mobile: '', dob: '' };
  let setUserSafe: ((u: any) => void) | undefined;

  try {
    const { user, setUser } = useUser();
    if (user) userSafe = user;
    setUserSafe = setUser;
  } catch {
    // If UserProvider is not mounted, fallback to defaults
    userSafe = { name: '', email: '', mobile: '', dob: '' };
    setUserSafe = undefined;
  }

  // Local state initialized with current info
  const [name, setName] = useState(userSafe.name || '');
  const [email, setEmail] = useState(userSafe.email || '');
  const [mobile, setMobile] = useState(userSafe.mobile || '');
  const [dob, setDob] = useState(userSafe.dob || '');

  const handleSave = () => {
    if (setUserSafe) {
      const updatedUser = { ...userSafe, name, email, mobile, dob };
      setUserSafe(updatedUser);
      // 🔹 Later: send update to backend API
    }
    router.back();
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Personal Details</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Current Info + Editable Fields */}
      <View style={styles.section}>
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter your name"
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email"
          keyboardType="email-address"
        />

        <Text style={styles.label}>Mobile Number</Text>
        <TextInput
          style={styles.input}
          value={mobile}
          onChangeText={setMobile}
          placeholder="Enter your mobile number"
          keyboardType="phone-pad"
        />

        <Text style={styles.label}>Date of Birth</Text>
        <TextInput
          style={styles.input}
          value={dob}
          onChangeText={setDob}
          placeholder="YYYY-MM-DD"
        />
      </View>

      {/* Save Button */}
      <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
        <Text style={styles.saveText}>Save Changes</Text>
      </TouchableOpacity>
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
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 6, color: '#333' },
  input: {
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
    fontSize: 14,
  },
  saveBtn: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  saveText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
