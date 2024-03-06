import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { useState, useEffect } from "react";
import { useIsFocused } from "@react-navigation/native";
import CaregiveeDashboardScreen from "../CaregiveeDashboard/CaregiveeDashboardScreen";
import { getNotificationsByCaregivee } from "../Server/BackendNotification";
import { getCaregiveeRequestsByCaregivee } from "../Server/BackendCaregiveeRequest";
import getUserInfo from "../Server/BackendUserInfo";
const Stack = createStackNavigator();

const CaregiveeHomePage = (props) => {
  const [requests, setRequests] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [userInformation, setUserInformation] = useState();
  const [userEmail, setUserEmail] = useState();
  const { user } = props;
  const { email } = props;
  const {logoutFunction} = props;
  const accessToken = props.userToken;
  const isFocused = useIsFocused();

  const updateNotificationsHandler = () => {
    getNotificationsByCaregivee(accessToken).then((notif) => {
      setNotifications(notif ? notif : mockNotifications);
    });
  }
  const updateRequestsHandler = () => {
    getCaregiveeRequestsByCaregivee(accessToken).then((request) => {
      setRequests(request ? request : mockRequests);
    });
  }
  useEffect(() => {
    //get username from auth (pass through props)
    console.log("User: " + user);
    console.log("Email: " + email);
    setUserEmail(email);
    console.log(accessToken);

    getUserInfo(accessToken).then((userInfo) => {
      setUserInformation(userInfo ? userInfo : null);
    })

    //load notifications by caregivee username
    getNotificationsByCaregivee(accessToken).then((notif) => {
      console.log(notif);
      setNotifications(notif ? notif : mockNotifications);
    });

    //load caregivee requests by caregivee username
    getCaregiveeRequestsByCaregivee(accessToken).then((request) => {
      setRequests(request ? request : mockRequests);
    });
  }, [isFocused]);

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Caregivee Dashboard Screen"
        options={{ headerShown: false }}
      >
        {(props) => (
          <CaregiveeDashboardScreen
            {...props}
            notifications={notifications}
            requests={requests}
            user={user}
            email={userEmail}
            accessToken={accessToken}
            updateNotificationsHandler={updateNotificationsHandler}
            userInformation={userInformation}
            logoutFunction={logoutFunction}
            reloadRequests={updateRequestsHandler}
          ></CaregiveeDashboardScreen>
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
};
export default CaregiveeHomePage;

const mockNotifications = [
  {
    id: 1,
    name: "Turn off Lights",
    icon: "image",
    sentTo: "Caregivee1",
    dateSent: new Date(2021, 10, 11, 17, 36, 30, 0),
    dateStarted: null,
    dateCompleted: null,
  },
  {
    id: 2,
    name: "Wash Hands",
    icon: "image",
    sentTo: "Caregivee1",
    dateSent: new Date(2021, 10, 11, 2, 30, 30, 0),
    dateStarted: new Date(2021, 10, 11, 2, 35, 30, 0),
    dateCompleted: new Date(2021, 10, 11, 2, 40, 30, 0),
  },
];

const mockRequests = [
  {
    id: 1,
    sentToCaregivee: "test caregivee",
    sentFromCaregiver: "Primary Caregiver",
    dateSent: new Date(2021, 10, 11, 2, 30, 30, 0),
  },
];
