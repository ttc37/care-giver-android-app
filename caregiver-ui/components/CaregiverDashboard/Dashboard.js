import * as React from "react";
import { useState } from "react";
import { Text, View, StyleSheet, FlatList } from "react-native";
import { ListItem, Icon , Avatar} from "react-native-elements";
import TimeAgo from "react-native-timeago";
import getNotificationStatus from "./GetNotificationStatus";

import { useNavigation } from "@react-navigation/native";

const Dashboard = (props) => {
  const { notifications } = props;

  const navigation = useNavigation();

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

  const getTimesSent = (selected) => {
    return notifications.filter(
      (notification) =>
        notification.name == selected.name &&
        notification.sentTo == selected.sentTo
    ).length;
  };
  const SelectImageElement = (itemName) => {
    itemName = itemName.itemName
    if (itemName === "image") {
      return <Icon name={itemName} size={75} />;
    } else {
      return <Avatar size="medium" source={{uri: itemName}} imageProps={{ resizeMode: "contain"}} />
    }
  };
  return (
    <View style={{ flex: 1 }}>
      <Text style={styles.notificationHeader}>Sent Notifications</Text>
      <FlatList
        data={notifications}
        renderItem={({ item }) => (
          <ListItem
            bottomDivider
            onPress={() =>
              navigation.navigate("Notification Details", {
                notification: item,
                count: getTimesSent(item),
              })
            }
          >
          <SelectImageElement itemName={item.icon}/>
            <ListItem.Content>
              <ListItem.Title>{item.name}</ListItem.Title>
              <ListItem.Subtitle>Sent to {item.sentTo}</ListItem.Subtitle>
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
  );
};

export default Dashboard;
