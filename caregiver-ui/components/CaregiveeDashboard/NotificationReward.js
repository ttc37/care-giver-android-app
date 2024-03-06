import * as React from "react";
import { useState } from "react";
import { Text, View, StyleSheet, Image, FlatList } from "react-native";
import { ListItem, Icon } from "react-native-elements";
import { Button } from "react-native-elements";
import { Video, AVPlaybackStatus, Audio } from "expo-av";
import { useNavigation } from "@react-navigation/native";
import { updateNotification } from "../Server/BackendNotification";
import { TouchableHighlight } from "react-native-gesture-handler";

const NotificationReward = ({ route }) => {
  const navigation = useNavigation();
  const notification = route.params.notification;
  const [statusVideo, setStatus] = useState(false);
  const [sound, setSound] = useState();

  React.useEffect(() => {
    if (notification.soundReward) {
      console.log("Sound: " + JSON.stringify(notification.soundReward));
      Audio.Sound.createAsync({ uri: notification.soundReward }, true)
        .then((result) => {
          console.log(result);
          setSound(result);
          //play reward sound at start
          result.sound.replayAsync();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [notification]);

  const closeTask = () => {
    navigation.navigate("Caregivee Dashboard");
  };
  const SelectImageElement = (itemName) => {
    var image = itemName.image;
    console.log("IMAGE" + image);
    if (image === "image") {
      //return <Icon name={itemName} size={75} />;
      return null;
    } else {
      return (
        <View style={styles.itemContainer}>
          <TouchableHighlight onPress={() => sound.sound.replayAsync()}>
            <Image
              style={styles.item}
              resizeMode={"contain"}
              source={{ uri: image }}
            />
          </TouchableHighlight>
          
        </View>
      );
    }
  };
  const VideoPlayback = (notificationVideo) => {
    console.log("VIDEO REWARD: " + JSON.stringify(notificationVideo));
    notificationVideo = notificationVideo.video;
    if (notificationVideo != null) {
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
      color: "#000",
      marginLeft: 7,
      textAlign: "center",
      fontWeight: "bold",
    },
  };

  return (
    <View style={{ flex: 1, alignContent: "center" }}>
      <SelectImageElement image={notification.imageReward} />
      <Text style={styles.text}>Task Completed!</Text>
      <VideoPlayback video={notification.videoReward} />
      <Button
        title="Close"
        onPress={() => closeTask()}
        icon={{
          name: "closecircle",
          type: "antdesign",
          size: 35,
          color: "white",
        }}
        buttonStyle={{
          borderRadius: 15,
          height: 100,
          alignSelf: "center",
          width: "80%"
        }}
        titleStyle={{
          fontSize: 25,
          fontWeight: "bold",
          marginLeft: 5,
          alignSelf: "center"
        }}
        containerStyle={{
          marginHorizontal: 50,
          height: 150,
          width: 325,
          marginVertical: 10,
          alignSelf: "center",
          width: "100%"
        }}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  text: {
    textAlign: "center",
    padding: 5,
    fontSize: 50,
    fontWeight: "bold",
    color: "#2188da",
    marginBottom: 20
  },
  button: {
    backgroundColor: "rgba(90, 154, 230, 1)",
    marginTop: 15,
    borderColor: "transparent",
    borderWidth: 0,
    borderRadius: 30,
  },
  container: {
    padding: 5,
  },
  buttonContainer: {
    marginLeft: "auto",
    marginRight: "auto"
  },
  button: {
    backgroundColor: "rgba(8, 196, 64, 1)",
    marginTop: 25,
    borderColor: "transparent",
    borderWidth: 0,
    borderRadius: 30,
    alignSelf: "center"
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
    marginBottom: -50
  },
  videoContainer: {
    marginLeft: "auto",
    marginRight: "auto",
    marginBottom: -50
  },
  audio: {
    aspectRatio: 1,
    width: 120,
    height: 120,
    flex: 1,
  },
  audioContainer: {
    marginLeft: "auto",
    marginRight: "auto"
  }
});

export default NotificationReward;
