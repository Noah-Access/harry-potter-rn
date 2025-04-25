import { useState, useCallback } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  Dimensions,
  SafeAreaView,
} from "react-native";
import { useRouter } from "expo-router";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useFocusEffect } from "@react-navigation/native";

import { useBookmarks } from "@/hooks/useBookmarks";

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

const numColumns = 3;
const screenWidth = Dimensions.get("window").width;
const horizontalPadding = 10 * 2;
const itemSpacing = 10;
const itemSize =
  (screenWidth - horizontalPadding - itemSpacing * (numColumns - 1)) /
  numColumns;

export default function SavedBooks() {
  const { bookmarks, reload } = useBookmarks();
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      reload();
    }, [])
  );

  const onBookPress = ({ item }: BooksProps) => {
    router.navigate(
      `/bookDetails?index=${item.index}&originalTitle=${item.originalTitle}`
    );
  };

  const renderBooks = ({ item, index = 1 }: BooksProps) => {
    const durationDelay = 100 * index;

    return (
      <TouchableOpacity onPress={() => onBookPress({ item })}>
        <Animated.View entering={FadeInDown.delay(durationDelay).springify()}>
          <View style={styles.itemContainer}>
            <Image
              source={{ uri: item.cover }}
              style={styles.image}
              resizeMode="cover"
            />
          </View>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={bookmarks}
        renderItem={renderBooks}
        numColumns={numColumns}
        keyExtractor={(item) => item.index.toString()}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  listContainer: {
    padding: 10,
    alignItems: "flex-start",
  },
  itemContainer: {
    width: itemSize,
    aspectRatio: 2 / 3,
    margin: 5,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#f0f0f0",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
});
