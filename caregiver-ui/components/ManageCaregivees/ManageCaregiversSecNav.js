import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import CaregiveePrimary from "./CaregiveePrimary";
import CaregiverPrimary from "./CaregiverPrimary";
import ManageCaregivees from "./ManageCaregivees";
import { LogBox } from "react-native";
import ManageCaregiversSecondary from "./ManageCaregiversSecondary";
LogBox.ignoreLogs([
  "Non-serializable values were found in the navigation state",
]);
const Stack = createStackNavigator();

export default function ManageCaregiversSecNav(props) {
  const { parentCaregivers } = props;
  const { caregiverRequestsReceived } = props;
  const { user } = props;
  const { accessToken } = props;
  return (
    <Stack.Navigator>
      <Stack.Screen name="Parent Caregivers" options={{headerLeft: () => null}}>
        {(props) => (
          <ManageCaregiversSecondary
            {...props}
            parentCaregivers={parentCaregivers} 
            caregiverRequestsReceived={caregiverRequestsReceived}
            user={user}
            accessToken={accessToken}
          ></ManageCaregiversSecondary>
        )}
      </Stack.Screen>
      <Stack.Screen name="Caregiver Primary" component={CaregiverPrimary} />
    </Stack.Navigator>
  );
}
