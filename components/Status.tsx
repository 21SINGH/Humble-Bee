import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet } from "react-native";
import NetInfo from "@react-native-community/netinfo";
import * as SQLite from "expo-sqlite";
import { useAppData } from "@/store/useAppData";

const Status: React.FC = () => {
  const [isOnline, setIsOnline] = useState(true);
   const db = SQLite.useSQLiteContext();
  const checkAndLog = useAppData((state) => state.checkAndLogUnsyncedChanges);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      const connected = state.isConnected ?? false;
      setIsOnline(connected);

      if (connected ) {
        checkAndLog(db);
      }
    });
    NetInfo.fetch().then((state) => {
      const connected = state.isConnected ?? false;
      setIsOnline(connected);
    });    

    return unsubscribe;
  }, []);

  return (
    <View
      style={[
        styles.container,
        {
          borderColor: isOnline ? "green" : "#8b0000",
          backgroundColor: isOnline ? "#d4edda" : "#f8d7da",
        },
      ]}
    >
      <View
        style={[styles.dot, { backgroundColor: isOnline ? "green" : "red" }]}
      />
      <Text style={[styles.text, { color: isOnline ? "green" : "red" }]}>
        {isOnline ? "Online" : "Offline"}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
    borderWidth: 0.5,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Status;
