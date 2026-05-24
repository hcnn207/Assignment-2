import {
  Alert,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import {
  clearCart,
  decreaseQuantity,
  increaseQuantity
} from "../../redux/cartSlice";
import { createNewOrder, updateCart } from "../../services/localApi";

export default function CartScreen() {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const token = useSelector((state) => state.auth.token);

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  async function syncCartToServer(updatedItems) {
    if (!token) {
      return;
    }

    const serverItems = updatedItems.map((item) => ({
      id: item.id,
      price: item.price,
      count: item.quantity
    }));

    await updateCart(token, serverItems);
  }

  async function handleIncrease(item) {
    const updatedItems = cartItems.map((cartItem) =>
      cartItem.id === item.id
        ? { ...cartItem, quantity: cartItem.quantity + 1 }
        : cartItem
    );

    dispatch(increaseQuantity(item.id));

    try {
      await syncCartToServer(updatedItems);
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to update cart.");
    }
  }

  async function handleDecrease(item) {
    const updatedItems = cartItems
      .map((cartItem) =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: cartItem.quantity - 1 }
          : cartItem
      )
      .filter((cartItem) => cartItem.quantity > 0);

    dispatch(decreaseQuantity(item.id));

    try {
      await syncCartToServer(updatedItems);
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to update cart.");
    }
  }

  async function handleCheckout() {
    if (cartItems.length === 0) {
      return;
    }

    if (!token) {
      Alert.alert("Error", "Please sign in first.");
      return;
    }

    try {
      const orderItems = cartItems.map((item) => ({
        prodID: item.id,
        price: item.price,
        quantity: item.quantity
      }));

      await createNewOrder(token, orderItems);
      await updateCart(token, []);

      dispatch(clearCart());
      Alert.alert("Success", "Order created successfully.");
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to create order.");
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Text style={styles.header}>Shopping Cart</Text>

      {cartItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Your shopping cart is empty</Text>
        </View>
      ) : (
        <>
          <View style={styles.summaryBox}>
            <Text style={styles.summaryText}>Items: {totalItems}</Text>
            <Text style={styles.summaryText}>
              Total: ${totalPrice.toFixed(2)}
            </Text>
          </View>

          <FlatList
            data={cartItems}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Image source={{ uri: item.image }} style={styles.image} />

                <View style={styles.info}>
                  <Text style={styles.title} numberOfLines={2}>
                    {item.title}
                  </Text>

                  <Text style={styles.price}>
                    Price: ${Number(item.price).toFixed(2)}
                  </Text>

                  <Text style={styles.quantity}>Quantity: {item.quantity}</Text>

                  <View style={styles.buttonRow}>
                    <Pressable
                      style={styles.smallButton}
                      onPress={() => handleDecrease(item)}
                    >
                      <Text style={styles.smallButtonText}>-</Text>
                    </Pressable>

                    <Pressable
                      style={styles.smallButton}
                      onPress={() => handleIncrease(item)}
                    >
                      <Text style={styles.smallButtonText}>+</Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            )}
          />

          <Pressable style={styles.checkoutButton} onPress={handleCheckout}>
            <Text style={styles.checkoutButtonText}>Check Out</Text>
          </Pressable>
        </>
      )}
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
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  emptyText: {
    fontSize: 22,
    textAlign: "center"
  },
  summaryBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#8fd3e8",
    padding: 12,
    borderWidth: 1,
    borderColor: "#333333",
    marginBottom: 16
  },
  summaryText: {
    fontWeight: "bold",
    fontSize: 14
  },
  list: {
    paddingBottom: 20
  },
  card: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#333333",
    padding: 10,
    marginBottom: 12,
    backgroundColor: "#f8f8f8"
  },
  image: {
    width: 80,
    height: 80,
    resizeMode: "contain",
    marginRight: 12
  },
  info: {
    flex: 1,
    justifyContent: "center"
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 6
  },
  price: {
    fontSize: 14,
    marginBottom: 4
  },
  quantity: {
    fontSize: 14,
    marginBottom: 8
  },
  buttonRow: {
    flexDirection: "row",
    gap: 10
  },
  smallButton: {
    backgroundColor: "#2f6fb0",
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4
  },
  smallButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 20,
    textAlign: "center"
  },
  checkoutButton: {
    backgroundColor: "#2f6fb0",
    paddingVertical: 12,
    borderRadius: 6,
    marginTop: 10,
    marginBottom: 20
  },
  checkoutButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center"
  }
});