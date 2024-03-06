import * as React from "react";
import { Text, View, StyleSheet, FlatList } from "react-native";
import { ListItem, Icon, Avatar } from "react-native-elements";
import TimeAgo from "react-native-timeago";
import { useState, useEffect } from "react";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import getNotificationStatus from "../CaregiverDashboard/GetNotificationStatus";
import { Button } from "react-native-elements";
import { createCaregiveeCaregiverConnection } from "../Server/BackendCaregivee";
import { updateCaregiveeRequest } from "../Server/BackendCaregiveeRequest";
import { getNotificationsByCaregivee } from "../Server/BackendNotification";
const CaregiveeDashboard = (props) => {
  console.log(props.requests)
  var { notifications } = props;
  const requestsProps = props.requests;
  const { user } = props;
  const { accessToken } = props;
  const { reloadRequests } = props;
  const { updateNotificationsHandler } = props;
  const [received, setReceived] = useState([]);
  const [ requests, setRequests ] = useState([]);
  const [completed, setCompleted] = useState([]);
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  console.log("NOTIFICATION ", notifications);
  const taskCompleted = () => {
    return getNotificationsByCaregivee(accessToken).then((data) => {
      notifications = data;
    });
  };
  useEffect(() => {
    setRequests(requestsProps);
    console.log("RECEIVED: " + JSON.stringify(received));
    if (received[0]) {
      navigation.navigate("Notification Primary", {
        notification: received[0],
        accessToken: accessToken,
        updateNotificationsHandler: taskCompleted,
        taskStarted: (notif) => taskStarted(notif),
      });
    }
  }, [received, requestsProps]);

  useEffect(() => {
    console.log("NOTIFICATIONS: " + JSON.stringify(notifications));
    setReceived(
      notifications.filter((notification) => notification.dateCompleted == null)
    );
    setCompleted(
      notifications.filter((notification) => notification.dateCompleted != null)
    );
  }, [notifications]);

  const styles = StyleSheet.create({
    timeAgo: {
      fontSize: 12,
    },
    notificationHeader: {
      fontSize: 20,
      marginLeft: 10,
      marginTop: 5,
      marginBottom: 5,
    },
  });

  const taskStarted = (notif) => {
    console.log("Task Started!");
  };

  const acceptRequest = (requestAccepted) => {
    let caregivee = {
      name: requestAccepted.sentToCaregivee,
      caregiver: requestAccepted.sentFromCaregiver,
      userName: user,
    };
    //TODO: Add accepted boolean to requests in API, on accepting call updaterequest endpoint
    let request = {
      sentFromCaregiver: requestAccepted.sentFromCaregiver,
      accepted: true,
    };
    createCaregiveeCaregiverConnection(caregivee, accessToken);
    updateCaregiveeRequest(request, accessToken);
    //.then(() => {
    //  reloadRequests();
    //})

    console.log("Requests: " + JSON.stringify(requests));
    console.log("Request Accepted!");
  };
  const deleteElement = (id) => {
    var localRequests = requests.filter((item) => item.id != id);
    setRequests(localRequests);
  };
  const SelectImageElement = (itemName) => {
    itemName = itemName.itemName;

    console.log("Notification Primary " + itemName);
    if (itemName === "image") {
      return <Icon name={itemName} size={75} />;
    } else {
      return (
        <Avatar
          size="medium"
          source={{ uri: itemName }}
          imageProps={{ resizeMode: "contain" }}
        />
      );
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {received[0] ? (
        <View>
          <Text style={styles.notificationHeader}>Received Notifications</Text>
          <FlatList
            data={received}
            renderItem={({ item }) => (
              <ListItem
                bottomDivider
                onPress={() =>
                  navigation.navigate("Notification Primary", {
                    notification: item,
                    accessToken: accessToken,
                    updateNotificationsHandler: updateNotificationsHandler,
                    taskStarted: (notif) => taskStarted(notif),
                  })
                }
              >
                <SelectImageElement itemName={item.icon} />
                <ListItem.Content>
                  <ListItem.Title>{item.name}</ListItem.Title>
                  <ListItem.Subtitle>
                    {getNotificationStatus(item)}
                  </ListItem.Subtitle>
                  <ListItem.Subtitle>
                    <TimeAgo style={styles.timeAgo} time={item.dateSent} />
                  </ListItem.Subtitle>
                </ListItem.Content>
                <ListItem.Chevron />
              </ListItem>
            )}
            keyExtractor={(item) => item.id}
          />
        </View>
      ) : (
        <View></View>
      )}
      <Text style={styles.notificationHeader}>Completed Notifications</Text>
      <FlatList
        data={completed}
        renderItem={({ item }) => (
          <ListItem bottomDivider>
            <Icon name={item.icon} size={75} />
            <ListItem.Content>
              <ListItem.Title>{item.name}</ListItem.Title>
              <ListItem.Subtitle>
                {getNotificationStatus(item)}
              </ListItem.Subtitle>
              <ListItem.Subtitle>
                <TimeAgo style={styles.timeAgo} time={item.dateSent} />
              </ListItem.Subtitle>
            </ListItem.Content>
            <ListItem.Chevron />
          </ListItem>
        )}
        keyExtractor={(item) => item.id}
      />
      <Text style={styles.notificationHeader}>Requests Received</Text>
      <FlatList
        data={requests}
        renderItem={({ item }) => (
          <ListItem bottomDivider>
            <ListItem.Content>
              <ListItem.Title>{item.sentFromCaregiver}</ListItem.Title>
              <ListItem.Subtitle>
                {item.sentFromCaregiver} has requested to add you to their
                caregivee network
              </ListItem.Subtitle>
              <ListItem.Subtitle>
                <TimeAgo style={styles.timeAgo} time={item.dateSent} />
              </ListItem.Subtitle>
              <Button
                title="Accept"
                onPress={() => {
                  acceptRequest(item);
                  deleteElement(item.id);
                }}
                style={styles.button}
                icon={{
                  name: "checkcircle",
                  type: "antdesign",
                  size: 20,
                  color: "white",
                }}
                buttonStyle={{
                  backgroundColor: "rgba(27, 181, 91, 1)",
                  borderRadius: 15,
                  height: 50,
                  width: 200,
                  marginTop: 10,
                }}
              />
            </ListItem.Content>
            <ListItem.Chevron />
          </ListItem>
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

export default CaregiveeDashboard;
