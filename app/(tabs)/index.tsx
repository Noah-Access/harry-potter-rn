import { useState } from "react";
import { Image, StyleSheet, Button, Text, View } from "react-native";

import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

export default function HomeScreen() {
  const [counter, setCounter] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const incrementCounterHandler = () => {
    setCounter((prev) => prev + 1);
  };

  const decrementCounterHandler = () => {
    setCounter((prev) => prev - 1);
  };

  const toggleCounterWrapperVisible = () => {
    setIsVisible(!isVisible);
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={require("@/assets/images/partial-react-logo.png")}
          style={styles.reactLogo}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome Access</ThemedText>
        <HelloWave />
      </ThemedView>
      {isVisible ? (
        <View style={styles.counterWrapper}>
          <Text style={styles.counterText}>{counter}</Text>
          <View style={styles.actionsWrapper}>
            <Button title="Increment" onPress={incrementCounterHandler} />
            <Button title="Decrement" onPress={decrementCounterHandler} />
          </View>
        </View>
      ) : null}
      <Button
        title={isVisible ? "Hide" : "Show"}
        onPress={toggleCounterWrapperVisible}
      />
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
  counterWrapper: {
    borderWidth: 0.3,
    borderRadius: 20,
    padding: 10,
  },
  actionsWrapper: {
    flexDirection: "row",
    alignSelf: "center",
    marginTop: 10,
  },
  counterText: {
    fontWeight: "400",
    textAlign: "center",
    fontSize: 20,
  },
});
