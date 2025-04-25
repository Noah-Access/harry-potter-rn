import { useEffect, useState, useCallback } from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import axios from "axios";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";

import { Row } from "@/components/Row";
import { useBookmarks, Book } from "@/hooks/useBookmarks";

const colorTheme = "#5d5e8c";

export default function BookDetails() {
  const [potterBookDetails, setPotterBookDetails] = useState<Book>({} as Book);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const { index, originalTitle } = useLocalSearchParams();
  const router = useRouter();

  const { bookmarks, toggleBookmark, loading } = useBookmarks();

  const harryPotterAPI = "https://potterapi-fedeperin.vercel.app/en";

  useEffect(() => {
    fetchBookDetails();
  }, []);

  useEffect(() => {
    if (!loading && bookmarks.length > 0) {
      const found = bookmarks.some(
        (book) => String(book.index) === String(index)
      );
      setIsBookmarked(found);
    }
  }, [bookmarks, loading, index]);

  const fetchBookDetails = async () => {
    try {
      const res = await axios.get(`${harryPotterAPI}/books?index=${index}`);
      if (res.status !== 200) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const bookData = res.data;
      setPotterBookDetails({
        ...bookData,
        index: Number(index),
        originalTitle: originalTitle as string,
      });
    } catch (error) {
      alert("Failed to fetch book details");
      console.error(error);
    }
  };

  const handleToggleBookmark = () => {
    toggleBookmark({
      ...potterBookDetails,
      index: Number(index),
      originalTitle: originalTitle as string,
    });
    setIsBookmarked((prev) => !prev);
  };

  const backButtonPress = () => {
    router.back();
  };

  const renderHeader = () => (
    <Row style={styles.headerRow}>
      <Ionicons name="chevron-back" size={25} onPress={backButtonPress} />
      <Text style={styles.headerText}>{"Book Details"}</Text>
      <Ionicons name="cloud-upload-outline" size={25} />
    </Row>
  );

  const renderStats = () => (
    <View style={styles.statParentWrapper}>
      <Animated.Image
        entering={FadeInDown.delay(300).springify()}
        source={{ uri: potterBookDetails.cover }}
        style={styles.imageSize}
      />
      <View>
        <View style={styles.statChildWrapper}>
          <Ionicons name="star-outline" size={25} color={colorTheme} />
          <View style={styles.ratingWrapper}>
            <Text style={styles.ratingText}>{"Rating"}</Text>
            <Text style={styles.ratingText}>{"7/10"}</Text>
          </View>
        </View>
        <View style={styles.statChildWrapper}>
          <Ionicons name="alarm-outline" size={25} color={colorTheme} />
          <View style={styles.ratingWrapper}>
            <Text style={styles.ratingText}>{"Duration"}</Text>
            <Text style={styles.ratingText}>{"30mins"}</Text>
          </View>
        </View>
        <View style={styles.statChildWrapper}>
          <Ionicons name="warning-outline" size={25} color={colorTheme} />
          <View style={styles.ratingWrapper}>
            <Text style={styles.ratingText}>{"Age Limit"}</Text>
            <Text style={styles.ratingText}>{"21"}</Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderBooks = () => (
    <View style={styles.imageWrapper}>
      <View style={styles.imageDescription}>
        <Text style={styles.imageTitle}>{originalTitle}</Text>
        <Text style={styles.imageDates}>{potterBookDetails.releaseDate}</Text>
        <Text style={styles.imageTextDescription}>
          {potterBookDetails.description}
        </Text>
        <Text style={styles.imageTextDescription}>
          {potterBookDetails.description}
        </Text>
        <Text style={styles.imageTextDescription}>
          {potterBookDetails.description}
        </Text>
      </View>
    </View>
  );

  const renderActionButton = () => (
    <Animated.View entering={FadeInDown.delay(200).springify()}>
      <TouchableOpacity
        style={styles.actionButtonWrapper}
        onPress={handleToggleBookmark}
      >
        <Ionicons
          name={isBookmarked ? "bookmark-sharp" : "bookmark-outline"}
          size={25}
          color={"white"}
        />
        <Text style={styles.actionTitle}>
          {isBookmarked ? "Bookmarked" : "Bookmark"}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        {renderHeader()}
        {renderStats()}
        {renderBooks()}
      </ScrollView>
      {renderActionButton()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    paddingHorizontal: 15,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  headerText: {
    fontSize: 19,
    paddingLeft: 10,
    fontWeight: "500",
  },
  statParentWrapper: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
  },
  statChildWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 0.3,
    justifyContent: "space-between",
    borderRadius: 10,
    paddingHorizontal: 30,
    paddingVertical: 20,
    marginBottom: 20,
  },
  imageWrapper: {
    flexDirection: "row",
    marginBottom: 10,
  },
  imageSize: {
    width: 200,
    height: 270,
    borderRadius: 10,
    resizeMode: "stretch",
  },
  imageDescription: {
    flex: 1,
    paddingRight: 10,
  },
  imageTitle: {
    fontSize: 25,
    textAlign: "center",
  },
  imageDates: {
    fontSize: 12,
  },
  imageTextDescription: {
    paddingTop: 15,
    lineHeight: 25,
    fontSize: 12,
  },
  ratingWrapper: {
    marginLeft: 10,
  },
  ratingText: {
    textAlign: "center",
  },
  actionButtonWrapper: {
    borderRadius: 50,
    paddingVertical: 10,
    backgroundColor: colorTheme,
    marginHorizontal: 15,
    marginTop: 5,
    flexDirection: "row",
    justifyContent: "center",
  },
  actionTitle: {
    fontSize: 22,
    textAlign: "center",
    color: "white",
    marginLeft: 5,
  },
});
