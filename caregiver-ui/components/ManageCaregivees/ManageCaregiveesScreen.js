import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import CaregiveePrimary from "./CaregiveePrimary";
import CaregiverPrimary from "./CaregiverPrimary";
import ManageCaregivees from "./ManageCaregivees";
import { LogBox } from "react-native";
LogBox.ignoreLogs([
  "Non-serializable values were found in the navigation state",
]);
const Stack = createStackNavigator();

export default function ManageCaregiveesScreen(props) {
  const { caregivees } = props;
  const { requests } = props;
  const { isParent } = props;
  const { caregivers } = props;
  const { caregiverRequests } = props;
  const { parentCaregivers } = props;
  const { caregiverRequestsReceived } = props;
  const { user } = props;
  const { accessToken } = props;
  return (
    <Stack.Navigator>
      <Stack.Screen name="Manage Caregivees" options={{headerLeft: () => null}}>
        {(props) => (
          <ManageCaregivees
            {...props}
            activeCaregivees={caregivees}
            requestsSent={requests}
            isParent={isParent}
            activeCaregivers={caregivers}
            requestsSentCaregivers={caregiverRequests}
            parentCaregivers={parentCaregivers}
            caregiverRequestsReceived={caregiverRequestsReceived}
            user={user}
            accessToken={accessToken}
          ></ManageCaregivees>
        )}
      </Stack.Screen>
      <Stack.Screen name="Caregivee Primary" component={CaregiveePrimary} />
    </Stack.Navigator>
  );
}
