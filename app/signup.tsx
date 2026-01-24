import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import CustomButton from '../components/CustomButton';
import CustomPicker from '../components/CustomPicker';

export default function Signup() {
  const router = useRouter();
  const [gender, setGender] = useState<string>("");

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Back Arrow */}
      <MaterialIcons
        name="arrow-back"
        size={24}
        color="black"
        style={styles.backIcon}
        onPress={() => router.back()}
      />

      {/* Title */}
      <Text style={styles.title}>Register</Text>

      {/* Input Fields */}
      <TextInput style={styles.input} placeholder="Username" placeholderTextColor="#666" />
      <TextInput style={styles.input} placeholder="Email" keyboardType="email-address" placeholderTextColor="#666" />
      <TextInput style={styles.input} placeholder="Phone number" keyboardType="phone-pad" placeholderTextColor="#666" />
      <TextInput style={styles.input} placeholder="City" placeholderTextColor="#666" />
      <TextInput style={styles.input} placeholder="Date of birth:DD/MM/YYYY" placeholderTextColor="#666" />

      {/* Gender Picker (reusable component) */}
      <CustomPicker
        selectedValue={gender}
        onValueChange={setGender}
        items={[
          { label: 'Select Gender', value: '' },
          { label: 'Male', value: 'male' },
          { label: 'Female', value: 'female' },
        ]}
      />

      <TextInput style={styles.input} placeholder="Password" secureTextEntry placeholderTextColor="#666" />
      <TextInput style={styles.input} placeholder="Confirm password" secureTextEntry placeholderTextColor="#666" />

      {/* Centered Register Button */}
      <View style={styles.buttonWrapper}>
        <CustomButton
          title="Agree and Register"
          filled
          onPress={() => router.push('/login')}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 30,
    paddingBottom: 40,
  },
  backIcon: {
    marginTop: 20,
    marginBottom: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginVertical: 20,
    color: '#000',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 12,
    marginTop: 16,
    fontSize: 16,
    color: '#000',
  },
  buttonWrapper: {
    marginTop: 30,
    alignItems: 'center',
  },
});
