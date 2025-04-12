import { useLocationDB } from "@/lib/locationDb";
import { useUserLocation } from "@/store/useUserLocation"; // Using Zustand store
import { router } from "expo-router";
import { useState, useEffect } from "react";
import { Alert, View, TextInput, Button, Text } from "react-native";

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
      Alert.alert("Invalid Input", "Latitude and longitude must be valid numbers.");
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
    <View style={{ padding: 20 }}>
      <Text>Latitude:</Text>
      <TextInput
        style={{ borderWidth: 1, marginBottom: 10 }}
        value={manualLat}
        onChangeText={setManualLat}
      />
      <Text>Longitude:</Text>
      <TextInput
        style={{ borderWidth: 1, marginBottom: 10 }}
        value={manualLon}
        onChangeText={setManualLon}
      />
      <Text>Place Name:</Text>
      <TextInput
        style={{ borderWidth: 1, marginBottom: 10 }}
        value={name}
        onChangeText={setName}
      />
      <Button title="Save Location" onPress={saveLocation} />
    </View>
  );
}
