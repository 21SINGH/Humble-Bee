import React, { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import Card from "../components/ui/Card";
import * as Location from "expo-location";
import { useUserLocation } from "@/store/useUserLocation";

export default function Home() {
  const router = useRouter();
  const { location, setLocation } = useUserLocation();
  const [placeName, setPlaceName] = useState("");
  const [locationAllowed, setLocationAllowed] = useState(false);
  const [locLoading, setLocLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        setLocationAllowed(false);
        setLocLoading(false);
        return;
      }

      try {
        const loc = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = loc.coords;

        const places = await Location.reverseGeocodeAsync({
          latitude,
          longitude,
        });
        if (places.length > 0) {
          const place = places[0];
          const formatted = [
            place.name,
            place.city,
            place.region,
            place.country,
          ]
            .filter(Boolean)
            .join(", ");
          setPlaceName(formatted);
        }
        setLocation({
          latitude,
          longitude,
          placeName,
        });
        setLocationAllowed(true);
      } catch (error) {
        console.warn("Error getting location or reverse geocode:", error);
        setLocationAllowed(false);
      } finally {
        setLocLoading(false);
      }
    })();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
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

      {location && (
        <Card>
          <Text style={styles.cardText}>Location Details:</Text>
          <Text>Latitude: {location.latitude}</Text>
          <Text>Longitude: {location.longitude}</Text>
          <Text>Place Name: {placeName}</Text>
        </Card>
      )}
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
