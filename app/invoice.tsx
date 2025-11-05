import * as Print from "expo-print";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as Sharing from "expo-sharing";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function InvoiceScreen() {
  const router = useRouter();
  const { nama, tanggal, durasi, total, name, price } = useLocalSearchParams();

  const handleDownloadPDF = async () => {
    try {
      const html = `
        <html>
          <head>
            <meta charset="utf-8" />
            <title>Invoice Pembayaran</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; color: #111827; }
              h1 { text-align: center; color: #1E3A8A; }
              .card { background: #fff; padding: 20px; border-radius: 12px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
              .row { margin-bottom: 10px; }
              .label { color: #6B7280; font-size: 13px; }
              .value { font-weight: 600; font-size: 15px; }
              .separator { height: 1px; background: #E5E7EB; margin: 15px 0; }
              .total { text-align: right; margin-top: 10px; }
              .total-label { font-size: 15px; font-weight: bold; color: #1E3A8A; }
              .total-value { font-size: 18px; font-weight: bold; color: #1E3A8A; }
            </style>
          </head>
          <body>
            <h1>Invoice Pembayaran</h1>
            <div class="card">
              <div class="row">
                <span class="label">Nama Pemesan:</span><br/>
                <span class="value">${nama}</span>
              </div>
              <div class="row">
                <span class="label">Mobil:</span><br/>
                <span class="value">${name}</span>
              </div>
              <div class="row">
                <span class="label">Harga per Hari:</span><br/>
                <span class="value">Rp ${Number(price).toLocaleString("id-ID")}</span>
              </div>
              <div class="row">
                <span class="label">Durasi:</span><br/>
                <span class="value">${durasi} hari</span>
              </div>
              <div class="row">
                <span class="label">Tanggal Sewa:</span><br/>
                <span class="value">${tanggal}</span>
              </div>
              <div class="separator"></div>
              <div class="total">
                <span class="total-label">Total Pembayaran:</span><br/>
                <span class="total-value">Rp ${Number(total).toLocaleString("id-ID")}</span>
              </div>
            </div>
          </body>
        </html>
      `;

      const { uri } = await Print.printToFileAsync({ html });
      await Sharing.shareAsync(uri, {
        mimeType: "application/pdf",
        dialogTitle: "Bagikan atau Simpan Invoice",
        UTI: "com.adobe.pdf",
      });
    } catch (error) {
      Alert.alert("Gagal", "Terjadi kesalahan saat membuat PDF");
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>✅ Ringkasan Pemesanan</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Nama Pemesan:</Text>
        <Text style={styles.value}>{nama}</Text>

        <Text style={styles.label}>Mobil:</Text>
        <Text style={styles.value}>{name}</Text>

        <Text style={styles.label}>Harga per Hari:</Text>
        <Text style={styles.value}>Rp {Number(price).toLocaleString("id-ID")}</Text>

        <Text style={styles.label}>Durasi:</Text>
        <Text style={styles.value}>{durasi} hari</Text>

        <Text style={styles.label}>Tanggal Sewa:</Text>
        <Text style={styles.value}>{tanggal}</Text>

        <View style={styles.separator} />

        <Text style={styles.totalLabel}>Total Pembayaran:</Text>
        <Text style={styles.totalValue}>Rp {Number(total).toLocaleString("id-ID")}</Text>
      </View>

      <TouchableOpacity style={styles.downloadButton} onPress={handleDownloadPDF}>
        <Text style={styles.buttonText}>📄 Download Invoice (PDF)</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => router.replace("/")}>
        <Text style={styles.buttonText}>Kembali ke Beranda</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB", padding: 20, alignItems: "center" },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1E3A8A",
    marginBottom: 20,
    textAlign: "center",
  },
  card: {
    backgroundColor: "white",
    width: "100%",
    borderRadius: 12,
    padding: 20,
    elevation: 4,
    marginBottom: 20,
  },
  label: { color: "#6B7280", fontSize: 13, marginTop: 10 },
  value: { color: "#111827", fontSize: 15, fontWeight: "600" },
  separator: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 15,
  },
  totalLabel: { color: "#1E3A8A", fontWeight: "bold", fontSize: 15 },
  totalValue: { color: "#1E3A8A", fontSize: 18, fontWeight: "bold", marginTop: 5 },
  downloadButton: {
    backgroundColor: "#2563EB",
    paddingVertical: 12,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#1E3A8A",
    paddingVertical: 12,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
  },
  buttonText: { color: "white", fontWeight: "bold", fontSize: 16 },
});
