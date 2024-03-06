import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import CaregiveePrimary from "./CaregiveePrimary";
import CaregiverPrimary from "./CaregiverPrimary";
import ManageCaregivees from "./ManageCaregivees";
import ManageCaregiversParent from "./ManageCaregiversParent";
import { LogBox } from "react-native";
LogBox.ignoreLogs([
  "Non-serializable values were found in the navigation state",
]);
const Stack = createStackNavigator();

export default function ManageCaregiversParentNav(props) {
  const { caregivers } = props;
  const { caregiverRequests } = props;
  const { accessToken } = props;
  return (
    <Stack.Navigator>
      <Stack.Screen name="Manage Caregivers" options={{headerLeft: () => null}}>
        {(props) => (
          <ManageCaregiversParent
            {...props}
            activeCaregivers={caregivers} 
            requestsSentCaregivers={caregiverRequests} 
            accessToken={accessToken}
          ></ManageCaregiversParent>
        )}
      </Stack.Screen>
      <Stack.Screen name="Caregiver Primary" component={CaregiverPrimary} />
    </Stack.Navigator>
  );
}
