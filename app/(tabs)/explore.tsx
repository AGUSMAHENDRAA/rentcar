import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as Animatable from "react-native-animatable";
import { useCarsStore } from "../../store/useCarsStore";

const initialCars = [
  {
    id: "1",
    name: "Toyota Avanza",
    brand: "Toyota",
    category: "MPV",
    fuel: "Bensin",
    cc: 1500,
    unit: 3,
    price: 350000,
    image: require("./../../assets/images/avanza.png"),
  },
  {
    id: "2",
    name: "Honda Brio",
    brand: "Honda",
    category: "Hatchback",
    fuel: "Bensin",
    cc: 1200,
    unit: 1,
    price: 300000,
    image: require("./../../assets/images/avanza.png"),
  },
  {
    id: "3",
    name: "Mitsubishi Xpander",
    brand: "Mitsubishi",
    category: "MPV",
    fuel: "Bensin",
    cc: 1500,
    unit: 0,
    price: 400000,
    image: require("./../../assets/images/avanza.png"),
  },
  {
    id: "4",
    name: "Daihatsu Terios",
    brand: "Daihatsu",
    category: "SUV",
    fuel: "Bensin",
    cc: 1500,
    unit: 2,
    price: 450000,
    image: require("./../../assets/images/avanza.png"),
  },
];

