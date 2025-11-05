import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Splash screen */}
      <Stack.Screen name="splash" />

      {/* Folder auth (login & register) */}
      <Stack.Screen name="auth" />

      {/* Folder utama dengan tab bar */}
      <Stack.Screen name="(tabs)" />

      {/* Halaman lain di luar tab bar */}
      <Stack.Screen name="invoice" />
    </Stack>
  );
}
