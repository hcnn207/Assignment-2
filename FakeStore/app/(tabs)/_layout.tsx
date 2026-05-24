import { Tabs, router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Alert, AppState } from "react-native";
import { useSelector } from "react-redux";
import { getOrders } from "../../services/localApi";

export default function TabLayout() {
  const isLoggedIn = useSelector((state: any) => state.auth.isLoggedIn);
  const token = useSelector((state: any) => state.auth.token);

  const totalQuantity = useSelector((state: any) =>
    state.cart.items.reduce((sum: number, item: any) => sum + item.quantity, 0)
  );

  const [newOrdersCount, setNewOrdersCount] = useState(0);

  async function loadOrderBadge() {
    if (!token) {
      setNewOrdersCount(0);
      return;
    }

    try {
      const data = await getOrders(token);
      const orders = data.orders || [];

      const newOrders = orders.filter(
        (order: any) =>
          Number(order.is_paid || 0) === 0 &&
          Number(order.is_delivered || 0) === 0
      );

      setNewOrdersCount(newOrders.length);
    } catch (_error) {
      setNewOrdersCount(0);
    }
  }

  useFocusEffect(
    useCallback(() => {
      loadOrderBadge();
    }, [token])
  );

  useEffect(() => {
    loadOrderBadge();

    const intervalId = setInterval(() => {
      loadOrderBadge();
    }, 3000);

    const subscription = AppState.addEventListener("change", (nextState) => {
      if (nextState === "active") {
        loadOrderBadge();
      }
    });

    return () => {
      clearInterval(intervalId);
      subscription.remove();
    };
  }, [token]);

  function protectTab(e: any) {
    if (!isLoggedIn) {
      e.preventDefault();
      Alert.alert("Login required", "Please sign in first.");
      router.push("/auth");
    }
  }

  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="index"
        options={{ title: "Products" }}
        listeners={{ tabPress: protectTab }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: "My Cart",
          tabBarBadge: totalQuantity > 0 ? totalQuantity : undefined
        }}
        listeners={{ tabPress: protectTab }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: "My Orders",
          tabBarBadge: newOrdersCount > 0 ? newOrdersCount : undefined
        }}
        listeners={{ tabPress: protectTab }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: "Profile" }}
      />
    </Tabs>
  );
}