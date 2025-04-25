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
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { Row } from "@/components/Row";

type BooksDetailsProps = {
  cover?: string;
  description?: string;
  index?: number;
  number?: number;
  originalTitle?: string;
  pages?: number;
  releaseDate?: string;
  title?: string;
};

const colorTheme = "#5d5e8c";

export default function BookDetails() {
  const [potterBookDetails, setPotterBookDetails] = useState<BooksDetailsProps>(
    {}
  );
  const [isBookmarked, setIsBookmarked] = useState(false);

  const { index, originalTitle } = useLocalSearchParams();
  const router = useRouter();

  const harryPotterAPI = "https://potterapi-fedeperin.vercel.app/en";

  useEffect(() => {
    fetchAllBooks();
    checkIfBookmarked();
  }, []);

  const fetchAllBooks = async () => {
    try {
      const potterBooksRes = await axios.get(
        harryPotterAPI + `/books?index=${index}`
      );

      if (!potterBooksRes.status) {
        throw new Error(`HTTP error! status: ${potterBooksRes.status}`);
      }

      const books = await potterBooksRes.data;
      setPotterBookDetails(books);
    } catch (error) {
      alert(error);
    }
  };

  const checkIfBookmarked = async () => {
    try {
      const stored = await AsyncStorage.getItem("bookmarks");
      if (stored) {
        const parsed = JSON.parse(stored);
        const found = parsed.find(
          (book: BooksDetailsProps) => book.index === index
        );
        setIsBookmarked(!!found);
      }
    } catch (err) {
      console.log("Error checking bookmark status:", err);
    }
  };

  const toggleBookmark = async () => {
    try {
      const stored = await AsyncStorage.getItem("bookmarks");
      const bookmarks = stored ? JSON.parse(stored) : [];

      if (isBookmarked) {
        const updated = bookmarks.filter(
          (book: BooksDetailsProps) => book.index !== index
        );
        await AsyncStorage.setItem("bookmarks", JSON.stringify(updated));
      } else {
        const newBookmark = {
          ...potterBookDetails,
          originalTitle,
          index,
        };
        const updated = [...bookmarks, newBookmark];
        await AsyncStorage.setItem("bookmarks", JSON.stringify(updated));
      }

      setIsBookmarked(!isBookmarked);
    } catch (err) {
      console.log("Error toggling bookmark:", err);
    }
  };

  const renderBooks = () => {
    return (
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
  };

  const renderHeader = () => {
    return (
      <Row style={styles.headerRow}>
        <Ionicons name="chevron-back" size={25} onPress={backButtonPress} />
        <Text style={styles.headerText}>{"Book Details"}</Text>
        <Ionicons name="cloud-upload-outline" size={25} />
      </Row>
    );
  };

  const renderStats = () => {
    return (
      <View style={styles.statParentWrapper}>
        <Image
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
  };

  const renderActionButton = () => {
    return (
      <TouchableOpacity
        style={styles.actionButtonWrapper}
        onPress={toggleBookmark}
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
    );
  };

  const backButtonPress = () => {
    router.back();
  };

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
