import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";

export default function Navbar() {
  const router = useRouter();

  return (
    <LinearGradient
      colors={["rgba(30,58,138,0.9)", "rgba(30,58,138,0.6)", "transparent"]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.navbar}
    >
      {/* 🔹 Logo Kiri */}
      <View style={styles.logoWrapper}>
        <Image
          source={require("./../assets/images/logocar.png")}
          style={styles.logoImage}
        />
      </View>

      {/* 🔹 Ikon Profil */}
      <TouchableOpacity
        style={styles.profileButton}
        onPress={() => router.push("./(tabs)/profil")}
      >
        <Ionicons name="person-circle-outline" size={36} color="white" />
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  navbar: {
    width: "100%",
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // position: "absolute", // agar menempel di atas
    top: 0,
    left: 0,
    zIndex: 50,
  },
  logoWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  logoImage: {
    width: 50,
    height: 50,
    resizeMode: "contain",
  },
  profileButton: {
    padding: 4,
  },
});