export default function ListCarScreen() {
  const { cars, setCars, updateCarUnit } = useCarsStore();
  const [search, setSearch] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [selectedCar, setSelectedCar] = useState<any>(null);
  const [formVisible, setFormVisible] = useState(false);
  const [nama, setNama] = useState("");
  const [lamaSewa, setLamaSewa] = useState("");
  const [successModal, setSuccessModal] = useState(false);
  const [fileUri, setFileUri] = useState<string | null>(null);

  useEffect(() => {
    if (!cars || cars.length === 0) {
      setCars(initialCars);
    }
  }, []);

  const toggleCategory = (category: string) => {
    if (expandedCategories.includes(category)) {
      setExpandedCategories(expandedCategories.filter((c) => c !== category));
    } else {
      setExpandedCategories([...expandedCategories, category]);
    }
  };

  const handleRent = (car: any) => {
    if (car.unit === 0) {
      Alert.alert("Unit Habis", `${car.name} tidak tersedia untuk disewa.`);
      return;
    }
    setSelectedCar(car);
    setFormVisible(true);
  };

  const handleConfirmRent = async () => {
    if (!nama || !lamaSewa) {
      Alert.alert("Error", "Harap isi semua data!");
      return;
    }

    const days = parseInt(lamaSewa);
    const totalHarga = selectedCar.price * days;

    updateCarUnit(selectedCar.id, selectedCar.unit - 1);

    const content = `
📄 Bukti Booking Mobil RentCar

Nama Penyewa : ${nama}
Mobil        : ${selectedCar.name}
Merk         : ${selectedCar.brand}
Kategori     : ${selectedCar.category}
Lama Sewa    : ${days} hari
Harga / Hari : Rp ${selectedCar.price.toLocaleString()}
Total Bayar  : Rp ${totalHarga.toLocaleString()}

⚠️ Pembayaran hanya bisa dilakukan secara CASH di RentCar.
Tunjukkan bukti ini kepada admin saat pembayaran dan pengambilan unit.

Terima kasih telah menggunakan layanan RentCar 🚗
`;

    try {
      if (Platform.OS === "web") {
        const blob = new Blob([content], { type: "text/plain" });
        const url = window.URL.createObjectURL(blob);
        setFileUri(url);
      } else {
        const file = `${FileSystem.documentDirectory}BuktiBooking_${selectedCar.name}_${nama}.txt`;
        await FileSystem.writeAsStringAsync(file, content);
        setFileUri(file);
      }
      setSuccessModal(true);
    } catch (error) {
      Alert.alert("Gagal Membuat Bukti", (error as Error).message);
    }

    setFormVisible(false);
  };

  const handleDownloadBooking = async () => {
    if (!fileUri) return;

    try {
      if (Platform.OS === "web") {
        const a = document.createElement("a");
        a.href = fileUri;
        a.download = "BuktiBooking_RentCar.txt";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(fileUri);
      } else {
        await Sharing.shareAsync(fileUri);
      }
      setSuccessModal(false);
      setNama("");
      setLamaSewa("");
      setSelectedCar(null);
    } catch {
      Alert.alert("Error", "Gagal mendownload bukti booking.");
    }
  };

  const filteredCars = (cars || []).filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const groupedByCategory = filteredCars.reduce((groups: any, c) => {
    if (!groups[c.category]) groups[c.category] = [];
    groups[c.category].push(c);
    return groups;
  }, {});

  const renderCarImage = (imageSource: any) => {
    if (typeof imageSource === "string") {
      return <Image source={{ uri: imageSource }} style={styles.image} resizeMode="contain" />;
    } else {
      return <Image source={imageSource} style={styles.image} resizeMode="contain" />;
    }
  };

  const renderCar = (car: any) => (
    <Animatable.View
      key={car.id}
      animation="fadeInUp"
      duration={600}
      style={styles.card}
      pointerEvents="box-none"
    >
      {car.image && renderCarImage(car.image)}
      <Text style={styles.title}>{car.name}</Text>
      <Text style={styles.text}>Merk: {car.brand}</Text>
      <Text style={styles.text}>Kategori: {car.category}</Text>
      <Text style={styles.text}>
        Harga: Rp {car.price.toLocaleString()} /hari
      </Text>
      <Text style={styles.text}>Unit Tersedia: {car.unit}</Text>

      <TouchableOpacity
        style={[styles.button, car.unit === 0 && styles.disabledButton]}
        disabled={car.unit === 0}
        onPress={() => handleRent(car)}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>
          {car.unit === 0 ? "Tidak Tersedia" : "Sewa Mobil"}
        </Text>
      </TouchableOpacity>
    </Animatable.View>
  );

  return (
    <>
      <Animatable.View animation="fadeIn" duration={700} style={styles.container}>
        <Text style={styles.pageTitle}>Daftar Mobil Tersedia</Text>

        <TextInput
          style={styles.searchInput}
          placeholder="Cari nama mobil..."
          value={search}
          onChangeText={setSearch}
        />

        <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
          {Object.keys(groupedByCategory).length === 0 ? (
            <Text style={styles.emptyText}>Tidak ada mobil tersedia</Text>
          ) : (
            Object.keys(groupedByCategory).map((category) => {
              const isExpanded = expandedCategories.includes(category);
              return (
                <View key={category} style={{ marginTop: 15 }}>
                  <TouchableOpacity
                    style={styles.categoryHeader}
                    onPress={() => toggleCategory(category)}
                  >
                    <Text style={styles.categoryTitle}>{category}</Text>
                    <Text style={styles.icon}>{isExpanded ? "▲" : "▼"}</Text>
                  </TouchableOpacity>

                  {isExpanded && (
                    <Animatable.View animation="fadeIn" duration={500} pointerEvents="box-none">
                      {groupedByCategory[category].map((car: any) =>
                        renderCar(car)
                      )}
                    </Animatable.View>
                  )}
                </View>
              );
            })
          )}
        </ScrollView>
      </Animatable.View>

      {/* Modal Form */}
      <Modal visible={formVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>
              Form Sewa {selectedCar?.name}
            </Text>
            <TextInput
              placeholder="Nama Penyewa"
              value={nama}
              onChangeText={setNama}
              style={styles.input}
            />
            <TextInput
              placeholder="Lama Sewa (hari)"
              keyboardType="numeric"
              value={lamaSewa}
              onChangeText={setLamaSewa}
              style={styles.input}
            />
            {lamaSewa ? (
              <Text style={styles.totalText}>
                Total: Rp{" "}
                {(selectedCar?.price * parseInt(lamaSewa)).toLocaleString()}
              </Text>
            ) : null}
            <Text style={styles.noteText}>
              ⚠️ Pembayaran hanya bisa dilakukan secara cash di RentCar.
            </Text>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleConfirmRent}
            >
              <Text style={styles.modalButtonText}>Sewa Sekarang</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setFormVisible(false)}
              style={styles.cancelButton}
            >
              <Text style={styles.cancelText}>Batal</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal Sukses */}
      <Modal visible={successModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.successBox}>
            <Text style={styles.modalTitle}>✅ Sewa Berhasil!</Text>
            <Text style={{ textAlign: "center", marginBottom: 15 }}>
              Download bukti booking Anda dan tunjukkan ke admin RentCar saat
              pembayaran dan pengambilan unit.
            </Text>
            <TouchableOpacity
              style={styles.downloadButton}
              onPress={handleDownloadBooking}
            >
              <Text style={styles.downloadText}>Download Bukti Booking</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <View>
        <Text style={styles.footer}>Dibuat Oleh RentCar dengan ❤️</Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9", padding: 20 },
  pageTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1E3A8A",
    marginBottom: 16,
    textAlign: "center",
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
    backgroundColor: "white",
  },
  categoryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#e5e7eb",
    padding: 10,
    borderRadius: 8,
  },
  categoryTitle: { fontSize: 18, fontWeight: "bold", color: "#2563EB" },
  icon: { fontSize: 18, color: "#2563EB" },
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  image: {
    width: "100%",
    height: 180,
    borderRadius: 10,
    marginBottom: 12,
  },
  title: { fontSize: 18, fontWeight: "bold", color: "#111827" },
  text: { fontSize: 14, color: "#374151", marginTop: 4 },
  button: {
    backgroundColor: "#2563EB",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 12,
  },
  disabledButton: { backgroundColor: "#9CA3AF" },
  buttonText: { color: "white", fontWeight: "bold" },
  emptyText: {
    textAlign: "center",
    color: "#6B7280",
    marginTop: 40,
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    width: "85%",
  },
  successBox: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 25,
    width: "85%",
    alignItems: "center",
  },
  modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
  },
  totalText: {
    marginTop: 10,
    fontWeight: "bold",
    color: "#111827",
  },
  noteText: {
    marginTop: 10,
    color: "#EF4444",
    fontStyle: "italic",
  },
  modalButton: {
    backgroundColor: "#2563EB",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  modalButtonText: { color: "white", fontWeight: "bold" },
  cancelButton: { alignItems: "center", marginTop: 10 },
  cancelText: { color: "#6B7280" },
  downloadButton: {
    backgroundColor: "#22C55E",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  footer: {
    fontSize: 12,
    color: "#9CA3AF",
    textAlign: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  downloadText: { color: "white", fontWeight: "bold" },
});
