import { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  LogBox,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import axios from "axios";
import { useRouter } from "expo-router";
import Animated, { FadeInDown } from "react-native-reanimated";

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
  index?: number;
};

export default function HomeScreen() {
  const [potterBooksList, setPotterBooksList] = useState([]);
  const router = useRouter();
  const harryPotterAPI = "https://potterapi-fedeperin.vercel.app/en";

  useEffect(() => {
    fetchAllBooks();

    LogBox.ignoreLogs([
      "VirtualizedLists should never be nested inside plain ScrollViews",
    ]);
  }, []);

  const fetchAllBooks = async () => {
    try {
      const potterBooksRes = await axios.get(harryPotterAPI + "/books");

      if (!potterBooksRes.status) {
        throw new Error(`HTTP error! status: ${potterBooksRes.status}`);
      }

      const books = await potterBooksRes.data;
      setPotterBooksList(books.reverse());
    } catch (error) {
      alert(error);
    }
  };

  const onBookPress = ({ item }: BooksProps) => {
    router.navigate(
      `/bookDetails?index=${item.index}&originalTitle=${item.originalTitle}`
    );
  };

  const renderBooks = ({ item, index = 1 }: BooksProps) => {
    const durationDelay = 1000 * index;

    return (
      <TouchableOpacity onPress={() => onBookPress({ item })}>
        <Animated.View
          entering={FadeInDown.duration(durationDelay)}
          style={styles.imageWrapper}
        >
          <View style={styles.imageDescription}>
            <Text style={styles.imageTitle}>{item.originalTitle}</Text>
            <Text style={styles.imageDates}>{item.releaseDate}</Text>
            <Text style={styles.imageTextDescription}>{item.description}</Text>
          </View>
          <Image source={{ uri: item.cover }} style={styles.imageSize} />
        </Animated.View>
      </TouchableOpacity>
    );
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={{
            uri: "https://th.bing.com/th/id/OIP.m9WbP61Otub75r6hAwKvZQAAAA?rs=1&pid=ImgDetMain",
          }}
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
    height: 600,
    width: 400,
    resizeMode: "cover",
    left: 0,
    position: "absolute",
  },
  imageWrapper: {
    flexDirection: "row",
    marginBottom: 20,
  },
  imageSize: {
    // width: "100%",
    // height: undefined,
    aspectRatio: 2 / 3,
    borderRadius: 10,
    // resizeMode: "stretch",
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
