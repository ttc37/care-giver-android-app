import * as React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
//import ManageCaregivees from '../ManageCaregivees/ManageCaregivees'
import DashboardScreen from "../CaregiverDashboard/DashboardScreen";
import ManageCaregiveesScreen from "../ManageCaregivees/ManageCaregiveesScreen";
import ManageCaregiversSecNav from "../ManageCaregivees/ManageCaregiversSecNav";
import ManageCaregiversParentNav from "../ManageCaregivees/ManageCaregiversParentNav";
import SendNotificationNavigator from "../SendNotification/SendNotificationNavigator";
import { getTasks } from "../Server/BackendTask";
import { getNotifications } from "../Server/BackendNotification";
import { getCaregiverRequests, getCaregiveeRequestsSent, getCaregiverRequestsSent, getParentCaregiversByUsername} from "../Server/BackendCaregiverRequest";
import { getCaregivees } from "../Server/BackendCaregivee";
import { getCaregivers } from "../Server/BackendCaregiver";
import { getLocations } from "../Server/BackendLocation";
import getUserInfo from "../Server/BackendUserInfo";
import { useState, useEffect } from "react";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { Button, Menu, Divider, Provider,List } from 'react-native-paper';
const Tab = createBottomTabNavigator();

const CaregiverHomePage = (props) => {
  const { user } = props;
  const { parent } = props;
  const { logoutFunction } = props;
  const { email } = props;
  const accessToken = props.userToken;
  const [userInformation, setUserInformation] = useState();
  const [isParent, setIsParent] = useState(false);
  const [userEmail, setUserEmail] = useState();
  const [notifications, setNotifications] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [caregivees, setCaregivees] = useState([]);
  const [caregiveeRequests, setCaregiveeRequests] = useState([]);
  const [locations, setLocations] = useState([]);
  const [caregivers, setCaregivers] = useState([]);
  const [caregiverRequests, setCaregiverRequests] = useState([]);
  const [caregiverRequestsReceived, setCaregiverRequestsReceived] = useState(
    []
  );
  const [parentCaregivers, setParentCaregivers] = useState([]);
  const isFocused = useIsFocused();
  const navigation = useNavigation();

  const updateTasks = () => {
      getLocations(accessToken).then((loc) => {
        setLocations(loc ? loc : mockLocations);
      });
      getTasks(accessToken).then((tsk) => {
        setTasks(tsk ? tsk : mockTasks);
      });
  }
  const updateNotifications = () => {
      getNotifications(accessToken).then((notif) => {
        setNotifications(notif ? notif : mockNotifications);
      });
  }
  useEffect(() => {
    //get username from auth (pass through props)
    //also get jwt accessToken for secure access to the web server
    //get user info by username
    //weird promise structure because of the dependency chain in the function
    console.log(accessToken);
    setUserEmail(email);
    getUserInfo(accessToken).then((userInfo) => {
      console.log("User Info Loaded: Parent=" + JSON.stringify(userInfo))
      setIsParent(parent ? parent : false);

      //get caregiver permission info for user
      if (userInfo) {
        setUserInformation(userInfo);
        if (!parent) {
          //load caregiver requests received by username
          getCaregiverRequests(accessToken).then((caregiverReceived) =>
            setCaregiverRequestsReceived(
              caregiverReceived
                ? caregiverReceived
                : mockCaregiverRequestsReceived
            )
          );

          //load parent caregivers by username
          getParentCaregiversByUsername(user).then((caregiverParent) => {
            setParentCaregivers(
              caregiverParent ? caregiverParent : mockParentCaregivers
            );
          });
        } else {
          //load caregivers by username
          getCaregivers(accessToken).then((caregiverData) =>
            setCaregivers(caregiverData ? caregiverData : mockCaregivers)
          );

          getCaregiverRequestsSent(accessToken).then((caregiverRequests) =>
            setCaregiverRequests(
              caregiverRequests ? caregiverRequests : mockCaregiverRequests
            )
          );
        }
      }
      setCaregiverRequestsReceived(mockCaregiverRequestsReceived);
      setParentCaregivers(mockParentCaregivers);
      setCaregivers(mockCaregivers);
      setCaregiverRequests(mockCaregiverRequests);

      //load notifications
      getNotifications(accessToken).then((notif) => {
        setNotifications(notif ? notif : mockNotifications);
      });

      //load locations
      getLocations(accessToken).then((loc) => {
        setLocations(loc ? loc : mockLocations);
      });

      //load tasks
      getTasks(accessToken).then((tsk) => {
        setTasks(tsk ? tsk : mockTasks);
      });

      //load caregivee requests
      getCaregiveeRequestsSent(accessToken).then((request) => {
        setCaregiveeRequests(request ? request : mockRequests);
      });

      //load caregivees 
      getCaregivees(accessToken).then((caregivee) => {
        setCaregivees(caregivee ? caregivee : mockCaregivees);
      });
    });
  }, [isFocused]);

  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Dashboard"
        options={{ tabBarIcon: makeIconRender("home"), headerShown: false}}
      >
        {(props) => (
          <DashboardScreen
            {...props}
            notifications={notifications}
            logoutFunction={logoutFunction}
            userInformation={userInformation}
            email={userEmail}  
            isParent={isParent}
          ></DashboardScreen>
        )}
      </Tab.Screen>
      <Tab.Screen
        name="Send Notification"
        options={{ tabBarIcon: makeIconRender("send"), headerShown: false }}
      >
        {(props) => (
          <SendNotificationNavigator
            {...props}
            tasks={tasks}
            locations={locations}
            caregivees={caregivees}
            isParent={isParent}
            user={user}
            accessToken={accessToken}
            updateTasksHandler = {updateTasks}
            updateNotificationsHandler = {updateNotifications}
          ></SendNotificationNavigator>
        )}
      </Tab.Screen>
      <Tab.Screen
        name="Caregivees"
        options={{
          tabBarIcon: makeIconRender("account-circle"),
          headerShown: false,
        }}
      >
        {(props) => (
          <ManageCaregiveesScreen
            {...props}
            caregivees={caregivees}
            requests={caregiveeRequests}
            isParent={isParent}
            caregiverRequestsReceived={caregiverRequestsReceived}
            caregiverRequests={caregiverRequests}
            caregivers={caregivers}
            parentCaregivers={parentCaregivers}
            user={user}
            accessToken={accessToken}
          ></ManageCaregiveesScreen>
        )}
      </Tab.Screen>
      {parent ? 
      <Tab.Screen
        name="Caregivers"
        options={{
          tabBarIcon: makeIconRender("account-circle"),
          headerShown: false,
        }}
      >
        {(props) => (
          <ManageCaregiversParentNav
            {...props}
            caregiverRequests={caregiverRequests}
            caregivers={caregivers}
            accessToken={accessToken}
          ></ManageCaregiversParentNav>
        )}
      </Tab.Screen> : 
      <Tab.Screen
      name="Parents"
      options={{
        tabBarIcon: makeIconRender("account-circle"),
        headerShown: false,
      }}
    >
      {(props) => (
        <ManageCaregiversSecNav
          {...props}
          caregiverRequestsReceived={caregiverRequestsReceived}
          parentCaregivers={parentCaregivers}
          user={user}
          accessToken={accessToken}
        ></ManageCaregiversSecNav>
      )}
    </Tab.Screen>}
    </Tab.Navigator>
  );
};
export default CaregiverHomePage;

