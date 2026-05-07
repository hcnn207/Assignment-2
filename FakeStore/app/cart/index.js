import {
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
  decreaseQuantity,
  increaseQuantity
} from "../../redux/cartSlice";

export default function CartScreen() {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  
  console.log("CART ITEMS:", cartItems);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

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
                      onPress={() => dispatch(decreaseQuantity(item.id))}
                    >
                      <Text style={styles.buttonText}>-</Text>
                    </Pressable>

                    <Pressable
                      style={styles.smallButton}
                      onPress={() => dispatch(increaseQuantity(item.id))}
                    >
                      <Text style={styles.buttonText}>+</Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            )}
          />
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
    marginBottom: 12
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
  buttonText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 20
  }
});