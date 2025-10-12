import { View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const BackArrow = () => {
  return (
    <TouchableOpacity
      onPress={() => router.back()} // 👈 goes back
      style={{ padding: 10 }}
    >
      <Ionicons name="arrow-back" size={24} color="#000" />
    </TouchableOpacity>
  );
};

export default BackArrow;