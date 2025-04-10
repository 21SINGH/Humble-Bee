import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { useSQLiteContext } from "expo-sqlite";
import { useRouter } from "expo-router";
import { useUserLocation } from "@/store/useUserLocation";
import Card from "@/components/ui/Card";

export default function HiveLogger() {
  const db = useSQLiteContext();
  const router = useRouter();
  const { location } = useUserLocation();

  const [hiveId, setHiveId] = useState("");
  const [datePlaced, setDatePlaced] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [colonies, setColonies] = useState("");
  const [manualLat, setManualLat] = useState("");
  const [manualLng, setManualLng] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    const lat = location?.latitude || parseFloat(manualLat);
    const lng = location?.longitude || parseFloat(manualLng);

    if (!hiveId || !datePlaced || !colonies || isNaN(lat) || isNaN(lng)) {
      Alert.alert("Please fill out all fields and provide location.");
      return;
    }

    setLoading(true);

    const existing = await db.getFirstAsync<{ count: number }>(
      `SELECT COUNT(*) as count FROM HiveLog WHERE hive_id = ?`,
      hiveId
    );

    if (existing.count > 0) {
      Alert.alert("A hive with this ID already exists.");
      setLoading(false);
      return;
    }

    try {
      await db.runAsync(
        `INSERT INTO HiveLog (hive_id, date_placed, latitude, longitude, num_colonies, is_ready, photo_uri)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        hiveId,
        datePlaced,
        lat,
        lng,
        Number(colonies),
        0,
        null
      );

      Alert.alert("Hive log saved!");
      router.back();
    } catch (err) {
      console.error("Failed to save hive log:", err);
      Alert.alert("Something went wrong while saving.");
    } finally {
      setLoading(false);
    }
  };

  const handleHiveIdChange = (text: string) => {
    const numericPart = text.replace(/[^0-9]/g, ""); // remove non-numeric
    setHiveId(`HIVE${numericPart}`);
  };

  return (
    <Card style={styles.container}>
      <Text style={styles.label}>Hive ID</Text>
      <TextInput
        style={styles.input}
        value={hiveId}
        onChangeText={handleHiveIdChange}
        keyboardType="numeric"
        placeholder="eg.. HIVE001"
      />

      <Text style={styles.label}>Date Placed</Text>
      <TextInput
        style={styles.input}
        value={datePlaced}
        onChangeText={setDatePlaced}
        placeholder="YYYY-MM-DD"
      />

      <Text style={styles.label}>Number of Colonies</Text>
      <TextInput
        style={styles.input}
        value={colonies}
        onChangeText={setColonies}
        keyboardType="numeric"
        placeholder="5"
      />

      <Text style={styles.label}>Location</Text>
      {location ? (
        <Text style={styles.locationText}>
          📍{" "}
          {location.placeName ||
            `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`}
        </Text>
      ) : (
        <View>
          <TextInput
            style={styles.input}
            placeholder="Latitude"
            value={manualLat}
            onChangeText={setManualLat}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Longitude"
            value={manualLng}
            onChangeText={setManualLng}
            keyboardType="numeric"
          />
        </View>
      )}

      <Button
        title={loading ? "Saving..." : "Save Hive Log"}
        onPress={handleSave}
        disabled={loading}
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 15,
    marginVertical:30,
    marginHorizontal:20
  },
  label: {
    fontWeight: "bold",
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  locationText: {
    padding: 10,
    fontStyle: "italic",
  },
});
