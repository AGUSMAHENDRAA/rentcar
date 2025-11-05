import { Link, useRouter } from "expo-router";
import { signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
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
import { auth, db } from "./../../firebase";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Email dan password wajib diisi!");
      return;
    }
    if (!validateEmail(email)) {
      setError("Format email tidak valid!");
      return;
    }
    if (password.length < 6) {
      setError("Password minimal 6 karakter!");
      return;
    }

    setError("");

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 🔹 Ambil nama dari Firestore jika ada
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (!user.displayName && userData.name) {
          await updateProfile(user, { displayName: userData.name });
        }
      }

      Alert.alert("Login Berhasil", `Selamat datang ${user.displayName || user.email}`);
      router.replace("/(tabs)");
    } catch (err) {
      console.log("Firebase login error:", err.code, err.message);
      switch (err.code) {
        case "auth/user-not-found":
          setError("User tidak ditemukan!");
          break;
        case "auth/wrong-password":
          setError("Password salah!");
          break;
        case "auth/invalid-email":
          setError("Email tidak valid!");
          break;
        default:
          setError("Terjadi kesalahan saat login. Silakan coba lagi.");
      }
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("./../../assets/images/logocar.png")}
        style={styles.logo}
      />
      <Text style={styles.title}>Masuk ke RentRider</Text>

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
        placeholder="Password"
        placeholderTextColor="#ccc"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Masuk</Text>
      </TouchableOpacity>

      <Text style={styles.footerText}>
        Belum punya akun?{" "}
        <Link href="/auth/register" style={styles.link}>
          Daftar Sekarang
        </Link>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1C3B8A", alignItems: "center", justifyContent: "center", padding: 20 },
  logo: { width: 120, height: 120, resizeMode: "contain", marginBottom: 10 },
  title: { color: "#fff", fontSize: 22, fontWeight: "bold", marginBottom: 25 },
  input: { width: "100%", backgroundColor: "#ffffff20", borderRadius: 8, padding: 12, color: "white", marginBottom: 10 },
  button: { backgroundColor: "#fff", paddingVertical: 12, borderRadius: 8, width: "100%", alignItems: "center", marginTop: 15 },
  buttonText: { color: "#1C3B8A", fontWeight: "bold", fontSize: 16 },
  footerText: { color: "#fff", marginTop: 20 },
  link: { color: "#FFD700", fontWeight: "bold" },
  errorText: { color: "#FFD700", fontSize: 13, marginBottom: 10, textAlign: "center" },
});
