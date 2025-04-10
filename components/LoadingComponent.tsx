import { View, Text, ActivityIndicator } from "react-native";
import React from "react";

const LoadingComponent = () => {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center"}}>
      <ActivityIndicator size={"large"} />
      <Text>Loading db...</Text>
    </View>
  );
};

export default LoadingComponent;
