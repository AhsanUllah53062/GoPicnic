import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function SecuritySettings() {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [twoFA, setTwoFA] = useState(false);

  const handleSave = () => {
    // TODO: integrate with backend for password update + 2FA toggle
    router.back();
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Password & Security</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Password Fields */}
      <View style={styles.section}>
        <Text style={styles.sectionHeading}>Change Password</Text>

        <TextInput
          style={styles.input}
          placeholder="Current Password"
          secureTextEntry
          value={currentPassword}
          onChangeText={setCurrentPassword}
        />

        <TextInput
          style={styles.input}
          placeholder="New Password"
          secureTextEntry
          value={newPassword}
          onChangeText={setNewPassword}
        />

        <TextInput
          style={styles.input}
          placeholder="Confirm New Password"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
      </View>

      {/* Two-Factor Authentication */}
      <View style={styles.section}>
        <Text style={styles.sectionHeading}>Two-Factor Authentication</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Enable 2FA</Text>
          <Switch value={twoFA} onValueChange={setTwoFA} />
        </View>
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
  sectionHeading: { fontSize: 16, fontWeight: '600', marginBottom: 12 },
  input: {
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    fontSize: 14,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  label: { fontSize: 14, color: '#000' },
  saveBtn: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  saveText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
