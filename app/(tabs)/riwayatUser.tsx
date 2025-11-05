import { Image, ScrollView, StyleSheet, Text, View } from "react-native";

export default function RiwayatUser() {
  const riwayat = [
    {
      id: "1",
      car: "Toyota Avanza",
      date: "25 Okt 2025",
      total: 350000,
      status: "Selesai",
      image: require("./../../assets/images/avanza.png"),
    },
    {
      id: "2",
      car: "Honda Brio",
      date: "20 Okt 2025",
      total: 300000,
      status: "Dibatalkan",
      image: require("./../../assets/images/brio.png"),
    },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🧾 Riwayat Pemesanan Saya</Text>

      {riwayat.map((item) => (
        <View key={item.id} style={styles.card}>
          <Image source={item.image} style={styles.carImage} resizeMode="contain" />
          <View style={styles.info}>
            <Text style={styles.carName}>{item.car}</Text>
            <Text style={styles.date}>{item.date}</Text>
            <Text style={styles.price}>Rp {item.total.toLocaleString("id-ID")}</Text>
            <Text
              style={[
                styles.status,
                item.status === "Selesai"
                  ? { color: "#16A34A" }
                  : item.status === "Dibatalkan"
                  ? { color: "#DC2626" }
                  : { color: "#F59E0B" },
              ]}
            >
              {item.status}
            </Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: "#F9FAFB" },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1E3A8A",
    marginBottom: 16,
    textAlign: "center",
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    elevation: 2,
  },
  carImage: { width: 100, height: 80, borderRadius: 8, marginRight: 12 },
  info: { flex: 1, justifyContent: "center" },
  carName: { fontWeight: "bold", color: "#111827", fontSize: 16 },
  date: { color: "#6B7280", fontSize: 13, marginVertical: 3 },
  price: { color: "#1E3A8A", fontWeight: "600", fontSize: 14 },
  status: { fontWeight: "bold", marginTop: 6, fontSize: 13 },
});