function makeIconRender(name) {
  return ({ color, size }) => (
    <MaterialCommunityIcons name={name} color={color} size={size} />
  );
}

//Mock Data Below

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
    dateStarted: new Date(2021, 10, 11, 2, 35, 33, 0),
    dateCompleted: new Date(2021, 10, 11, 2, 40, 21, 0),
  },
  {
    id: 3,
    name: "Eat Dinner",
    icon: "image",
    sentTo: "Caregivee1",
    dateSent: new Date(2021, 10, 11, 1, 0, 30, 0),
    dateStarted: new Date(2021, 10, 11, 1, 5, 30, 0),
    dateCompleted: null,
  },
  {
    id: 4,
    name: "Brush Teeth",
    icon: "image",
    sentTo: "Caregivee2",
    dateSent: new Date(2021, 10, 10, 2, 30, 30, 0),
    dateStarted: null,
    dateCompleted: null,
  },
  {
    id: 5,
    name: "Brush Teeth",
    icon: "image",
    sentTo: "Caregivee1",
    dateSent: new Date(2021, 10, 9, 2, 30, 30, 0),
    dateStarted: null,
    dateCompleted: null,
  },
  {
    id: 6,
    name: "Brush Teeth",
    icon: "image",
    sentTo: "Caregivee1",
    dateSent: new Date(2021, 10, 8, 2, 30, 30, 0),
    dateStarted: null,
    dateCompleted: null,
  },
  {
    id: 7,
    name: "Brush Teeth",
    icon: "image",
    sentTo: "Caregivee1",
    dateSent: new Date(2021, 10, 6, 2, 30, 30, 0),
    dateStarted: null,
    dateCompleted: null,
  },
  {
    id: 8,
    name: "Brush Teeth",
    icon: "image",
    sentTo: "Caregivee1",
    dateSent: new Date(2021, 9, 24, 2, 30, 30, 0),
    dateStarted: null,
    dateCompleted: null,
  },
];

