import { View, TextInput, Button, StyleSheet, Text } from "react-native";
import { useState } from "react";
import axios from "axios";
import { useAuthStore } from "../../store/authStore";
import { useRouter } from "expo-router";

export default function Register() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const setUser = useAuthStore((state) => state.setUser);
  const router = useRouter();

  const handleRegister = async () => {
    try {
      const res = await axios.post("http://<your-backend>/auth/register", {
        email,
        username,
        password,
      });
      setUser(res.data.user); // Save user & token
      router.replace("../(tabs)/index");
    } catch (err: any) {
      console.log(err.response?.data || err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Register</Text>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} />
      <TextInput placeholder="Username" value={username} onChangeText={setUsername} style={styles.input} />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
      <Button title="Register" onPress={handleRegister} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  input: { borderWidth: 1, padding: 10, marginVertical: 5 }
});
