import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getProductsByCategory } from "../../services/api";

export default function ProductListScreen() {
  const { category } = useLocalSearchParams();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, [category]);

  async function loadProducts() {
    try {
      setLoading(true);
      const data = await getProductsByCategory(category);
      setProducts(data);
    } catch (error) {
      console.log("Error loading products:", error);
    } finally {
      setLoading(false);
    }
  }

  function openProduct(productId) {
    router.push({
      pathname: "/products/detail",
      params: { productId }
    });
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Text style={styles.header}>{formatCategory(category)}</Text>

      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <Pressable
              style={styles.productCard}
              onPress={() => openProduct(item.id)}
            >
              <Image source={{ uri: item.image }} style={styles.image} />

              <View style={styles.productInfo}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.price}>Price: ${item.price}</Text>
              </View>
            </Pressable>
          )}
        />
      )}

      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backText}>Back</Text>
      </Pressable>
    </SafeAreaView>
  );
}

function formatCategory(category) {
  if (!category) return "";

  return category
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingHorizontal: 20,
    paddingBottom: 20
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
  list: {
    paddingBottom: 80,
    gap: 12
  },
  productCard: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#333333",
    padding: 10,
    backgroundColor: "#ffffff"
  },
  image: {
    width: 80,
    height: 80,
    resizeMode: "contain",
    marginRight: 12
  },
  productInfo: {
    flex: 1,
    justifyContent: "center"
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 8
  },
  price: {
    fontSize: 14
  },
  backButton: {
    backgroundColor: "#2f6fb0",
    padding: 12,
    borderRadius: 6,
    alignSelf: "center",
    width: 120,
    position: "absolute",
    bottom: 24
  },
  backText: {
    color: "#ffffff",
    textAlign: "center",
    fontWeight: "bold"
  }
});