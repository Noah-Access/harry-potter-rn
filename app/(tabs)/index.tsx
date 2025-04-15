import { useEffect, useState } from "react";
import { Image, StyleSheet, Text } from "react-native";

import ParallaxScrollView from "@/components/ParallaxScrollView";

export default function HomeScreen() {
  const [potterBooksList, setPotterBooksList] = useState([]);
  const harryPotterAPI = "https://potterapi-fedeperin.vercel.app/en";

  useEffect(() => {
    fetchAllBooks();
  }, []);

  const fetchAllBooks = async () => {
    try {
      const potterBooksRes = await fetch(harryPotterAPI + "/books");

      if (!potterBooksRes.ok) {
        throw new Error(`HTTP error! status: ${potterBooksRes.status}`);
      }

      const books = await potterBooksRes.json();
      setPotterBooksList(books);
    } catch (error) {}
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
      <Text>{JSON.stringify(potterBooksList)}</Text>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
