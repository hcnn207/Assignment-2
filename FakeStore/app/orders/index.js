import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { getProductById } from "../../services/api";
import { getOrders, updateOrderStatus } from "../../services/localApi";

export default function OrdersScreen() {
  const token = useSelector((state) => state.auth.token);

  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [newOrders, setNewOrders] = useState([]);
  const [paidOrders, setPaidOrders] = useState([]);
  const [deliveredOrders, setDeliveredOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  async function enrichOrderItems(items) {
    const enrichedItems = await Promise.all(
      (items || []).map(async (item) => {
        try {
          const product = await getProductById(item.prodID);

          return {
            id: item.prodID,
            title: product.title,
            image: product.image,
            price: Number(item.price),
            quantity: Number(item.quantity)
          };
        } catch (_error) {
          return {
            id: item.prodID,
            title: `Product ${item.prodID}`,
            image: "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
            price: Number(item.price),
            quantity: Number(item.quantity)
          };
        }
      })
    );

    return enrichedItems;
  }

  async function loadOrders() {
    if (!token) {
      setNewOrders([]);
      setPaidOrders([]);
      setDeliveredOrders([]);
      return;
    }

    try {
      setLoading(true);

      const data = await getOrders(token);
      console.log("GET ORDERS RESPONSE:", data);

      const orders = data.orders || [];

      const newList = [];
      const paidList = [];
      const deliveredList = [];

      for (const order of orders) {
        let parsedItems = [];

        try {
          parsedItems = JSON.parse(order.order_items || "[]");
        } catch (_error) {
          parsedItems = [];
        }

        const products = await enrichOrderItems(parsedItems);

        const mappedOrder = {
          id: order.id,
          items: Number(order.item_numbers || 0),
          total: Number(order.total_price || 0) / 100,
          products,
          isPaid: Number(order.is_paid || 0),
          isDelivered: Number(order.is_delivered || 0)
        };

        if (mappedOrder.isDelivered === 1) {
          deliveredList.push(mappedOrder);
        } else if (mappedOrder.isPaid === 1) {
          paidList.push(mappedOrder);
        } else {
          newList.push(mappedOrder);
        }
      }

      setNewOrders(newList);
      setPaidOrders(paidList);
      setDeliveredOrders(deliveredList);
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to load orders.");
    } finally {
      setLoading(false);
    }
  }

   
  useEffect(() => {
    loadOrders();
  }, [token]);

  function toggleOrder(orderId) {
    setExpandedOrderId((current) => (current === orderId ? null : orderId));
  }

  async function handlePay(orderId) {
    try {
      await updateOrderStatus(token, orderId, 1, 0);
      Alert.alert("Success", "Order paid successfully.");
      await loadOrders();
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to update order.");
    }
  }

  async function handleReceive(orderId) {
    try {
      await updateOrderStatus(token, orderId, 1, 1);
      Alert.alert("Success", "Order received successfully.");
      await loadOrders();
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to update order.");
    }
  }

  function renderOrderSection(title, data, sectionType) {
    return (
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>
          {title}: {data.length}
        </Text>

        {data.map((order) => (
          <View key={order.id} style={styles.orderBox}>
            <Pressable onPress={() => toggleOrder(order.id)}>
              <View style={styles.orderSummary}>
                <Text style={styles.summaryText}>Order ID: {order.id}</Text>
                <Text style={styles.summaryText}>Items: {order.items}</Text>
                <Text style={styles.summaryText}>
                  Total: ${order.total.toFixed(2)}
                </Text>
              </View>
            </Pressable>

            {expandedOrderId === order.id && (
              <View style={styles.detailsBox}>
                {order.products.map((product) => (
                  <View key={product.id} style={styles.productRow}>
                    <Image
                      source={{ uri: product.image }}
                      style={styles.productImage}
                    />
                    <View style={styles.productInfo}>
                      <Text style={styles.productTitle}>{product.title}</Text>
                      <Text>Price: ${product.price.toFixed(2)}</Text>
                      <Text>Quantity: {product.quantity}</Text>
                    </View>
                  </View>
                ))}

                {sectionType === "new" && (
                  <Pressable
                    style={styles.actionButton}
                    onPress={() => handlePay(order.id)}
                  >
                    <Text style={styles.buttonText}>Pay</Text>
                  </Pressable>
                )}

                {sectionType === "paid" && (
                  <Pressable
                    style={styles.actionButton}
                    onPress={() => handleReceive(order.id)}
                  >
                    <Text style={styles.buttonText}>Receive</Text>
                  </Pressable>
                )}
              </View>
            )}
          </View>
        ))}
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView>
        <Text style={styles.header}>My Orders</Text>

        {loading ? (
          <Text style={styles.loadingText}>Loading orders...</Text>
        ) : (
          <>
            {renderOrderSection("New Orders", newOrders, "new")}
            {renderOrderSection("Paid Orders", paidOrders, "paid")}
            {renderOrderSection("Delivered Orders", deliveredOrders, "delivered")}
          </>
        )}
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
  loadingText: {
    textAlign: "center",
    fontSize: 16,
    marginTop: 20
  },
  section: {
    marginBottom: 20
  },
  sectionHeader: {
    backgroundColor: "#8fd3e8",
    padding: 10,
    fontWeight: "bold",
    borderWidth: 1,
    borderColor: "#333333",
    marginBottom: 10
  },
  orderBox: {
    borderWidth: 1,
    borderColor: "#333333",
    marginBottom: 10,
    backgroundColor: "#f8f8f8"
  },
  orderSummary: {
    padding: 10
  },
  summaryText: {
    fontWeight: "bold",
    marginBottom: 4
  },
  detailsBox: {
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#333333"
  },
  productRow: {
    flexDirection: "row",
    marginBottom: 10
  },
  productImage: {
    width: 60,
    height: 60,
    resizeMode: "contain",
    marginRight: 10
  },
  productInfo: {
    flex: 1,
    justifyContent: "center"
  },
  productTitle: {
    fontWeight: "bold",
    marginBottom: 4
  },
  actionButton: {
    backgroundColor: "#2f6fb0",
    paddingVertical: 12,
    borderRadius: 6,
    marginTop: 10
  },
  buttonText: {
    color: "#ffffff",
    textAlign: "center",
    fontWeight: "bold"
  }
});