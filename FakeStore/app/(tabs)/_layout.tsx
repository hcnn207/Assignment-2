import { Tabs } from "expo-router";
import { useSelector } from "react-redux";

export default function TabLayout() {
  const totalQuantity = useSelector((state: any) =>
    state.cart.items.reduce((sum: number, item: any) => sum + item.quantity, 0)
  );

  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Products"
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: "Shopping Cart",
          tabBarBadge: totalQuantity > 0 ? totalQuantity : undefined
        }}
      />
    </Tabs>
  );
}