const mockTasks = [
  {
    id: 1,
    name: "Turn off Lights",
    location: "Bathroom",
    description: "Flip the switch on the wall to turn off the lights.",
    icon: "image",
  },
  {
    id: 2,
    name: "Eat Dinner",
    location: "Kitchen",
    description: "Time to Eat Dinner.",
    icon: "image",
  },
  {
    id: 3,
    name: "Wash Hands",
    location: "Bathroom",
    description: "Wash hands in sink for 30 seconds.",
    icon: "image",
  },
  {
    id: 4,
    name: "Brush Teeth",
    location: "Bathroom",
    description: "Use toothpaste and toothbrush to brush teeth for 2 minutes.",
    icon: "image",
  },
];

const mockLocations = [
  {
    id: 1,
    name: "Kitchen",
  },
  {
    id: 2,
    name: "Bathroom",
  },
];

const mockCaregivees = [
  {
    id: 1,
    name: "Leo",
    icon: "account-circle",
    description: "General description of caregivee",
  },
  {
    id: 2,
    name: "Leo1",
    icon: "account-circle",
    description: "General description of caregivee",
  },
];
const mockCaregivers = [
  {
    id: 1,
    name: "Secondary Caregiver 1",
    icon: "account-circle",
    description: "A Secondary Caregiver (1) ",
    canEdit: false,
  },
  {
    id: 2,
    name: "Secondary Caregiver 2",
    icon: "account-circle",
    description: "A Secondary Caregiver (2) ",
    canEdit: false,
  },
];
const mockRequests = [
  {
    id: 1,
    sentToCaregivee: "Leo2",
    icon: "account-circle",
    description: "General description of caregivee",
    dateSent: new Date(2021, 10, 8, 2, 30, 30, 0),
  },
  {
    id: 2,
    sentToCaregivee: "Leo3",
    icon: "account-circle",
    description: "General description of caregivee",
    dateSent: new Date(2021, 10, 8, 2, 30, 30, 0),
  },
];
const mockCaregiverRequests = [
  {
    id: 1,
    name: "Secondary Caregiver 3",
    icon: "account-circle",
    description: "A Secondary Caregiver (3) ",
    dateSent: new Date(2021, 10, 8, 2, 30, 30, 0),
  },
];

const mockCaregiverRequestsReceived = [
  {
    id: 1,
    sentToCaregiver: "test caregiver",
    sentFromCaregiver: "Primary Caregiver",
    dateSent: new Date(2021, 10, 11, 2, 30, 30, 0),
  },
];

const mockParentCaregivers = [
  {
    id: 1,
    name: "Parent Caregiver",
    icon: "account-circle",
    description: "A parent caregiver",
  },
];
