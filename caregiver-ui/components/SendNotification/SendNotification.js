import * as React from "react";
import { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  Alert,
  ToastAndroid,
} from "react-native";
import { ListItem, Icon, Button, Avatar } from "react-native-elements";

import { useNavigation } from "@react-navigation/native";
import CaregiveeCheckboxItem from "./CaregiveeCheckboxItem";
import { createNotification } from "../Server/BackendNotification";

const SendNotification = (props) => {
  const navigation = useNavigation();
  const [selectedTask, setSelectedTask] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const { caregivees } = props;
  const { user } = props;
  const { accessToken } = props;
  const { updateNotificationsHandler } = props;
  const [selectedCaregivees, setSelectedCaregivees] = useState([]);
  const styles = StyleSheet.create({
    timeAgo: {
      fontSize: 12,
    },
    notificationHeader: {
      fontSize: 18,
      marginLeft: 10,
    },
    icon: {
      marginRight: 5,
    },
  });

  const checkCaregivee = (id) => {
    let checked = selectedCaregivees.filter((c) => c.id == id);
    return checked.length > 0;
  };

  const addCaregivee = (caregivee) => {
    let newCaregivees = selectedCaregivees;
    newCaregivees.push(caregivee);
    setSelectedCaregivees(newCaregivees);
  };

  const removeCaregivee = (caregivee) => {
    let newCaregivees = selectedCaregivees;
    let indexToRemove = newCaregivees.indexOf(caregivee);
    newCaregivees.splice(indexToRemove, 1);
    setSelectedCaregivees(newCaregivees);
  };

  const changeCaregivee = (item) => {
    let checked = checkCaregivee(item.id);
    if (!checked) {
      addCaregivee(item);
    } else {
      removeCaregivee(item);
    }
    return !checked;
  };

  const createAndPushNotification = (caregivee) => {
    let newNotification = {
      task: selectedTask,
      sentTo: caregivee,
      dateSent: new Date(),
      created_by: user,
    };
    console.log("Create Notifications");
    return createNotification(newNotification, accessToken).then((isSuccess) => {
      if (isSuccess){
        ToastAndroid.show("Successfully Sent to All Caregivees Selected", ToastAndroid.LONG);
      } else {
        ToastAndroid.show("Issue Sending to All Listed Caregivees. Please Try Again Later", ToastAndroid.LONG);
      }
    });
  };

  const reset = () => {
    setSelectedTask(null);
    setSelectedCaregivees([]);
    navigation.navigate("Dashboard");
  };

  const pushNotifications = () => {
    let promises = [];
    if (selectedTask) {
      if (selectedCaregivees.length > 0) {
        selectedCaregivees.forEach((caregivee) =>
          promises.push(createAndPushNotification(caregivee))
        );
        Alert.alert(
          "Notification Sent",
          "The notification sent successfully!",
          [{ text: "Return to Dashboard", onPress: () => reset() }]
        );
      } else {
        Alert.alert("No Caregivee Selected", "Please Select a Caregivee", [
          { text: "OK" },
        ]);
      }
    } else {
      Alert.alert("No Task Selected", "Please Select a Task", [{ text: "OK" }]);
    }

    return promises;
  };

  return (
    <View style={{ flex: 1 }}>
      <Text style={styles.notificationHeader}>Select Task</Text>
      <ListItem
        bottomDivider
        onPress={() =>
          navigation.navigate("Select Task", {
            onGoBack: (item, url) => {
              setSelectedTask(item);
              console.log(url);
              setImageUrl(url);
            }
          })
        }
      >
        <Avatar source={{uri: imageUrl}} imageProps={{ resizeMode: "contain"}}/>
        <ListItem.Content>
          <ListItem.Title>
            {selectedTask ? selectedTask.name : "Select Task"}
          </ListItem.Title>
        </ListItem.Content>
        <ListItem.Chevron />
      </ListItem>
      <Text style={styles.notificationHeader}>Push Notification To</Text>
      <FlatList
        data={caregivees}
        renderItem={({ item }) => (
          <CaregiveeCheckboxItem
            item={item}
            changeCaregivee={(item) => changeCaregivee(item)}
            checkCaregivee={(item) => checkCaregivee(item)}
          />
        )}
        keyExtractor={(item) => item.id}
      />
      <Button
        icon={<Icon name="send" size={20} color="white" style={styles.icon} />}
        title="Send Notification"
        onPress={() => {
          Promise.all(pushNotifications()).then(() => {
            updateNotificationsHandler();
          });
        }}
      />
    </View>
  );
};

export default SendNotification;
