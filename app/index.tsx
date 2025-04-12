import React, { useEffect, useState } from "react";
import { ScrollView, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import Card from "../components/ui/Card";
import * as Location from "expo-location";
import { useUserLocation } from "@/store/useUserLocation";
import { useLocationDB } from "@/lib/locationDb"; // or wherever you save it

export default function Home() {
  const router = useRouter();
  const { location, setLocation } = useUserLocation();
  const [locationAllowed, setLocationAllowed] = useState(false);
  const { saveUserLocation, getUserLocation } = useLocationDB();

  useEffect(() => {
    (async () => {
      const storedLoc = await getUserLocation();
      if (storedLoc) {
        setLocation(storedLoc);
      }

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setLocationAllowed(false);
        return;
      }

      try {
        const loc = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = loc.coords;

        const places = await Location.reverseGeocodeAsync({
          latitude,
          longitude,
        });
        const name = places.length
          ? [
              places[0].name,
              places[0].city,
              places[0].region,
              places[0].country,
            ]
              .filter(Boolean)
              .join(", ")
          : "Unknown Location";

        const finalLoc = { latitude, longitude, placeName: name };
        setLocation(finalLoc);
        await saveUserLocation(latitude, longitude, name);
      } catch (error) {
        console.warn("Error getting location:", error);
      }
    })();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {location && (
        <TouchableOpacity onPress={() => router.push("/UpdateLocation")}>
          <Card>
            <Text style={styles.cardText}>Location Details:</Text>
            <Text>Latitude: {location.latitude}</Text>
            <Text>Longitude: {location.longitude}</Text>
            <Text>Place Name: {location.placeName}</Text>
          </Card>
        </TouchableOpacity>
      )}
      {!locationAllowed && !location && (
        <TouchableOpacity onPress={() => router.push("/UpdateLocation")}>
          <Card>
            <Text style={styles.cardText}>Enter Location</Text>
          </Card>
        </TouchableOpacity>
      )}

      <TouchableOpacity onPress={() => router.push("/HiveLogger")}>
        <Card>
          <Text style={styles.cardText}>Hive Logger</Text>
        </Card>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/CropOpportunities")}>
        <Card>
          <Text style={styles.cardText}>Crop Opportunities</Text>
        </Card>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/HiveHistory")}>
        <Card>
          <Text style={styles.cardText}>Hive History</Text>
        </Card>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 20,
  },
  cardText: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
