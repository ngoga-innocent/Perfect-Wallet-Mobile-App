// app/update-required.tsx

import React from "react";
import { View, Text, Pressable, Linking, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Download } from "lucide-react-native";
import { useLocalSearchParams } from "expo-router";

export default function UpdateRequiredScreen() {
  const params = useLocalSearchParams<{
    current?: string;
    latest?: string;
    url?: string;
  }>();

  const handleUpdate = async () => {
    if (!params.url) return;

    try {
      await Linking.openURL(params.url);
    } catch (error) {
      console.error("Failed to open Play Store:", error);
    }
  };

  return (
    <LinearGradient
      colors={["#eef8ff", "#ffffff", "#effcf5"]}
      style={styles.container}
    >
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Download size={42} color="#087f5b" />
        </View>

        <Text style={styles.title}>Update Required</Text>

        <Text style={styles.description}>
          A newer version of PWallet is required to continue. Please update the
          app to continue using all features.
        </Text>

        <View style={styles.versionCard}>
          <View>
            <Text style={styles.label}>Current version</Text>

            <Text style={styles.version}>{params.current ?? "-"}</Text>
          </View>

          <View>
            <Text style={styles.label}>Latest version</Text>

            <Text style={styles.version}>{params.latest ?? "-"}</Text>
          </View>
        </View>

        <Pressable
          onPress={handleUpdate}
          style={({ pressed }) => [styles.button, pressed && { opacity: 0.8 }]}
        >
          <Download size={20} color="#fff" />

          <Text style={styles.buttonText}>Update PWallet</Text>
        </Pressable>

        <Text style={styles.footer}>
          Please keep PWallet updated for the latest improvements and security
          updates.
        </Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 28,
  },

  iconContainer: {
    width: 88,
    height: 88,
    borderRadius: 28,
    backgroundColor: "#dff7ec",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },

  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#082f49",
    textAlign: "center",
    marginBottom: 12,
  },

  description: {
    fontSize: 16,
    lineHeight: 24,
    color: "#64748b",
    textAlign: "center",
    maxWidth: 380,
    marginBottom: 28,
  },

  versionCard: {
    width: "100%",
    maxWidth: 390,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    marginBottom: 28,
  },

  label: {
    fontSize: 12,
    color: "#94a3b8",
    marginBottom: 5,
  },

  version: {
    fontSize: 17,
    fontWeight: "700",
    color: "#0f172a",
  },

  button: {
    width: "100%",
    maxWidth: 390,
    height: 56,
    borderRadius: 17,
    backgroundColor: "#087f5b",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
  },

  footer: {
    marginTop: 28,
    color: "#94a3b8",
    fontSize: 12,
    textAlign: "center",
    maxWidth: 350,
  },
});
