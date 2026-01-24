import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import CustomButton from '../components/CustomButton';



export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert("Error", "Both email and password are required.");
      return;
    }
    // TODO: Replace with real authentication logic
    console.log("Logging in with:", { email, password });
    
router.replace('/(tabs)'); // Navigate to home on success
  };

  return (
    <View style={styles.container}>
      {/* Back Arrow */}
      <MaterialIcons
        name="arrow-back"
        size={24}
        color="black"
        style={styles.backIcon}
        onPress={() => router.back()}
      />

      {/* Title */}
      <Text style={styles.title}>Welcome back! Glad to see you.</Text>

      {/* Email Input */}
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        placeholderTextColor="#666"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      {/* Password Input with Eye Icon */}
      <View style={styles.passwordContainer}>
        <TextInput
          style={[styles.input, { flex: 1, marginTop: 0 }]}
          placeholder="Enter your password"
          placeholderTextColor="#666"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />
        <MaterialIcons
          name={showPassword ? "visibility-off" : "visibility"}
          size={24}
          color="gray"
          style={styles.eyeIcon}
          onPress={() => setShowPassword(!showPassword)}
        />
      </View>

      {/* Forgot Password */}
      <Text
        style={styles.forgotPassword}
        onPress={() => router.push('/forgot-password')}
      >
        Forgot Password?
      </Text>

      {/* Centered Login Button */}
      <View style={styles.buttonWrapper}>
        <CustomButton title="Login" filled onPress={handleLogin} />
      </View>

      {/* Register Now */}
      <View style={styles.signupContainer}>
        <Text style={{ fontSize: 16, color: '#000' }}>
          Don’t have an account?{' '}
        </Text>
        <Pressable onPress={() => router.push('/signup')}>
          <Text style={styles.signupText}>Register Now</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 30,
    paddingTop: 60,
  },
  backIcon: {
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 30,
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
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    marginTop: 16,
    paddingRight: 10,
  },
  eyeIcon: {
    marginLeft: 8,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    color: '#888',
    fontSize: 14,
    marginTop: 10,
  },
  buttonWrapper: {
    marginTop: 30,
    alignItems: 'center',
  },
  signupContainer: {
    marginTop: 40,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  signupText: {
    fontSize: 16,
    color: '#007bff',
    fontWeight: '500',
  },
});
