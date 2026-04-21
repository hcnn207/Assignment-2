import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";
import { getProductById } from "../../services/api";

export default function ProductDetailScreen() {
  const { productId } = useLocalSearchParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProduct();
  }, [productId]);

  async function loadProduct() {
    try {
      setLoading(true);
      const data = await getProductById(productId);
      setProduct(data);
    } catch (error) {
      console.log("Error loading product:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.center}>
        <Text>Product not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Product Details</Text>

      <Image source={{ uri: product.image }} style={styles.image} />

      <Text style={styles.title}>{product.title}</Text>

      <View style={styles.infoBox}>
        <Text style={styles.infoText}>Rate: {product.rating?.rate}</Text>
        <Text style={styles.infoText}>Count: {product.rating?.count}</Text>
        <Text style={styles.infoText}>
          Price: ${Number(product.price).toFixed(2)}
        </Text>
      </View>

      <View style={styles.buttonRow}>
        <Pressable style={styles.button} onPress={() => router.back()}>
          <Text style={styles.buttonText}>Back</Text>
        </Pressable>

        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>Add to Cart</Text>
        </Pressable>
      </View>

      <Text style={styles.descriptionTitle}>Description:</Text>
      <Text style={styles.description}>{product.description}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#ffffff"
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
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
  image: {
    width: "100%",
    height: 240,
    resizeMode: "contain",
    marginBottom: 16
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12
  },
  infoBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#8fd3e8",
    borderWidth: 1,
    borderColor: "#333333",
    padding: 10,
    marginBottom: 16
  },
  infoText: {
    fontWeight: "bold",
    fontSize: 12
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16
  },
  button: {
    backgroundColor: "#2f6fb0",
    padding: 12,
    borderRadius: 6,
    width: 130
  },
  buttonText: {
    color: "#ffffff",
    textAlign: "center",
    fontWeight: "bold"
  },
  descriptionTitle: {
    fontWeight: "bold",
    marginBottom: 8
  },
  description: {
    borderWidth: 1,
    borderColor: "#333333",
    padding: 12,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 40
  }
});