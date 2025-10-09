import React from "react";
import { TextInput, StyleSheet, View } from "react-native";

interface SearchBarProps {
  search: string;
  setSearch: (text: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ search, setSearch }) => {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search devices..."
        placeholderTextColor="#b3b2b2"
        value={search}
        onChangeText={setSearch}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { alignItems: "center", marginBottom: 12 },
  searchBar: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 40,
    width: 350,
    fontSize: 16,
    color: "black",
  },
});

export default SearchBar;
