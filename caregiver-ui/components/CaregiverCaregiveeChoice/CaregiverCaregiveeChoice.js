import * as React from "react";
import { Button, Text } from "react-native-elements";
import { View, StyleSheet, ActivityIndicator, SafeAreaView, Image } from "react-native";
import AuthenticationNavigator from "./AuthenticationNavigator";
import { TouchableOpacity } from "react-native-gesture-handler";

const CaregiverCaregiveeChoice = (props) => {
  console.log(props);
  const CAREGIVER_TITLE = "Caregiver Login";
  const PARENT_TITLE = "Parent Login";
  const CAREGIVEE_TITLE = "Caregivee Login";
  const navigation = props["navigation"];
  const {logoutFunction} = props;
  return (
    <View style={styles.contentView}>
      <Image
        source={require("./caregiver_logo.svg")}
        style={styles.item}
        resizeMode={"contain"}
        PlaceholderContent={<ActivityIndicator />}>
      </Image>
      <Text style={styles.title}>C A R E G I V E R</Text>
      <TouchableOpacity
        style={styles.loginButton}
        onPress={() =>
          navigation.navigate("AuthenticationWrapper", { isCaregiver: false, isParent: false, logoutFunction: logoutFunction })
        }
      >
        <Text style={styles.buttonText}>{CAREGIVEE_TITLE}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.loginButton}
        onPress={() =>
          navigation.navigate("AuthenticationWrapper", { isCaregiver: true, isParent: false, logoutFunction: logoutFunction })
        }
      >
        <Text style={styles.buttonText}>{CAREGIVER_TITLE}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.loginButton}
        onPress={() =>
          navigation.navigate("AuthenticationWrapper", { isCaregiver: true , isParent: true, logoutFunction: logoutFunction })
        }
      >
        <Text style={styles.buttonText}>{PARENT_TITLE}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  choiceButtonSelection: {
    width: "50%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    color: "#2188da",
    fontSize: 40,
    fontWeight: "bold",
    marginBottom: 20
  },
  item: {
    width: "100%",
    height: "30%",
    alignSelf: "center",
    marginBottom: -50,
    marginTop: -50
  },
  contentView: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },
  loginButton: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    marginTop: 20,
    marginBottom: 20,
    fontSize: 50,
    backgroundColor: "#2188da",
    padding: 20,
    borderRadius: 50
  },
  buttonText: {
    color: "white",
    fontSize: 25,
    fontWeight: "bold"
  }
});

export default CaregiverCaregiveeChoice;
