import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as Animatable from "react-native-animatable";
import { auth, db } from "./../../firebase";

export default function ProfilePage() {
  const router = useRouter();

  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    image: "", // awalnya kosong
  });

  const [isEditing, setIsEditing] = useState(false);
  const currentUser = auth.currentUser;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (userAuth) => {
      if (!userAuth) return;

      try {
        const docRef = doc(db, "users", userAuth.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUser({
            name: docSnap.data().name || userAuth.displayName || "",
            email: userAuth.email,
            phone: docSnap.data().phone || "",
            image: docSnap.data().image || "", // tetap kosong jika belum pernah upload
          });
        } else {
          await setDoc(docRef, {
            name: userAuth.displayName || "",
            email: userAuth.email,
            phone: "",
            image: "",
          });
          setUser({
            name: userAuth.displayName || "",
            email: userAuth.email,
            phone: "",
            image: "",
          });
        }
      } catch (err) {
        console.error("Error ambil data user:", err);
      }
    });

    return () => unsubscribe();
  }, []);

  // 📸 Ganti foto profil
  const pickProfileImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled && result.assets?.length > 0) {
      const newImageUri = result.assets[0].uri;

      try {
        // Simpan ke Firestore
        const docRef = doc(db, "users", currentUser.uid);
        await setDoc(docRef, { image: newImageUri }, { merge: true });

        setUser({ ...user, image: newImageUri });
        Alert.alert("✅ Berhasil", "Foto profil berhasil diperbarui!");
      } catch (err) {
        console.error("Error menyimpan foto:", err);
        Alert.alert("❌ Gagal", "Tidak dapat menyimpan foto profil.");
      }
    }
  };

  // 💾 Simpan perubahan profil
  const handleSave = async () => {
    if (!user.name || !user.email || !user.phone) {
      Alert.alert("⚠️ Lengkapi semua data profil!");
      return;
    }

    try {
      const docRef = doc(db, "users", currentUser.uid);
      await setDoc(
        docRef,
        {
          name: user.name,
          email: user.email,
          phone: user.phone,
          image: user.image,
        },
        { merge: true }
      );

      setIsEditing(false);
      Alert.alert("✅ Sukses", "Profil berhasil diperbarui!");
    } catch (err) {
      console.error("Error update profil:", err);
      Alert.alert("❌ Gagal", "Terjadi kesalahan saat menyimpan profil.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* 🔹 Header */}
      <Animatable.View animation="fadeInDown" style={styles.header}>
        <Text style={styles.title}>Profil Saya</Text>
        <Text style={styles.subtitle}>Kelola informasi akun Anda</Text>
      </Animatable.View>

      {/* 🔹 Foto Profil */}
      <Animatable.View animation="fadeInUp" delay={200} style={styles.profileSection}>
        <TouchableOpacity onPress={pickProfileImage}>
          {user.image ? (
            <Image source={{ uri: user.image }} style={styles.profileImage} resizeMode="cover" />
          ) : (
            <View
              style={[
                styles.profileImage,
                { backgroundColor: "#E5E7EB", justifyContent: "center", alignItems: "center" },
              ]}
            >
              <Text style={{ color: "#6B7280" }}>Belum ada foto</Text>
            </View>
          )}
          <Text style={styles.changePhoto}>Ganti Foto</Text>
        </TouchableOpacity>
      </Animatable.View>

      {/* 🔹 Form Profil */}
      <View style={styles.formContainer}>
        <Text style={styles.label}>Nama Lengkap</Text>
        <TextInput
          style={[styles.input, !isEditing && styles.disabledInput]}
          editable={isEditing}
          value={user.name}
          onChangeText={(text) => setUser({ ...user, name: text })}
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={[styles.input, !isEditing && styles.disabledInput]}
          editable={false}
          value={user.email}
        />

        <Text style={styles.label}>Nomor Telepon</Text>
        <TextInput
          style={[styles.input, !isEditing && styles.disabledInput]}
          editable={isEditing}
          value={user.phone}
          keyboardType="phone-pad"
          onChangeText={(text) => setUser({ ...user, phone: text })}
        />

        {/* 🔹 Tombol Aksi */}
        {isEditing ? (
          <>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveText}>💾 Simpan Perubahan</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setIsEditing(false)}
            >
              <Text style={styles.cancelText}>❌ Batal</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setIsEditing(true)}
          >
            <Text style={styles.editText}>✏️ Edit Profil</Text>
          </TouchableOpacity>
        )}

        {/* 🔹 Tombol Riwayat Pemesanan */}
        <TouchableOpacity
          style={styles.historyButton}
          onPress={() => router.push("/riwayatUser")}
        >
          <Text style={styles.historyText}>📋 Lihat Riwayat Pemesanan</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// 🔸 STYLE TIDAK DIUBAH 🔸
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  header: {
    backgroundColor: "#1E3A8A",
    paddingVertical: 25,
    alignItems: "center",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  title: { color: "#FFF", fontSize: 22, fontWeight: "bold" },
  subtitle: { color: "#E0E7FF", fontSize: 13, marginTop: 4 },

  profileSection: { alignItems: "center", marginTop: 20 },
  profileImage: {
    width: 110,
    height: 110,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "#1E3A8A",
  },
  changePhoto: {
    color: "#2563EB",
    fontWeight: "600",
    marginTop: 8,
    textAlign: "center",
  },

  formContainer: { paddingHorizontal: 25, marginTop: 25 },
  label: { color: "#374151", fontWeight: "600", fontSize: 14, marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 10,
    padding: 10,
    backgroundColor: "#FFF",
    marginBottom: 15,
  },
  disabledInput: {
    backgroundColor: "#F3F4F6",
    color: "#6B7280",
  },

  editButton: {
    backgroundColor: "#2563EB",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  editText: { color: "white", fontWeight: "bold", fontSize: 16 },

  saveButton: {
    backgroundColor: "#22C55E",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  saveText: { color: "white", fontWeight: "bold", fontSize: 16 },

  cancelButton: {
    backgroundColor: "#E5E7EB",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  cancelText: { color: "#374151", fontWeight: "bold", fontSize: 16 },

  historyButton: {
    backgroundColor: "#F59E0B",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  historyText: { color: "white", fontWeight: "bold", fontSize: 16 },
});
