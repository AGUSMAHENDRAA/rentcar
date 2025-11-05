import { Link, useRouter } from "expo-router";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useState } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { auth, db } from "./../../firebase"; // pastikan path sesuai

export default function RegisterScreen() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone) => /^[0-9]{10,15}$/.test(phone);

  const handleRegister = async () => {
    if (!name || !email || !password || !phone) {
      setError("Semua kolom wajib diisi!");
      return;
    }
    if (name.trim().length < 3) {
      setError("Nama minimal 3 huruf!");
      return;
    }
    if (!validateEmail(email)) {
      setError("Format email tidak valid!");
      return;
    }
    if (!validatePhone(phone)) {
      setError("Nomor telepon tidak valid!");
      return;
    }
    if (password.length < 6) {
      setError("Password minimal 6 karakter!");
      return;
    }

    setError("");

    try {
      // Buat akun Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Update displayName di auth
      await updateProfile(user, { displayName: name });

      // Simpan data ke Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name,
        email,
        phone,
        createdAt: new Date(),
      });

      Alert.alert("Berhasil", "Akun berhasil dibuat, silakan login.");
      router.replace("/auth/login");
    } catch (err) {
      console.log("Firebase Register Error:", err.code, err.message);
      switch (err.code) {
        case "auth/email-already-in-use":
          setError("Email sudah digunakan!");
          break;
        case "auth/invalid-email":
          setError("Email tidak valid!");
          break;
        case "auth/weak-password":
          setError("Password terlalu lemah!");
          break;
        default:
          setError(err.message);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("./../../assets/images/logocar.png")}
        style={styles.logo}
      />
      <Text style={styles.title}>Daftar Akun Baru</Text>

      <TextInput
        style={styles.input}
        placeholder="Nama Lengkap"
        placeholderTextColor="#ccc"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#ccc"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Nomor Telepon"
        placeholderTextColor="#ccc"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#ccc"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Daftar</Text>
      </TouchableOpacity>

      <Text style={styles.footerText}>
        Sudah punya akun?{" "}
        <Link href="/auth/login" style={styles.link}>
          Masuk
        </Link>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1C3B8A",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  logo: { width: 120, height: 120, resizeMode: "contain", marginBottom: 10 },
  title: { color: "#fff", fontSize: 22, fontWeight: "bold", marginBottom: 25 },
  input: {
    width: "100%",
    backgroundColor: "#ffffff20",
    borderRadius: 8,
    padding: 12,
    color: "white",
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    marginTop: 15,
  },
  buttonText: { color: "#1C3B8A", fontWeight: "bold", fontSize: 16 },
  footerText: { color: "#fff", marginTop: 20 },
  link: { color: "#FFD700", fontWeight: "bold" },
  errorText: {
    color: "#FFD700",
    fontSize: 13,
    marginBottom: 10,
    textAlign: "center",
  },
});
