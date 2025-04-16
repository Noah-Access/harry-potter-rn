import { useEffect, useState } from "react";
import { FlatList, Image, StyleSheet, Text, View } from "react-native";

import ParallaxScrollView from "@/components/ParallaxScrollView";

type BooksProps = {
  item: {
    cover: string;
    description: string;
    index: number;
    number: number;
    originalTitle: string;
    pages: number;
    releaseDate: string;
    title: string;
  };
};

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
      setPotterBooksList(books.reverse());
    } catch (error) {}
  };

  const renderBooks = ({ item }: BooksProps) => {
    return (
      <View style={styles.imageWrapper}>
        <View style={styles.imageDescription}>
          <Text style={styles.imageTitle}>{item.originalTitle}</Text>
          <Text style={styles.imageDates}>{item.releaseDate}</Text>
          <Text style={styles.imageTextDescription}>{item.description}</Text>
        </View>
        <Image source={{ uri: item.cover }} style={styles.imageSize} />
      </View>
    );
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
      <FlatList data={potterBooksList} renderItem={renderBooks} />
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
  imageWrapper: {
    flexDirection: "row",
    marginBottom: 10,
  },
  imageSize: {
    width: 200,
    height: 300,
    borderRadius: 10,
    resizeMode: "stretch",
    flex: 1,
  },
  imageDescription: {
    flex: 1,
    paddingRight: 10,
  },
  imageTitle: {
    fontSize: 15,
  },
  imageDates: {
    fontSize: 12,
  },
  imageTextDescription: {
    paddingTop: 5,
    fontSize: 10,
  },
});
