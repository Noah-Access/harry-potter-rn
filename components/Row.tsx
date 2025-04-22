import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";

type RowProps = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function Row({ children, style }: RowProps) {
  return <View style={[styles.container, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
  },
});
