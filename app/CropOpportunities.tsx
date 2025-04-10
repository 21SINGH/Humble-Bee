import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TextInput, Button, Alert, FlatList } from "react-native";
import * as Location from "expo-location";
import { useSQLiteContext } from "expo-sqlite";
import { Crop } from "@/types";
import { haversineDistance } from "@/lib/location";
import { useUserLocation } from "@/store/useUserLocation";

export default function CropOpportunities() {
  const db = useSQLiteContext();
  const { location, setLocation } = useUserLocation();

  const [crops, setCrops] = useState<(Crop & { distance: number })[]>([]);
  const [loading, setLoading] = useState(true);
  const [manualLocation, setManualLocation] = useState("");
  const [locationDenied, setLocationDenied] = useState(false);

  useEffect(() => {
    (async () => {
      if (location) {
        await loadCrops(location.latitude, location.longitude);
        setLoading(false);
        return;
      }

      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          console.warn("Location permission not granted.");
          setLocationDenied(true);
          setLoading(false);
          return;
        }

        const loc = await Location.getCurrentPositionAsync({});
        const coords = {
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        };

        setLocation(coords);
        await loadCrops(coords.latitude, coords.longitude);
      } catch (error) {
        console.error("Error fetching location:", error);
        setLocationDenied(true);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const loadCrops = async (latitude: number, longitude: number) => {
    const today = new Date().toISOString().split("T")[0];
    const result = await db.getAllAsync<Crop>(
      `SELECT * FROM Crop WHERE date(flowering_end) >= date(?) ORDER BY flowering_start ASC`,
      [today]
    );

    const withDistance = result.map((crop) => ({
      ...crop,
      distance: haversineDistance(latitude, longitude, crop.latitude, crop.longitude),
    }));

    const nearby = withDistance.filter((c) => c.distance <= 100);
    setCrops(nearby);
  };

  const handleManualGeocode = async () => {
    try {
      const geo = await Location.geocodeAsync(manualLocation);
      if (geo.length === 0) throw new Error("No matching location found.");
      const coords = geo[0];
      setLocation({
        latitude: coords.latitude,
        longitude: coords.longitude,
        placeName: manualLocation,
      });
      await loadCrops(coords.latitude, coords.longitude);
    } catch (err) {
      console.error("Geocoding failed:", err);
      Alert.alert("Could not find location", "Please try a different place name.");
    }
  };

  if (loading) return <Text style={styles.center}>Loading crops...</Text>;

  if (locationDenied && !location) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Enter your location</Text>
        <TextInput
          style={styles.input}
          placeholder="City or village name"
          value={manualLocation}
          onChangeText={setManualLocation}
        />
        <Button title="Find Crops Near Me" onPress={handleManualGeocode} />
      </View>
    );
  }

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
          <Text>🌸 Flowering: {item.flowering_start} – {item.flowering_end}</Text>
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
    fontSize: 22,
    fontWeight: "bold",
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
