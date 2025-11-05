import * as ImagePicker from "expo-image-picker";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { db } from "../../firebase";

export default function AdminDashboard() {
  const [cars, setCars] = useState([]);
  const [form, setForm] = useState({ name: "", brand: "", price: "", image: "" });
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // realtime update
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "cars"), (snapshot) => {
      const carList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCars(carList);
    });
    return () => unsub();
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });
    if (!result.canceled) {
      setForm({ ...form, image: result.assets[0].uri });
    }
  };

  const handleAddCar = async () => {
    if (!form.name || !form.brand || !form.price || !form.image) {
      Alert.alert("⚠️ Lengkapi semua data sebelum menyimpan!");
      return;
    }
    try {
      await addDoc(collection(db, "cars"), {
        name: form.name,
        brand: form.brand,
        price: parseInt(form.price),
        image: form.image,
        createdAt: new Date(),
      });
      Alert.alert("✅ Sukses", "Mobil berhasil ditambahkan!");
      setForm({ name: "", brand: "", price: "", image: "" });
      setModalVisible(false);
    } catch (error) {
      console.error(error);
      Alert.alert("❌ Gagal menambah mobil");
    }
  };

  const handleEdit = (car) => {
    setForm({
      name: car.name,
      brand: car.brand,
      price: car.price.toString(),
      image: car.image,
    });
    setEditingId(car.id);
    setIsEditing(true);
    setModalVisible(true);
  };

  const handleUpdateCar = async () => {
    if (!form.name || !form.brand || !form.price || !form.image) {
      Alert.alert("⚠️ Lengkapi semua data sebelum menyimpan!");
      return;
    }
    try {
      await updateDoc(doc(db, "cars", editingId), {
        name: form.name,
        brand: form.brand,
        price: parseInt(form.price),
        image: form.image,
      });
      Alert.alert("✅ Sukses", "Data mobil berhasil diperbarui!");
      setForm({ name: "", brand: "", price: "", image: "" });
      setModalVisible(false);
      setIsEditing(false);
      setEditingId(null);
    } catch (error) {
      console.error(error);
      Alert.alert("❌ Gagal memperbarui data mobil");
    }
  };

  const handleDelete = async (id) => {
    Alert.alert("Konfirmasi", "Hapus mobil ini?", [
      { text: "Batal", style: "cancel" },
      {
        text: "Hapus",
        style: "destructive",
        onPress: async () => {
          await deleteDoc(doc(db, "cars", id));
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard Admin</Text>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          setForm({ name: "", brand: "", price: "", image: "" });
          setIsEditing(false);
          setModalVisible(true);
        }}
      >
        <Text style={styles.addButtonText}>+ Tambah Mobil</Text>
      </TouchableOpacity>

      <FlatList
        data={cars}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.carCard}>
            <Image source={{ uri: item.image }} style={styles.carImage} />
            <View style={{ flex: 1 }}>
              <Text style={styles.carName}>{item.name}</Text>
              <Text>{item.brand}</Text>
              <Text>Rp {item.price.toLocaleString("id-ID")} / hari</Text>
            </View>

            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => handleEdit(item)}
              >
                <Text style={{ color: "white" }}>Edit</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDelete(item.id)}
              >
                <Text style={{ color: "white" }}>Hapus</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* Modal Tambah/Edit Mobil */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {isEditing ? "Edit Mobil" : "Tambah Mobil Baru"}
            </Text>

            <TextInput
              placeholder="Nama Mobil"
              style={styles.input}
              value={form.name}
              onChangeText={(t) => setForm({ ...form, name: t })}
            />
            <TextInput
              placeholder="Merek Mobil"
              style={styles.input}
              value={form.brand}
              onChangeText={(t) => setForm({ ...form, brand: t })}
            />
            <TextInput
              placeholder="Harga / hari"
              style={styles.input}
              keyboardType="numeric"
              value={form.price}
              onChangeText={(t) => setForm({ ...form, price: t })}
            />

            <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
              <Text style={{ color: "#007bff" }}>Pilih Gambar</Text>
            </TouchableOpacity>

            {form.image ? (
              <Image source={{ uri: form.image }} style={styles.previewImage} />
            ) : null}

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text>Batal</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.saveButton}
                onPress={isEditing ? handleUpdateCar : handleAddCar}
              >
                <Text style={{ color: "white" }}>
                  {isEditing ? "Update" : "Simpan"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  addButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
  },
  addButtonText: { color: "white", textAlign: "center", fontWeight: "bold" },
  carCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3f3f3",
    marginBottom: 10,
    padding: 10,
    borderRadius: 10,
  },
  carImage: { width: 80, height: 60, borderRadius: 8, marginRight: 10 },
  carName: { fontWeight: "bold", fontSize: 16 },
  actionButtons: {
    flexDirection: "column",
    gap: 5,
  },
  editButton: {
    backgroundColor: "#28a745",
    padding: 8,
    borderRadius: 6,
    marginBottom: 5,
  },
  deleteButton: {
    backgroundColor: "red",
    padding: 8,
    borderRadius: 6,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    width: "85%",
    padding: 16,
    borderRadius: 10,
  },
  modalTitle: { fontWeight: "bold", fontSize: 18, marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 8,
    marginBottom: 10,
  },
  imagePicker: {
    borderWidth: 1,
    borderColor: "#007bff",
    borderRadius: 8,
    padding: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  previewImage: { width: "100%", height: 150, borderRadius: 8, marginBottom: 10 },
  modalButtons: { flexDirection: "row", justifyContent: "space-between" },
  cancelButton: { padding: 10 },
  saveButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 8,
  },
});
