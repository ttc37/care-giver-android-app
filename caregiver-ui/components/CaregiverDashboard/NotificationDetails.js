import * as React from 'react';
import { useState } from 'react';
import { Text, View, StyleSheet, FlatList, Image } from 'react-native';
import { ListItem, Icon, Avatar } from 'react-native-elements'
import TimeAgo from 'react-native-timeago';
import getNotificationStatus from './GetNotificationStatus'

import { useNavigation } from '@react-navigation/native';

const NotificationDetails = ({route}) => {
  const getDateString = (date) => {
    if(date)
    {
      let formattedMonth = date.getMonth() > 8 ? `${date.getMonth() + 1}` : `0${date.getMonth()}`;
      let formattedDay = date.getDate() > 9 ? `${date.getDate()}` : `0${date.getDate()}`;
      let formattedYear = date.getFullYear();
      let formattedHours = date.getHours() > 12 ? `${date.getHours() - 12}` : `${date.getHours()}`;
      formattedHours = formattedHours > 9 ? formattedHours : `0${formattedHours}`;
      let formattedMinutes = date.getMinutes() > 9 ? `${date.getMinutes()}` : `0${date.getMinutes()}`;
      let ampm = date.getHours() > 12 ? 'PM' : "AM";
      return `${formattedMonth}/${formattedDay}/${formattedYear} ${formattedHours}:${formattedMinutes} ${ampm}`;
    } else
    {
      return "N/A";
    }
  }
  const getTimeBetween = (endDate, startDate) => {
    if(!endDate || !startDate)
    {
      return "N/A";
    }
    let milliseconds = endDate.getTime() - startDate.getTime();
    console.log("ms: " + milliseconds);
    let seconds = Math.floor((milliseconds / 1000) % 60);
    let minutes = Math.floor((milliseconds / (1000 * 60)) % 60);
    let hours = Math.floor((milliseconds / (1000 * 60 * 60)));

    let formattedHours = hours < 10 ? `0${hours}` : `${hours}`;
    let formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    let formattedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`
  }

    const navigation = useNavigation();
    const notification = route.params.notification;
    const count = route.params.count;

  const SelectImageElement = (itemName) => {
    itemName = itemName.itemName
    if (itemName === "image") {
      return <Icon name={itemName} size={100} />;
    } else {
      return <Image style={styles.item} containerStyle={styles.itemContainer} resizeMode={"contain"} source={{uri: itemName}}/>
    }
  };

  return (
    <View style={{flex: 1}}>
      <SelectImageElement itemName={notification.icon}/>
      <Text style={styles.text}>{notification.name}</Text>
      <ListItem bottomDivider>
        <ListItem.Content>
          <ListItem.Title>Sent to {notification.sentTo}</ListItem.Title>
        </ListItem.Content>
      </ListItem>
      <ListItem bottomDivider>
        <ListItem.Content>
          <ListItem.Title>Date Sent: {getDateString(notification.dateSent)}</ListItem.Title>
        </ListItem.Content>
      </ListItem>
      <ListItem bottomDivider>
        <ListItem.Content>
          <ListItem.Title>Date Started: {getDateString(notification.dateStarted)}</ListItem.Title>
        </ListItem.Content>
      </ListItem>
      <ListItem bottomDivider>
        <ListItem.Content>
          <ListItem.Title>Date Completed: {getDateString(notification.dateCompleted)}</ListItem.Title>
        </ListItem.Content>
      </ListItem>
      <ListItem bottomDivider>
        <ListItem.Content>
          <ListItem.Title>Status: {getNotificationStatus(notification)}</ListItem.Title>
        </ListItem.Content>
      </ListItem>
      <ListItem bottomDivider>
        <ListItem.Content>
          <ListItem.Title>Time Taken: {getTimeBetween(notification.dateCompleted, notification.dateStarted)}</ListItem.Title>
        </ListItem.Content>
      </ListItem>
      <ListItem bottomDivider>
        <ListItem.Content>
          <ListItem.Title>This notification has been sent {count} time(s) to {notification.sentTo}</ListItem.Title>
        </ListItem.Content>
      </ListItem>
    </View>
  );
}
const styles = StyleSheet.create({
  text: {
    textAlign: 'center',
    padding: 5,
    fontSize: 25
  },
  item: {
    aspectRatio: 1,
    width: "50%",
    height: "50%",
    flex: 1,
    alignSelf: "center"
  },
  itemContainer: {
    padding: 5,
    marginLeft: "auto",
    marginRight: "auto",
  }
});


export default NotificationDetails;
