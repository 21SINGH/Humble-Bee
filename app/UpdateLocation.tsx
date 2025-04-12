import Card from "@/components/ui/Card";
import { useLocationDB } from "@/lib/locationDb";
import { useUserLocation } from "@/store/useUserLocation";
import { router } from "expo-router";
import { useState, useEffect } from "react";
import { Alert, TextInput, Button, Text, StyleSheet } from "react-native";

export default function UpdateLocation() {
  const { location, setLocation } = useUserLocation();
  const [manualLat, setManualLat] = useState("");
  const [manualLon, setManualLon] = useState("");
  const [name, setName] = useState("");
  const { saveUserLocation, getUserLocation } = useLocationDB();

  useEffect(() => {
    if (location) {
      setManualLat(location.latitude.toString());
      setManualLon(location.longitude.toString());
      setName(location.placeName || "");
    }
  }, [location]);

  const saveLocation = async () => {
    if (!manualLat || !manualLon || !name) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    const latitude = parseFloat(manualLat);
    const longitude = parseFloat(manualLon);

    if (isNaN(latitude) || isNaN(longitude)) {
      Alert.alert(
        "Invalid Input",
        "Latitude and longitude must be valid numbers."
      );
      return;
    }

    setLocation({
      latitude: latitude,
      longitude: longitude,
      placeName: name,
    });

    // Save the location to the database
    await saveUserLocation(latitude, longitude, name);

    Alert.alert("Location Updated", "Your location has been saved.");

    // Navigate back to the previous screen and trigger re-render
    router.back();
  };

  return (
    <Card style={styles.container}>
       <Text style={styles.label}>Latitude:</Text>
      <TextInput
       style={styles.input}
        value={manualLat}
        onChangeText={setManualLat}
        keyboardType="numeric"
         placeholder="eg.. 17.45"
      />
      <Text style={styles.label}>Longitude:</Text>
      <TextInput
        style={styles.input}
        value={manualLon}
        onChangeText={setManualLon}
        keyboardType="numeric"
         placeholder="eg.. 78.475"
      />
      <Text style={styles.label}>Place Name:</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
         placeholder="eg.. Irrum Manzil, Hyderabad"
      />
      <Button title="Save Location" onPress={saveLocation} />
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 15,
    marginVertical: 30,
    marginHorizontal: 20,
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
});
