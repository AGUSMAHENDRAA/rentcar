// app/(tabs)/home.jsx
import { useRouter } from "expo-router";
import { collection, onSnapshot } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as Animatable from "react-native-animatable";
import { db } from "../../firebase";

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const router = useRouter();
  const scrollRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cars, setCars] = useState([]);

  const banners = [
    require("../../assets/images/5.png"),
    require("../../assets/images/6.png"),
    require("../../assets/images/7.png"),
    require("../../assets/images/8.png"),
  ];

  // 🔹 Realtime ambil data mobil dari Firestore
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

  // 🔹 Auto slide banner
  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % banners.length;
      scrollRef.current?.scrollTo({ x: nextIndex * width, animated: true });
      setCurrentIndex(nextIndex);
    }, 3000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  return (
    <Animatable.View animation="fadeInUp" duration={800} style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 🔹 Banner Slider */}
        <View style={styles.bannerContainer}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            ref={scrollRef}
            onMomentumScrollEnd={(e) => {
              const index = Math.round(e.nativeEvent.contentOffset.x / width);
              setCurrentIndex(index);
            }}
          >
            {banners.map((img, index) => (
              <Image key={index} source={img} style={styles.bannerImage} />
            ))}
          </ScrollView>

          <View style={styles.dotContainer}>
            {banners.map((_, index) => (
              <View
                key={index}
                style={[styles.dot, { opacity: index === currentIndex ? 1 : 0.3 }]}
              />
            ))}
          </View>
        </View>

        {/* 🔹 Daftar Mobil dari Firestore */}
        <View style={styles.sectionContainer}>
          <Text style={styles.header}>Selamat Datang di CarRental</Text>
          <Text style={styles.title}>Pilih Mobil Anda dan Nikmati Perjalanannya!</Text>

          {cars.map((car, index) => (
            <Animatable.View
              key={car.id}
              animation="fadeInUp"
              delay={200 * index}
              style={styles.carCard}
            >
              <Image
                source={{ uri: car.image }}
                style={styles.carImage}
                resizeMode="contain"
              />
              <View style={styles.carInfo}>
                <Text style={styles.carName}>{car.name}</Text>
                <Text style={styles.carType}>{car.brand || "Tanpa Merek"}</Text>
                <Text style={styles.carPrice}>
                  Rp {Number(car.price).toLocaleString("id-ID")} / hari
                </Text>

                <TouchableOpacity
                  style={styles.detailButton}
                  onPress={() =>
                    router.push({
                      pathname: "/(tabs)/detail",
                      params: {
                        name: car.name,
                        brand: car.brand,
                        price: car.price,
                        image: car.image,
                        desc: car.desc,
                        seats: car.seats,
                        transmission: car.transmission,
                      },
                    })
                  }
                >
                  <Text style={styles.detailButtonText}>Detail Mobil</Text>
                </TouchableOpacity>
              </View>
            </Animatable.View>
          ))}
        </View>

        <Text style={styles.footer}>© 2025 RentRider — Teman Perjalanan Anda</Text>
      </ScrollView>
    </Animatable.View>
  );
}

// 🎨 Style diambil dari versi pertama (lebih rapi)
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },

  // Banner
  bannerContainer: { position: "relative", height: 200, backgroundColor: "#E5E7EB" },
  bannerImage: { width: width, height: 230, resizeMode: "cover" },
  dotContainer: {
    position: "absolute",
    bottom: 10,
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#1E3A8A",
    marginHorizontal: 4,
  },

  // Mobil
  sectionContainer: { paddingHorizontal: 15, marginTop: 20 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", color: "#16171aff", marginBottom: 10 },
  carCard: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    elevation: 3,
    marginBottom: 15,
  },
  carImage: { width: 100, height: 80, resizeMode: "contain", marginRight: 12 },
  carInfo: { flex: 1, justifyContent: "center" },
  carName: { fontWeight: "bold", fontSize: 16, color: "#111827" },
  carType: { fontSize: 13, color: "#6B7280", marginBottom: 4 },
  carPrice: { fontWeight: "600", color: "#1E3A8A", marginBottom: 10 },
  detailButton: {
    backgroundColor: "#1E3A8A",
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: "center",
  },
  detailButtonText: { color: "white", fontWeight: "bold", fontSize: 13 },
  footer: {
    textAlign: "center",
    color: "#9CA3AF",
    fontSize: 12,
    marginTop: 15,
    marginBottom: 20,
  },
  header: { fontSize: 35, fontWeight: "bold", marginBottom: 7, color: "#1E3A8A" },
  title: { fontSize: 20, fontWeight: "bold", color: "#1E3A8A", marginBottom: 10 },
});
