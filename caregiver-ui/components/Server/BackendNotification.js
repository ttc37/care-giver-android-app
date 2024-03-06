import axios from "axios";
import baseUrl from './ipconstant'
//const baseUrl = "http://44.203.108.190:80";
const createNotification = (notification, accessToken) => {
  return axios
    .post(`${baseUrl}/notificationcreation`, notification, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json", 
        Authorization : `Bearer ${accessToken}`
      }
    })
    .then((response) => {
      console.log("success" + response);
      return true;
    })
    .catch((error) => {
      console.log("error" + error);
      return false;
    });
};

const updateNotification = (notification, accessToken) => {
  return axios
    .post(`${baseUrl}/notificationupdate`, notification, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
        Authorization : `Bearer ${accessToken}`
      }
    })
    .then((response) => {
      console.log("success" + response);
    })
    .catch((error) => {
      console.log("error" + error);
    });
};

const parsedNotification = (notifications) => {
  const notifications_copy = notifications;
  notifications_copy.forEach((notification) => {
    if (notification.dateSent != null){
      notification.dateSent = new Date(notification.dateSent);
    }
    if (notification.dateStarted != null){
      notification.dateStarted = new Date(notification.dateStarted);
    }
    if (notification.dateCompleted != null){
      notification.dateCompleted = new Date(notification.dateCompleted);
    }

  });
  return notifications_copy
}

const getNotifications= (accessToken) => {
  return axios
    .get(`${baseUrl}/getnotifications`, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
        Authorization : `Bearer ${accessToken}`
      }
    })
    .then((response) => {
      console.log("notifications loaded successfully: " + response);
      const parsedNotifications = parsedNotification(response.data)
      console.log("parsed notifications")
      console.log(parsedNotifications)
      return parsedNotifications;
    })
    .catch((error) => {
      console.log("error loading notifications: " + error);
      return null;
    });
};

const getNotificationsByCaregivee = (accessToken) => {
  return axios
    .get(`${baseUrl}/getnotificationscaregivee`, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
        Authorization : `Bearer ${accessToken}`
      }
    })
    .then((response) => {
      console.log("notifications loaded successfully: " + response);
      const parsedNotifications = parsedNotification(response.data)
      return parsedNotifications;
    })
    .catch((error) => {
      console.log("error loading notifications: " + error);
      return null;
    });
};

export { getNotifications, createNotification, getNotificationsByCaregivee, updateNotification };


