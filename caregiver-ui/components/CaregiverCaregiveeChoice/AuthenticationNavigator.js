
import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AuthenticationWrapper from './AuthenticationWrapper'
import CaregiverCaregiveeChoice from './CaregiverCaregiveeChoice';
import { useIsFocused, useNavigation } from "@react-navigation/native";
import CaregiverProfile from './CaregiverProfile';
import { LogBox, View, StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';
import { styles } from 'react-native-element-dropdown/src/TextInput/styles';
import CaregiveeProfile from './CaregiveeProfile';
import ParentProfile from './ParentProfile';
LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state',
   ]);
const Stack = createStackNavigator();


export default function AuthenticationNavigator(props) {
  const {logoutFunction} = props;
  const navigation = useNavigation();

  const styles = StyleSheet.create({
    logoutButton: {
      marginRight: 20
    }
  });
  const logout = () => {
    logoutFunction();
    navigation.navigate("CaregiverCaregiveeChoice");
  }
    return (
      <Stack.Navigator>
        <Stack.Screen name="CaregiverCaregiveeChoice" options={{headerShown: false}}>
          {(props) => <CaregiverCaregiveeChoice {...props} logoutFunction={logoutFunction}></CaregiverCaregiveeChoice>}
        </Stack.Screen>
        <Stack.Screen name="AuthenticationWrapper" options={{ headerShown: false , isCaregiver: false, isParent: false}}>
          {(props) => <AuthenticationWrapper {...props} logoutFunction={logoutFunction}></AuthenticationWrapper>}
        </Stack.Screen>
        <Stack.Screen name="Caregiver Profile" component={CaregiverProfile} options={{ headerShown: true, headerRight: () => (
          <Button onPress={() => logout()} title={'Log Out'} style={styles.logoutButton}></Button>
        ) }}>
        </Stack.Screen>
        <Stack.Screen name="Parent Profile" component={ParentProfile} options={{ headerShown: true, headerRight: () => (
          <Button onPress={() => logout()} title={'Log Out'} style={styles.logoutButton}></Button>
        ) }}>
        </Stack.Screen>
        <Stack.Screen name="Caregivee Profile" component={CaregiveeProfile} options={{ headerShown: true, headerRight: () => (
          <Button onPress={() => logout()} title={'Log Out'} style={styles.logoutButton}></Button>
        ) }}>
        </Stack.Screen>
      </Stack.Navigator>
    );
  }