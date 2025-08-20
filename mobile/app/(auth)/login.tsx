import { View, Text, Pressable } from "react-native";
import { Link } from "expo-router";

export default function Login() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-2xl font-bold text-blue-600">Login</Text>
      <Link href="/(tabs)/home" asChild>
        <Pressable className="mt-4 px-4 py-2 bg-green-500 rounded-lg">
          <Text className="text-white">Go to Home</Text>
        </Pressable>
      </Link>
    </View>
  );
}
