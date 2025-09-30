import { Stack } from "expo-router";
import { Redirect } from "expo-router";

const DEV_MODE = true; // toggle this when needed

export default function AuthLayout() {
  if (DEV_MODE) {
    return <Redirect href="/explore" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
    </Stack>
  );
}
