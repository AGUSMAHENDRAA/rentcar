import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function FormPemesanan() {
  const router = useRouter();
  const { name, price } = useLocalSearchParams();
  const [form, setForm] = useState({
    nama: "",
    tanggal: "",
    durasi: "",
  });

  const handleSubmit = () => {
    if (!form.nama || !form.tanggal || !form.durasi) {
      Alert.alert("Peringatan ⚠️", "Harap isi semua data pemesanan!");
      return;
    }

    const total = Number(price) * Number(form.durasi);

    router.push({
      pathname: "/invoice",
      params: {
        nama: form.nama,
        tanggal: form.tanggal,
        durasi: form.durasi,
        total,
        name,
        price,
      },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📝 Form Pemesanan</Text>
      <Text style={styles.carName}>Mobil: {name}</Text>
      <Text style={styles.carPrice}>
        Harga: Rp {Number(price).toLocaleString("id-ID")} / hari
      </Text>

      <TextInput
        placeholder="Nama Lengkap"
        style={styles.input}
        value={form.nama}
        onChangeText={(text) => setForm({ ...form, nama: text })}
      />
      <TextInput
        placeholder="Tanggal Sewa (contoh: 2025-11-10)"
        style={styles.input}
        value={form.tanggal}
        onChangeText={(text) => setForm({ ...form, tanggal: text })}
      />
      <TextInput
        placeholder="Durasi (hari)"
        style={styles.input}
        keyboardType="numeric"
        value={form.durasi}
        onChangeText={(text) => setForm({ ...form, durasi: text })}
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Konfirmasi Pemesanan</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#F9FAFB" },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1E3A8A",
    marginBottom: 15,
    textAlign: "center",
  },
  carName: { color: "#111827", fontWeight: "600" },
  carPrice: { color: "#2563EB", marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
    backgroundColor: "white",
  },
  button: {
    backgroundColor: "#1E3A8A",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: { color: "white", fontWeight: "bold", fontSize: 16 },
});
