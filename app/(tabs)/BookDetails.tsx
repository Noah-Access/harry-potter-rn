import { useEffect, useState } from "react";
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

  const { index, originalTitle } = useLocalSearchParams();
  const router = useRouter();

  const harryPotterAPI = "https://potterapi-fedeperin.vercel.app/en";

  useEffect(() => {
    fetchAllBooks();
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
      <TouchableOpacity style={styles.actionButtonWrapper}>
        <Ionicons name="bookmark-outline" size={25} color={"white"} />
        <Text style={styles.actionTitle}>{"Bookmark"}</Text>
      </TouchableOpacity>
    );
  };

  const backButtonPress = () => {
    router.back();
  };

  return (
    <SafeAreaView>
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
    borderWidth: 0.3,
    borderRadius: 50,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: colorTheme,
    marginHorizontal: 10,
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
