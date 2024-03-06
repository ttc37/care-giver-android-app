import * as React from "react";
import { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  Image,
  TouchableHighlight,
} from "react-native";
import { ListItem, Icon, Avatar } from "react-native-elements";
import { Button } from "react-native-elements";
import { Stopwatch } from "react-native-stopwatch-timer";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { updateNotification } from "../Server/BackendNotification";
import { Video, AVPlaybackStatus, Audio } from "expo-av";

const NotificationPrimary = ({ route }) => {
  console.log("NotificationPrimary : ", route)
  const navigation = useNavigation();
  const [notificationState, setNotificationState] = useState({});
  const [isStopwatchStart, setIsStopwatchStart] = useState(false);
  const [resetStopwatch, setResetStopwatch] = useState(false);
  const [statusVideo, setStatus] = useState(false);
  const [sound, setSound] = useState();
  const isFocused = useIsFocused();
  const updateNotificationsHandler = route.params.updateNotificationsHandler;
  const accessToken = route.params.accessToken;
  //TODO: Add description to getnotificationscaregivee, then can add description to notification display
  useEffect(() => {
    startTask();
  }, [route.params.notification]);

  useEffect(() => {}, []);

  const startTask = () => {
    let newNotif = {
      id: route.params.notification.id,
      name: route.params.notification.name,
      icon: route.params.notification.icon,
      video: route.params.notification.video,
      sound: route.params.notification.sound,
      imageReward: route.params.notification.image_reward,
      videoReward: route.params.notification.video_reward,
      soundReward: route.params.notification.sound_reward,
      description: route.params.notification.description,
      dateSent: route.params.notification.dateSent,
      dateStarted: new Date(),
      dateCompleted: route.params.notification.dateCompleted,
    };
    setNotificationState(newNotif);
    setIsStopwatchStart(true);
    if (route.params.notification.sound) {
      console.log("Sound: " + JSON.stringify(route.params.notification.sound));
      Audio.Sound.createAsync({ uri: route.params.notification.sound }, true)
        .then((result) => {
          console.log(result);
          setSound(result);
          //play sound on task start
          result.sound.replayAsync();
        })
        .catch((err) => {
          console.log(err);
        });
    }
    console.log("Task Started!");
  };

  const finishTask = () => {
    let newNotif = {
      id: notificationState.id,
      name: notificationState.name,
      icon: notificationState.icon,
      video: notificationState.video,
      description: notificationState.description,
      dateSent: notificationState.dateSent,
      dateStarted: notificationState.dateStarted,
      dateCompleted: new Date(),
    };
    const notificationTranslation = notificationDateParse(newNotif);
    setIsStopwatchStart(false);
    updateNotification(notificationTranslation, accessToken)
      .then(() =>{
        console.log("Updated")
        updateNotificationsHandler().then(() => {
          console.log("Task Finished!");
          navigation.navigate("Notification Reward", {
            notification: notificationState,
          });
        })
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const SelectImageElement = (itemName) => {
    itemName = itemName.itemName;

    if (itemName === "image") {
      //return <Icon name={itemName} size={75} />;
      return null;
    } else {
      return (
        <View style={styles.itemContainer}>
          <TouchableHighlight onPress={() => sound.sound.replayAsync()}>
            <Image
              style={styles.item}
              resizeMode={"contain"}
              source={{ uri: itemName }}
            />
          </TouchableHighlight>
        </View>
      );
    }
  };
  const VideoPlayback = (notificationVideo) => {
    console.log(JSON.stringify(notificationVideo));
    notificationVideo = notificationVideo.notificationVideo;
    if (notificationVideo != null && isStopwatchStart) {
      return (
        <View style={styles.videoContainer}>
          <Video
            style={styles.video}
            source={{
              uri: notificationVideo,
            }}
            useNativeControls
            resizeMode="contain"
          />
        </View>
      );
    }
    return null;
  };

  const options = {
    text: {
      fontSize: 50,
      color: "#2188da",
      marginLeft: 7,
      textAlign: "center",
      fontWeight: "bold",
    },
  };

  return (
    <View style={{ flex: 1, alignContent: "center" }}>
      <SelectImageElement itemName={notificationState.icon} />
      <Text style={styles.text}>{notificationState.name}</Text>
      <Text style={styles.description}>{notificationState.description}</Text>
      <VideoPlayback notificationVideo={notificationState.video} />
      <Stopwatch
        titleStyle={styles.stopwatch}
        laps
        start={isStopwatchStart}
        // To start
        reset={resetStopwatch}
        // To reset
        options={options}
        // Options for the styling
        getTime={(time) => {}}
      />
      <View>
        {notificationState.dateStarted ? (
          <Button
            title="Finish Task"
            onPress={() => finishTask()}
            icon={{
              name: "checkcircle",
              type: "antdesign",
              size: 35,
              color: "white",
            }}
            buttonStyle={{
              backgroundColor: "rgba(27, 181, 91, 1)",
              borderRadius: 15,
              height: 100,
              alignSelf: "center",
              width: "80%",
            }}
            titleStyle={{
              fontSize: 25,
              fontWeight: "bold",
              marginLeft: 5,
              alignSelf: "center",
            }}
            containerStyle={{
              marginHorizontal: 50,
              height: 150,
              width: 325,
              marginVertical: 10,
              alignSelf: "center",
              width: "100%",
            }}
          />
        ) : (
          <Button
            title="Start Task"
            onPress={() => startTask()}
            style={styles.button}
            icon={{
              name: "play",
              type: "antdesign",
              size: 35,
              color: "white",
            }}
            buttonStyle={{
              backgroundColor: "rgba(27, 181, 91, 1)",
              borderRadius: 15,
              height: 100,
            }}
            titleStyle={{
              fontSize: 25,
              fontWeight: "bold",
              marginLeft: 5,
            }}
            containerStyle={{
              marginHorizontal: 50,
              height: 150,
              width: 325,
              marginVertical: 10,
            }}
          />
        )}
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    padding: 5,
  },
  text: {
    textAlign: "center",
    padding: 5,
    fontSize: 50,
    color: "#2188da",
    fontWeight: "bold",
    marginBottom: 10,
  },
  buttonContainer: {
    marginLeft: "auto",
    marginRight: "auto",
  },
  button: {
    backgroundColor: "rgba(8, 196, 64, 1)",
    marginTop: 25,
    borderColor: "transparent",
    borderWidth: 0,
    borderRadius: 30,
    alignSelf: "center",
  },
  item: {
    aspectRatio: 1,
    width: 300,
    height: 300,
    flex: 1,
  },
  itemContainer: {
    marginLeft: "auto",
    marginRight: "auto",
  },
  video: {
    aspectRatio: 1,
    width: 300,
    height: 300,
    flex: 1,
    marginBottom: -50,
  },
  videoContainer: {
    marginLeft: "auto",
    marginRight: "auto",
    marginBottom: -50,
  },
  audio: {
    aspectRatio: 1,
    width: 120,
    height: 120,
    flex: 1,
  },
  audioContainer: {
    marginLeft: "auto",
    marginRight: "auto",
  },
  stopwatch: {
    color: "#2188da",
  },
});

export default NotificationPrimary;

function notificationDateParse(newNotif) {
  let dateSentIsoString = newNotif.dateSent;
  if (dateSentIsoString != null) {
    dateSentIsoString = dateSentIsoString.toISOString();
  }
  let dateStartedIsoString = newNotif.dateStarted;
  if (dateStartedIsoString != null) {
    dateStartedIsoString = dateStartedIsoString.toISOString();
  }
  let dateCompletedIsoString = newNotif.dateCompleted;
  if (dateCompletedIsoString != null) {
    dateCompletedIsoString = dateCompletedIsoString.toISOString();
  }
  let notifBackendFormat = {
    id: newNotif.id,
    name: newNotif.name,
    icon: newNotif.icon,
    description: newNotif.description,
    dateSent: dateSentIsoString,
    dateStarted: dateStartedIsoString,
    dateCompleted: dateCompletedIsoString,
  };
  return notifBackendFormat;
}
