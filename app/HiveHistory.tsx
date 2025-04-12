import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Button, Alert, FlatList } from "react-native";
import { useSQLiteContext } from "expo-sqlite";
import { HiveLog } from "@/types";
import { useAppData } from "@/store/useAppData";

export default function HiveHistory() {
  const db = useSQLiteContext();
  const [logs, setLogs] = useState<HiveLog[]>([]);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    const result = await db.getAllAsync<HiveLog>(
      `SELECT * FROM HiveLog ORDER BY date_placed DESC`
    );
    setLogs(result);
  };

  const markReady = async (id: number) => {
    await db.runAsync(`UPDATE HiveLog SET is_ready = 1 WHERE id = ?`, id);
    await useAppData.getState().markUnsyncedAndMaybeSync(db);
    fetchLogs();
  };

  const deleteLog = (id: number) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this hive log?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await db.runAsync(`DELETE FROM HiveLog WHERE id = ?`, id);
            await useAppData.getState().markUnsyncedAndMaybeSync(db);
            fetchLogs();
          },
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: HiveLog }) => (
    <View style={styles.card}>
      <Text style={styles.bold}>Hive ID:</Text>
      <Text>{item.hive_id}</Text>
      <Text>Date: {item.date_placed}</Text>
      <Text>
        Location: {item.latitude}, {item.longitude}
      </Text>
      <Text>Colonies: {item.num_colonies}</Text>
      <Text>Status: {item.is_ready ? "Ready to Migrate" : "Not Ready"}</Text>

      {!item.is_ready && (
        <Button title="Mark as Ready" onPress={() => markReady(item.id)} />
      )}
      <Button color="red" title="Delete" onPress={() => deleteLog(item.id)} />
    </View>
  );

  return (
    <FlatList
      contentContainerStyle={styles.container}
      data={logs}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderItem}
      ListEmptyComponent={<Text>No hive logs found.</Text>}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 10,
  },
  card: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 15,
    backgroundColor: "#f9f9f9",
    marginBottom: 15,
    gap: 10,
  },
  bold: {
    fontWeight: "bold",
  },
});
