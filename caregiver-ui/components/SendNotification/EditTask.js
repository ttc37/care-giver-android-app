import React from "react";
import { SafeAreaView, StyleSheet, ScrollView, Text, View } from "react-native";
import { Button, Input, Icon, Image } from "react-native-elements";
import { updateTask } from "../Server/BackendTask";
import * as ImagePicker from "expo-image-picker";
import { useEffect } from "react";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { Video, AVPlaybackStatus, Audio } from "expo-av";
import { Storage } from "aws-amplify";
import mime from "mime-types";

const EditTask = (props) => {
  const [taskId, setTaskId] = React.useState("");
  const [name, setName] = React.useState("");
  const [location, setLocation] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [caregiverNotes, setCaregiverNotes] = React.useState("");
  const [selectedImage, setSelectedImage] = React.useState(null);
  const [selectedVideo, setSelectedVideo] = React.useState(null);
  const [selectedAudio, setSelectedAudio] = React.useState(null);
  const [selectedImageReward, setSelectedImageReward] = React.useState(null);
  const [selectedVideoReward, setSelectedVideoReward] = React.useState(null);
  const [selectedAudioReward, setSelectedAudioReward] = React.useState(null);
  const [recording, setRecording] = React.useState();
  const [recordingReward, setRecordingReward] = React.useState();
  const { user } = props;
  const { route } = props;
  const { accessToken } = props;
  const { updateTasksHandler } = props;
  const task = route.params.task;
  const isFocused = useIsFocused();
  const navigation = useNavigation();

  const loadImage = (name) => {
    Storage.get(name, {
      level: "public",
      bucket: "caregiver-android",
      region: "us-east-1",
    })
      .then((result) => {
        console.log(result);
        setSelectedImage(result);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const loadImageReward = (name) => {
    Storage.get(name, {
      level: "public",
      bucket: "caregiver-android",
      region: "us-east-1",
    })
      .then((result) => {
        console.log(result);
        setSelectedImageReward({ localUri: result });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const loadVideo = (name) => {
    Storage.get(name, {
      level: "public",
      bucket: "caregiver-android",
      region: "us-east-1",
    })
      .then((result) => {
        console.log(result);
        setSelectedVideo({ localUri: result });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const loadVideoReward = (name) => {
    Storage.get(name, {
      level: "public",
      bucket: "caregiver-android",
      region: "us-east-1",
    })
      .then((result) => {
        console.log(result);
        setSelectedVideoReward({ localUri: result });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const loadSound = (name) => {
    Storage.get(name, {
      level: "public",
      bucket: "caregiver-android",
      region: "us-east-1",
    })
      .then((result1) => {
        console.log(result1);
        Audio.Sound.createAsync({ uri: result1 }, true)
          .then((result2) => {
            console.log(result2);
            setSelectedAudio(result2);
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const loadSoundReward = (name) => {
    Storage.get(name, {
      level: "public",
      bucket: "caregiver-android",
      region: "us-east-1",
    })
      .then((result1) => {
        console.log(result1);
        Audio.Sound.createAsync({ uri: result1 }, true)
          .then((result2) => {
            console.log(result2);
            setSelectedAudioReward(result2);
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (task) {
      console.log("TASK LOADED: " + JSON.stringify(task));
    }
    setTaskId(task?.id);
    setName(task?.name);
    setLocation(task?.location);
    setDescription(task?.description);
    setCaregiverNotes(task?.caregiverNotes);
    if(task?.image_url){
      loadImage(task?.image_url);
    }
    if(task?.video_url){
      loadVideo(task?.video_url);
    }
    if (task?.sound_url) {
      loadSound(task?.sound_url);
    }
    if(task?.image_url_reward){
    loadImageReward(task?.image_url_reward);
    }
    if(task?.video_url_reward){
    loadVideoReward(task?.video_url_reward);
    }
    if (task?.sound_url_reward) {
      loadSoundReward(task?.sound_url_reward);
    }
  }, [task]);

  const openPicker = async (isVideo) => {
    let permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }
    var options = { mediaTypes: ImagePicker.MediaTypeOptions.Images };
    if (isVideo) {
      options = { mediaTypes: ImagePicker.MediaTypeOptions.Videos };
    }
    let pickerResult = await ImagePicker.launchImageLibraryAsync(options);

    if (pickerResult.cancelled === true) {
      return;
    }

    if (isVideo) {
      setSelectedVideo({ localUri: pickerResult.uri });
    } else {
      setSelectedImage({ localUri: pickerResult.uri });
    }
  };
  const openPickerReward = async (isVideo) => {
    let permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }
    var options = {
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      base64: true,
    };
    if (isVideo) {
      options = {
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        base64: true,
      };
    }
    let pickerResult = await ImagePicker.launchImageLibraryAsync(options);

    if (pickerResult.cancelled === true) {
      return;
    }

    if (isVideo) {
      setSelectedVideoReward({ localUri: pickerResult.uri });
    } else {
      setSelectedImageReward({ localUri: pickerResult.uri });
    }
  };
  const saveTask = () => {
    //Perform s3 upload and get url, add to new task
    uploadAttachments();
  };

  const uploadAttachments = () => {
    //Perform s3 upload and get url, add to new task
    let promises = [];
    if (selectedImage != null) {
      promises.push(awsUpload(selectedImage));
    } else {
      promises.push("");
    }
    if (selectedAudio != null) {
      promises.push(awsUploadSound(selectedAudio));
    } else {
      promises.push("");
    }
    if (selectedVideo != null) {
      promises.push(awsUpload(selectedVideo));
    } else {
      promises.push("");
    }
    if (selectedImageReward != null) {
      promises.push(awsUpload(selectedImageReward));
    } else {
      promises.push("");
    }
    if (selectedAudioReward != null) {
      promises.push(awsUploadSound(selectedAudioReward));
    } else {
      promises.push("");
    }
    if (selectedVideoReward != null) {
      promises.push(awsUpload(selectedVideoReward));
    } else {
      promises.push("");
    }

    Promise.all(promises).then((values) => {
      console.log(values[0]);
      try {
        let newTask = {
          id: taskId,
          name: name,
          created_by: user,
          location: location,
          description: description,
          caregiverNotes: caregiverNotes,
          image_url: values[0],
          sound_url: values[1],
          video_url: values[2],
          image_url_reward: values[3],
          sound_url_reward: values[4],
          video_url_reward: values[5],
        };
        console.log("Updating this task: " + JSON.stringify(newTask));
        updateTask(newTask, accessToken).then((data) => {
          if (data) {
            ToastAndroid.show("Task Updated Successfully", ToastAndroid.SHORT);
            updateTasksHandler();
          } else {
            ToastAndroid.show(
              "Issue Editing Task. Please Wait and Try Again",
              ToastAndroid.LONG
            );
          }
          navigation.goBack();
        });
      } catch (e) {
        console.error(e);
        console.log("Error creating task");
      }
    });
  };
  const awsUploadSound = (soundResource) => {
    if (soundResource.localUri) {
      const localUri = soundResource.localUri;
      const soundName = localUri.replace(/^.*[\\\/]/, "");
      const fileType = mime.lookup(localUri);
      const access = { level: "public", contentType: fileType };
      console.log(localUri);
      return fetch(localUri)
        .then((response) => {
          return response.blob().then((blob) => {
            return Storage.put(soundName, blob, access)
              .then((success) => {
                console.log(success);
                return success.key;
              })
              .catch((err) => {
                console.log(err);
                return "";
              });
          });
        })
        .catch((err) => {
          console.log("Error: " + err);
          return "";
        });
    }
  };
  const awsUpload = (fileResource) => {
    if (fileResource.localUri) {
      console.log("File Resource: " + JSON.stringify(fileResource));
      const imageName = fileResource.localUri.replace(/^.*[\\\/]/, "");
      const filetype = mime.lookup(fileResource.localUri);
      const access = { level: "public", contentType: filetype };

      return fetch(fileResource.localUri)
        .then((response) => {
          return response
            .blob()
            .then((blob) => {
              return Storage.put(imageName, blob, access)
                .then((success) => {
                  console.log(success);
                  return success.key;
                })
                .catch((err) => {
                  console.log(err);
                  return "";
                });
            })
            .catch((err) => {
              console.log(err);
              return "";
            });
        })
        .catch((err) => {
          console.log(err);
          return "";
        });
    }
  };

  const ImagePreview = () => {
    if (selectedImage != null) {
      return (
        <Image
          source={{ uri: selectedImage.localUri }}
          style={styles.item}
          containerStyle={styles.itemContainer}
          resizeMode={"contain"}
        />
      );
    }
    return null;
  };
  const ImagePreviewReward = () => {
    if (selectedImageReward != null) {
      return (
        <Image
          source={{ uri: selectedImageReward.localUri }}
          style={styles.item}
          containerStyle={styles.itemContainer}
          resizeMode={"contain"}
        />
      );
    }
    return null;
  };
  const VideoPreview = () => {
    if (selectedVideo != null) {
      return (
        <View style={styles.itemContainer}>
          <Video
            style={styles.item}
            source={{ uri: selectedVideo.localUri }}
            useNativeControls
            resizeMode="contain"
          />
        </View>
      );
    }
    return null;
  };
  const VideoPreviewReward = () => {
    if (selectedVideoReward != null) {
      return (
        <View style={styles.itemContainer}>
          <Video
            style={styles.item}
            source={{ uri: selectedVideoReward.localUri }}
            useNativeControls
            resizeMode="contain"
          />
        </View>
      );
    }
    return null;
  };
  async function startRecordingReward() {
    try {
      console.log("Requesting permissions..");
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      console.log("Starting recording reward..");
      const { recording } = await Audio.Recording.createAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );
      setRecordingReward(recording);
      console.log("Recording started");
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  }
  async function startRecording() {
    try {
      console.log("Requesting permissions..");
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      console.log("Starting recording..");
      const { recording } = await Audio.Recording.createAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );
      setRecording(recording);
      console.log("Recording started");
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  }
  async function stopRecordingReward() {
    console.log("Stopping recording reward..");
    setRecordingReward(undefined);
    await recordingReward.stopAndUnloadAsync();
    const { sound, status } = await recordingReward.createNewLoadedSoundAsync();
    const uri = recordingReward.getURI();
    setSelectedAudioReward({ sound: sound, status: status, localUri: uri });
    console.log("Recording stopped");
  }
  async function stopRecording() {
    console.log("Stopping recording..");
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    const { sound, status } = await recording.createNewLoadedSoundAsync();
    const uri = recording.getURI();
    setSelectedAudio({ sound: sound, status: status, localUri: uri });
    console.log("Recording stopped");
  }
  const AudioPreview = () => {
    if (selectedAudio != null) {
      return (
        <View style={styles.itemContainer}>
          <Icon
            name="play"
            type="antdesign"
            size={50}
            onPress={() => selectedAudio.sound.replayAsync()}
            style={styles.item}
          />
        </View>
      );
    }
    return null;
  };
  const AudioPreviewReward = () => {
    if (selectedAudioReward != null) {
      return (
        <View style={styles.itemContainer}>
          <Icon
            name="play"
            type="antdesign"
            size={50}
            onPress={() => selectedAudioReward.sound.replayAsync()}
            style={styles.item}
          />
        </View>
      );
    }
    return null;
  };

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
    >
      <Input
        style={styles.input}
        onChangeText={setName}
        value={name}
        placeholder="Name"
        label="Name"
      />
      <Input
        style={styles.input}
        placeholder="Location"
        onChangeText={setLocation}
        value={location}
        label="Location"
      />
      <Input
        style={styles.descriptionInput}
        placeholder="Description"
        onChangeText={setDescription}
        value={description}
        multiline
        label="Description"
      />
      <Input
        style={styles.descriptionInput}
        placeholder="Notes for Caregiver"
        onChangeText={setCaregiverNotes}
        value={caregiverNotes}
        multiline
        label="Notes for Caregiver"
      />
      <Text style={styles.taskHeader}>Attachments</Text>
      <View style={{ flexDirection: "row" }}>
        <View style={{ flexDirection: "column" }}>
          <Icon
            name="add-a-photo"
            type="MaterialIcons"
            size={50}
            onPress={() => openPicker(false)}
            style={styles.button}
          />
          <ImagePreview />
          <Text style={styles.mediaSubtitle}>Photo</Text>
        </View>
        <View style={{ flexDirection: "column" }}>
          {recording ? (
            <Icon
              name="stop"
              type="IonIcons"
              size={50}
              onPress={recording ? stopRecording : startRecording}
              style={styles.button}
            />
          ) : (
            <Icon
              name="volume-up"
              type="MaterialIcons"
              size={50}
              onPress={recording ? stopRecording : startRecording}
              style={styles.button}
            />
          )}

          {recording ? <Text>Recording in Progress</Text> : <Text></Text>}
          <AudioPreview></AudioPreview>
          <Text style={styles.mediaSubtitle}>Audio</Text>
        </View>
        <View style={{ flexDirection: "column" }}>
          <Icon
            name="video-camera"
            type="entypo"
            size={50}
            onPress={() => openPicker(true)}
            style={styles.button}
          />
          <VideoPreview />
          <Text style={styles.mediaSubtitle}>Video</Text>
        </View>
      </View>
      <Text style={styles.taskHeader}>Rewards</Text>
      <View style={{ flexDirection: "row" }}>
        <View style={{ flexDirection: "column" }}>
          <Icon
            name="add-a-photo"
            type="MaterialIcons"
            size={50}
            onPress={() => openPickerReward(false)}
            style={styles.button}
          />
          <ImagePreviewReward />
          <Text style={styles.mediaSubtitle}>Photo</Text>
        </View>
        <View style={{ flexDirection: "column" }}>
          {recordingReward ? (
            <Icon
              name="stop"
              type="IonIcons"
              size={50}
              onPress={
                recordingReward ? stopRecordingReward : startRecordingReward
              }
              style={styles.button}
            />
          ) : (
            <Icon
              name="volume-up"
              type="MaterialIcons"
              size={50}
              onPress={
                recordingReward ? stopRecordingReward : startRecordingReward
              }
              style={styles.button}
            />
          )}

          {recordingReward ? <Text>Recording in Progress</Text> : <Text></Text>}
          <AudioPreviewReward></AudioPreviewReward>
          <Text style={styles.mediaSubtitle}>Audio</Text>
        </View>
        <View style={{ flexDirection: "column" }}>
          <Icon
            name="video-camera"
            type="entypo"
            size={50}
            onPress={() => openPickerReward(true)}
            style={styles.button}
          />
          <VideoPreviewReward />
          <Text style={styles.mediaSubtitle}>Video</Text>
        </View>
      </View>
      <Button
        title="Save Task"
        onPress={() => saveTask()}
        style={styles.saveButton}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  saveButton: {
    marginTop: 15,
  },
  taskHeader: {
    fontSize: 17,
    marginLeft: 15,
    marginTop: 5,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  descriptionInput: {
    height: 100,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  button: {
    marginLeft: 15,
  },
  createButton: {
    marginTop: 15,
  },
  item: {
    aspectRatio: 1,
    width: 100,
    height: 100,
    flex: 1,
  },
  itemContainer: {
    marginLeft: "auto",
    marginRight: "auto",
  },
  mediaSubtitle: {
    textAlign: "center",
    marginLeft: 15
  }
});

export default EditTask;
