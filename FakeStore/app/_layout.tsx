import { Stack } from "expo-router";
import { Provider } from "react-redux";
import { store } from "../redux/store";

export default function RootLayout() {
  return (
    <Provider store={store}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="auth/index" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="products/list" />
        <Stack.Screen name="products/detail" />
      </Stack>
    </Provider>
  );
}