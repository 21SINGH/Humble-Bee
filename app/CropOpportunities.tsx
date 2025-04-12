import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  FlatList,
} from "react-native";
import { useSQLiteContext } from "expo-sqlite";
import { Crop } from "@/types";
import { haversineDistance } from "@/lib/location";
import { useUserLocation } from "@/store/useUserLocation";
import { router } from "expo-router";

export default function CropOpportunities() {
  const db = useSQLiteContext();
  const { location } = useUserLocation();

  const [crops, setCrops] = useState<(Crop & { distance: number })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!location) {
      Alert.alert("Location Not Set", "Please update your location manually.", [
        {
          text: "OK",
          onPress: () => router.push("/UpdateLocation"),
        },
      ]);
    }
  }, [location]);

  useEffect(() => {
    (async () => {
      if (location) {
        await loadCrops(location.latitude, location.longitude);
        setLoading(false);
        return;
      }
    })();
  }, [location]);

  const loadCrops = async (latitude: number, longitude: number) => {
    const today = new Date().toISOString().split("T")[0];
    const result = await db.getAllAsync<Crop>(
      `SELECT * FROM Crop WHERE date(flowering_end) >= date(?) ORDER BY flowering_start ASC`,
      [today]
    );

    const withDistance = result.map((crop) => ({
      ...crop,
      distance: haversineDistance(
        latitude,
        longitude,
        crop.latitude,
        crop.longitude
      ),
    }));

    const nearby = withDistance.filter((c) => c.distance <= 100);
    setCrops(nearby);
  };

  if (loading) return <Text style={styles.center}>Loading crops...</Text>;

  if (crops.length === 0) {
    return <Text style={styles.center}>No crops in range right now 🌱</Text>;
  }

  return (
    <FlatList
      contentContainerStyle={styles.container}
      data={crops}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text style={styles.name}>{item.name}</Text>
          <Text>
            🌸 Flowering: {item.flowering_start} – {item.flowering_end}
          </Text>
          <Text>📍 Distance: {item.distance.toFixed(2)} km</Text>
          <Text>🐝 Hive Density: {item.recommended_density} colonies/ha</Text>
        </View>
      )}
      ListEmptyComponent={<Text>No crop opportunities found nearby.</Text>}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 15,
  },
  center: {
    flex: 1,
    textAlign: "center",
    marginTop: 100,
    fontSize: 18,
  },
  title: {
    fontSize: 18,
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  card: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 15,
    backgroundColor: "#f0f9f5",
    gap: 5,
    marginBottom: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
  },
});
