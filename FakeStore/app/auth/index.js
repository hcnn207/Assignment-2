import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../../redux/authSlice";
import { signInUser, signUpUser } from "../../services/localApi";

function extractAuthPayload(data, fallbackName, fallbackEmail) {
  const token = data?.token || null;

  const user = {
    id: data?.id || null,
    name: data?.name || fallbackName || "User",
    email: data?.email || fallbackEmail
  };

  return { token, user };
}

export default function AuthScreen() {
  const dispatch = useDispatch();

  const [isSignUp, setIsSignUp] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  function clearForm() {
    setName("");
    setEmail("");
    setPassword("");
  }

  async function handleSubmit() {
    if (loading) {
      return;
    }

    if (isSignUp) {
      if (!name.trim() || !email.trim() || !password.trim()) {
        Alert.alert("Error", "Please fill in all fields.");
        return;
      }
    } else {
      if (!email.trim() || !password.trim()) {
        Alert.alert("Error", "Please enter email and password.");
        return;
      }
    }

    try {
      setLoading(true);

      if (isSignUp) {
        const data = await signUpUser(name.trim(), email.trim(), password);
        console.log("SIGN UP RESPONSE:", data);

        const { token, user } = extractAuthPayload(
          data,
          name.trim(),
          email.trim()
        );

        dispatch(
          signInSuccess({
            user,
            token
          })
        );

        Alert.alert("Success", "Sign up successful.");
      } else {
        const data = await signInUser(email.trim(), password);
        console.log("SIGN IN RESPONSE:", data);

        const { token, user } = extractAuthPayload(
          data,
          "User",
          email.trim()
        );

        dispatch(
          signInSuccess({
            user,
            token
          })
        );

        Alert.alert("Success", "Sign in successful.");
      }

      clearForm();
      router.replace("/(tabs)");
    } catch (error) {
      Alert.alert("Error", error.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Text style={styles.header}>
        {isSignUp
          ? "Sign up a new user"
          : "Sign in with your email and password"}
      </Text>

      <View style={styles.formBox}>
        {isSignUp && (
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={name}
            onChangeText={setName}
          />
        )}

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <View style={styles.buttonRow}>
          <Pressable style={styles.button} onPress={clearForm}>
            <Text style={styles.buttonText}>Clear</Text>
          </Pressable>

          <Pressable style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>
              {loading ? "Loading..." : isSignUp ? "Sign Up" : "Sign In"}
            </Text>
          </Pressable>
        </View>

        <Pressable onPress={() => setIsSignUp(!isSignUp)}>
          <Text style={styles.switchText}>
            {isSignUp
              ? "Already have an account? Sign In"
              : "Do not have an account? Sign Up"}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingHorizontal: 20
  },
  header: {
    backgroundColor: "#3f9fc5",
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    padding: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#333333"
  },
  formBox: {
    borderWidth: 1,
    borderColor: "#333333",
    padding: 16,
    backgroundColor: "#f8f8f8"
  },
  input: {
    borderWidth: 1,
    borderColor: "#333333",
    padding: 12,
    marginBottom: 14,
    backgroundColor: "#ffffff"
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16
  },
  button: {
    backgroundColor: "#2f6fb0",
    paddingVertical: 12,
    width: "48%",
    borderRadius: 6
  },
  buttonText: {
    color: "#ffffff",
    textAlign: "center",
    fontWeight: "bold"
  },
  switchText: {
    color: "#2f6fb0",
    textAlign: "center",
    fontWeight: "bold"
  }
});