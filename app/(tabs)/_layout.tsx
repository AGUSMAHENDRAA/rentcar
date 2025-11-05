import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#1C3B8A",
        tabBarInactiveTintColor: "#9CA3AF",
        tabBarStyle: {
          backgroundColor: "#fff",
          height: 65,
          paddingBottom: 5,
          paddingTop: 5,
        },
      }}
    >
      {/* Home */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />

      Explore
      <Tabs.Screen
        name="explore"
        options={{
          href: null,
        }}
      />

      {/* Profile */}
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />

      {/* 🔹 Sembunyikan tab lain (tidak muncul di bawah) */}
      <Tabs.Screen
        name="AdminCRUDScreen"
        options={{
          title: "Admin",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="detail"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="formPemesanan"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="ReturnMotorScreen"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="riwayatUser"
        options={{ href: null }}
      />
    </Tabs>
  );
}
