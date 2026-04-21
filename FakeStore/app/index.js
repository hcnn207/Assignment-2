import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Pressable,
    StyleSheet,
    Text,
    View
} from "react-native";
import { getCategories } from "../services/api";

export default function CategoryScreen() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    try {
      setLoading(true);
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.log("Error loading categories:", error);
    } finally {
      setLoading(false);
    }
  }

  function openCategory(category) {
    router.push({
      pathname: "/products/list",
      params: { category }
    });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Categories</Text>

      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <View style={styles.categoryBox}>
          {categories.map((category) => (
            <Pressable
              key={category}
              style={styles.categoryButton}
              onPress={() => openCategory(category)}
            >
              <Text style={styles.categoryText}>{formatCategory(category)}</Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

function formatCategory(category) {
  return category
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#ffffff"
  },
  header: {
    backgroundColor: "#3f9fc5",
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    padding: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#333333"
  },
  categoryBox: {
    gap: 16
  },
  categoryButton: {
    backgroundColor: "#eeeeee",
    padding: 16,
    borderWidth: 1,
    borderColor: "#333333"
  },
  categoryText: {
    color: "#2f6fb0",
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center"
  }
});