import { FlatList, Image, StyleSheet, View } from "react-native";
import PlaceCard from "../../components/PlaceCard";
import ProvinceDropdown from "../../components/ProvinceDropdown";
import SectionHeader from "../../components/SectionHeader";
import { places } from "../../data/places"; // ✅ import shared data

export default function Home() {
  // Split the array into two groups
  const popularPlaces = places.slice(0, 2);
  const recommendedPlaces = places.slice(2);

  return (
    <View style={styles.container}>
      {/* Province Dropdown + Logo */}
      <View style={styles.header}>
        <ProvinceDropdown />
        <Image source={require("../../assets/logo.png")} style={styles.logo} />
      </View>

      {/* Popular Places */}
      <SectionHeader title="Popular Places" />
      <FlatList
        data={popularPlaces}
        horizontal
        renderItem={({ item }) => <PlaceCard {...item} />}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
      />

      {/* Recommended */}
      <SectionHeader title="Recommended for you" />
      <FlatList
        data={recommendedPlaces}
        renderItem={({ item }) => <PlaceCard {...item} />}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: { width: 40, height: 40 },
});
