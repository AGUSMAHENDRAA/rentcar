import { useLocalSearchParams, useRouter } from "expo-router";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function DetailMobil() {
  const { name, type, price, seats, transmission, desc } = useLocalSearchParams();
  const router = useRouter();

  const handleRent = () => {
    router.push({
      pathname: "/(tabs)/formPemesanan",
      params: { name, price },
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Gambar mobil */}
      <Image
        source={require("./../../assets/images/avanza.png")}
        style={styles.image}
      />

      {/* Nama dan jenis mobil */}
      <Text style={styles.title}>{name}</Text>
      <Text style={styles.type}>{type}</Text>

      {/* Info kursi dan transmisi */}
      <View style={styles.infoBox}>
        <Text style={styles.infoText}>💺 {seats} Kursi</Text>
        <Text style={styles.infoText}>⚙️ {transmission}</Text>
      </View>

      {/* Harga dan deskripsi */}
      <Text style={styles.price}>Rp {Number(price).toLocaleString("id-ID")} / hari</Text>
      <Text style={styles.desc}>{desc}</Text>

      {/* Tombol sewa sekarang */}
      <TouchableOpacity style={styles.button} onPress={handleRent}>
        <Text style={styles.buttonText}>Sewa Sekarang</Text>
      </TouchableOpacity>

      {/* Tombol kembali */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backText}>← Kembali</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center", backgroundColor: "#F9FAFB", padding: 20 },
  image: { width: "100%", height: 200, resizeMode: "contain", marginBottom: 20 },
  title: { fontSize: 22, fontWeight: "bold", color: "#1E3A8A" },
  type: { fontSize: 16, color: "#6B7280", marginBottom: 15 },
  infoBox: { flexDirection: "row", gap: 20, marginBottom: 10 },
  infoText: { fontSize: 14, color: "#111827", fontWeight: "500" },
  price: { fontSize: 18, fontWeight: "bold", color: "#1E3A8A", marginVertical: 10 },
  desc: { textAlign: "center", color: "#374151", fontSize: 14, marginBottom: 30 },
  button: {
    backgroundColor: "#1E3A8A",
    paddingVertical: 12,
    paddingHorizontal: 50,
    borderRadius: 10,
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  backButton: { marginTop: 25 },
  backText: { color: "#3B82F6", fontSize: 14, fontWeight: "bold" },
});
