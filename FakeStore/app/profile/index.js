import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { signOut, updateUserInfo } from "../../redux/authSlice";
import { clearCart } from "../../redux/cartSlice";
import { clearOrders } from "../../redux/orderSlice";
import { updateUser } from "../../services/localApi";

export default function ProfileScreen() {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);

  const [modalVisible, setModalVisible] = useState(false);
  const [newName, setNewName] = useState(user?.name || "");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  function openUpdateModal() {
    setNewName(user?.name || "");
    setNewPassword("");
    setModalVisible(true);
  }

  async function handleConfirmUpdate() {
    if (!newName.trim()) {
      Alert.alert("Error", "Please enter a new user name.");
      return;
    }

    if (!newPassword.trim()) {
      Alert.alert("Error", "Please enter a new password.");
      return;
    }

    if (!token) {
      Alert.alert("Error", "Please sign in first.");
      return;
    }

    try {
      setLoading(true);

      const data = await updateUser(token, newName.trim(), newPassword);

      dispatch(
        updateUserInfo({
          name: data?.name || newName.trim()
        })
      );

      setModalVisible(false);
      setNewPassword("");
      Alert.alert("Success", "Profile updated successfully.");
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  }

  function handleSignOut() {
    dispatch(signOut());
    dispatch(clearCart());
    dispatch(clearOrders());
    Alert.alert("Success", "Signed out successfully.");
    router.replace("/auth");
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Text style={styles.header}>User Profile</Text>

      <View style={styles.infoBox}>
        <Text style={styles.label}>User Name:</Text>
        <Text style={styles.value}>{user?.name || "No user name"}</Text>

        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>{user?.email || "No email"}</Text>
      </View>

      <View style={styles.buttonRow}>
        <Pressable style={styles.button} onPress={openUpdateModal}>
          <Text style={styles.buttonText}>Update</Text>
        </Pressable>

        <Pressable style={styles.button} onPress={handleSignOut}>
          <Text style={styles.buttonText}>Sign Out</Text>
        </Pressable>
      </View>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.header}>User Profile</Text>

            <TextInput
              style={styles.input}
              placeholder="New User Name"
              value={newName}
              onChangeText={setNewName}
            />

            <TextInput
              style={styles.input}
              placeholder="New Password"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
            />

            <View style={styles.buttonRow}>
              <Pressable style={styles.button} onPress={handleConfirmUpdate}>
                <Text style={styles.buttonText}>
                  {loading ? "Loading..." : "Confirm"}
                </Text>
              </Pressable>

              <Pressable
                style={styles.button}
                onPress={() => {
                  setModalVisible(false);
                  setNewPassword("");
                }}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
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
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#333333"
  },
  infoBox: {
    borderWidth: 1,
    borderColor: "#333333",
    padding: 16,
    backgroundColor: "#f8f8f8",
    marginBottom: 20
  },
  label: {
    fontWeight: "bold",
    marginBottom: 4
  },
  value: {
    marginBottom: 16,
    fontSize: 16
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between"
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    paddingHorizontal: 20
  },
  modalBox: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 8
  },
  input: {
    borderWidth: 1,
    borderColor: "#333333",
    padding: 12,
    marginBottom: 14,
    backgroundColor: "#ffffff"
  }
});