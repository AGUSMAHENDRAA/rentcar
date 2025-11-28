import * as Google from "expo-auth-session/providers/google";
import Constants from "expo-constants";
import { Link, useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import {
  GoogleAuthProvider,
  signInWithCredential,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
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

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Ambil config dari app.json
  const extra = (Constants.expoConfig?.extra || {}) as {
    clientId?: string;
    androidClientId?: string;
    iosClientId?: string;
  };

  // EXPO GO → gunakan redirectUri proxy manual karena useProxy tidak didukung di versi expo-auth-session saat ini
  const redirectUri = "https://auth.expo.io/@tianarsamm/rentbike";

  // const [request, response, promptAsync] = Google.useAuthRequest({
  //   clientId: extra.clientId,
  //   androidClientId: extra.androidClientId,
  //   iosClientId: extra.iosClientId,
  //   scopes: ["profile", "email"],
  //   responseType: "id_token",
  //   redirectUri,
  // });
const [request, response, promptAsync] = Google.useAuthRequest({
  clientId: extra.clientId,
  scopes: ["profile", "email"],
  // responseType: "id_token",
  redirectUri,
});

  // Handle Google Login Response
  useEffect(() => {
    if (response?.type === "success" && response.authentication) {
      const { idToken } = response.authentication;

      const credential = GoogleAuthProvider.credential(idToken);

      signInWithCredential(auth, credential)
        .then(async (result) => {
          const user = result.user;

          const ref = doc(db, "users", user.uid);
          const snap = await getDoc(ref);

          if (!snap.exists()) {
            await setDoc(ref, {
              name: user.displayName,
              email: user.email,
              photo: user.photoURL,
              createdAt: new Date(),
            });
          }

          Alert.alert("Berhasil", `Selamat datang ${user.displayName}`);
          router.replace("/(tabs)");
        })
        .catch((err) => {
          console.log("Google Login Error:", err);
          Alert.alert("Error", "Login Google gagal");
        });
    }
  }, [response]);

  // Validasi Email
  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

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
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      Alert.alert("Login Berhasil", `Selamat datang ${user.email}`);
      router.replace("/(tabs)");
    } catch (err: any) {
      switch (err.code) {
        case "auth/user-not-found":
          setError("User tidak ditemukan!");
          break;
        case "auth/wrong-password":
          setError("Password salah!");
          break;
        default:
          setError("Terjadi kesalahan saat login.");
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

      <Text style={styles.orText}>OR</Text>

      <TouchableOpacity
        style={styles.googleButton}
        onPress={() => promptAsync()}
        disabled={!request}
      >
        <Image
          source={{
            uri: "https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg",
          }}
          style={{ width: 20, height: 20, marginRight: 10 }}
        />
        <Text style={styles.googleText}>Masuk dengan Google</Text>
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

// ======== STYLES ==========
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1C3B8A",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  logo: {
    width: 120,
    height: 120,
    resizeMode: "contain",
    marginBottom: 10,
  },
  title: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 25,
  },
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
  buttonText: {
    color: "#1C3B8A",
    fontWeight: "bold",
    fontSize: 16,
  },
  errorText: {
    color: "#FFD700",
    fontSize: 13,
    marginBottom: 10,
    textAlign: "center",
  },
  orText: {
    color: "#fff",
    marginVertical: 15,
    fontSize: 14,
  },
  googleButton: {
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingVertical: 12,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  googleText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 15,
  },
  footerText: {
    color: "#fff",
    marginTop: 20,
  },
  link: {
    color: "#FFD700",
    fontWeight: "bold",
  },
});
