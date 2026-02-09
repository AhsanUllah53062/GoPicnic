import { MaterialIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Button from "../../components/common/Button";
import CustomPicker from "../../components/common/CustomPicker";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { registerUser } from "../../services/auth";

export default function Signup() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [dob, setDob] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [gender, setGender] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!username || !email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill all required fields.");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await registerUser(
        email,
        password,
        username,
        city,
        gender,
        phone,
        dob ? dob.toISOString() : "",
      );
      Alert.alert("Success", "Account created successfully!");
      router.replace("/login");
    } catch (error: any) {
      Alert.alert("Signup failed", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <MaterialIcons
        name="arrow-back"
        size={24}
        color="#000"
        style={styles.backIcon}
        onPress={() => router.back()}
      />

      <Text style={styles.title}>Register</Text>

      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        placeholderTextColor="#666"
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        placeholderTextColor="#666"
      />
      <TextInput
        style={styles.input}
        placeholder="Phone number"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
        placeholderTextColor="#666"
      />
      <TextInput
        style={styles.input}
        placeholder="City"
        value={city}
        onChangeText={setCity}
        placeholderTextColor="#666"
      />

      <Pressable style={styles.input} onPress={() => setShowDatePicker(true)}>
        <Text style={{ color: dob ? "#000" : "#666" }}>
          {dob ? dob.toLocaleDateString() : "Select Date of Birth"}
        </Text>
      </Pressable>
      {showDatePicker && (
        <DateTimePicker
          value={dob || new Date()}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) setDob(selectedDate);
          }}
        />
      )}

      <CustomPicker
        selectedValue={gender}
        onValueChange={setGender}
        items={[
          { label: "Select Gender", value: "" },
          { label: "Male", value: "male" },
          { label: "Female", value: "female" },
        ]}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        placeholderTextColor="#666"
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm password"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        placeholderTextColor="#666"
      />

      <View style={styles.buttonWrapper}>
        {loading ? (
          <LoadingSpinner />
        ) : (
          <Button title="Agree and Register" filled onPress={handleSignup} />
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 30,
    paddingBottom: 40,
  },
  backIcon: {
    marginTop: 20,
    marginBottom: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginVertical: 20,
    color: "#000",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 12,
    marginTop: 16,
    fontSize: 16,
    color: "#000",
  },
  buttonWrapper: {
    marginTop: 30,
    alignItems: "center",
  },
});
