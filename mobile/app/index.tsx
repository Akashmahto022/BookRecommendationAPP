import { StyleSheet, Text, View } from "react-native";

export default function Index() {
  return (
    <View
      style={styles.container}
    >
      <Text style={styles.title}>Hello This App is building by Akash Mahto</Text>
      <Text style={styles.title}>Hi There</Text>

    </View>
  );
}

const styles = StyleSheet.create({
  container : {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    color: "red",
    backgroundColor: "black",
    padding: "auto"
  }
})
