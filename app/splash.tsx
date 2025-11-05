import { useRouter } from "expo-router";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import * as Animatable from "react-native-animatable";

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    // Navigasi otomatis ke halaman utama setelah 3 detik
    const timer = setTimeout(() => {
      router.replace("/auth/login");
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Animatable.Image
        source={require("./../assets/images/logocar.png")}
        animation="zoomIn"
        duration={1500}
        style={styles.logo}
      />
      {/* <Animatable.Text
        animation="fadeInUp"
        delay={1000}
        style={styles.text}
      >
        RentRider
      </Animatable.Text> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E3A8A",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: "contain",
  },
  text: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 10,
  },
});
