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
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/cartSlice";
import { getProductById } from "../../services/api";

export default function ProductDetailScreen() {
  const { productId } = useLocalSearchParams();
  const dispatch = useDispatch();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

    loadProduct();
  }, [productId]);

  if (loading) {
    return (
      <SafeAreaView style={styles.center} edges={["top"]}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  if (!product) {
    return (
      <SafeAreaView style={styles.center} edges={["top"]}>
        <Text>Product not found.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
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

          <Pressable
            style={styles.button}
            onPress={() => {
              console.log("Add to Cart pressed");
              dispatch(addToCart(product));
            }}  
          >
            <Text style={styles.buttonText}>Add to Cart</Text>
          </Pressable>
        </View>

        <Text style={styles.descriptionTitle}>Description:</Text>
        <Text style={styles.description}>{product.description}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingHorizontal: 20
  },
  scrollContent: {
    paddingBottom: 30
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff"
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
    marginBottom: 16,
    zIndex: 10
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