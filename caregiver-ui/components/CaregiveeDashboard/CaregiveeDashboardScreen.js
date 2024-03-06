import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import CaregiveeDashboard from "./CaregiveeDashboard";
import NotificationPrimary from "./NotificationPrimary";
import NotificationReward from "./NotificationReward";
import { LogBox, View, StyleSheet } from 'react-native';
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { Icon, BottomSheet, ListItem } from 'react-native-elements';
LogBox.ignoreLogs([
  "Non-serializable values were found in the navigation state",
]);
const Stack = createStackNavigator();

export default function CaregiveeDashboardScreen(props) {
  const { notifications } = props;
  const { requests } = props;
  const { reloadRequests } = props;
  const { user } = props;
  const { accessToken } = props;
  const { updateNotificationsHandler} = props;
  const { userInformation } = props;
  const { logoutFunction } = props;
  const { email } = props;
  const navigation = useNavigation();
  const [visible, setVisible] = React.useState(false);
  const logout = () => {
    logoutFunction();
    setVisible(false);
    navigation.navigate("CaregiverCaregiveeChoice");
  }
  const styles = StyleSheet.create({
    profileIcon: {
      title: 'Aligned Center',
      headerTitleAlign: 'center',
      marginRight: 20
    }
  });


  const list = [
    {
      title: 'Profile',
      onPress: () => {
        setVisible(false);
        navigation.navigate('Caregivee Profile', {userInfo: userInformation, email: email});
      }
    },
    {
      title: 'Logout',
      onPress: () => logout(),
    },
    {
      title: 'Cancel',
      containerStyle: { backgroundColor: 'red' },
      titleStyle: { color: 'white' },
      onPress: () => setVisible(false),
    },

  ];
  return (
    <Stack.Navigator>
      <Stack.Screen name="Caregivee Dashboard" options={{ headerRight: () => (
          <View style={{flexDirection:"row"}}>
          <Icon name="account-circle" style={styles.profileIcon} type="materialicons" size={30} onPress={() => setVisible(!visible)}></Icon>
          <BottomSheet modalProps={{}} isVisible={visible}>
          {list.map((l, i) => (
            <ListItem
              key={i}
              containerStyle={l.containerStyle}
              onPress={l.onPress}
            >
              <ListItem.Content>
                <ListItem.Title style={l.titleStyle}>{l.title}</ListItem.Title>
              </ListItem.Content>
            </ListItem>
          ))}
          </BottomSheet>
          </View>
        )}}>
        {(props) => (
          <CaregiveeDashboard
            {...props}
            notifications={notifications}
            requests={requests}
            reloadRequests={reloadRequests}
            user={user}
            accessToken={accessToken}
            updateNotificationsHandler={updateNotificationsHandler}
          ></CaregiveeDashboard>
        )}
      </Stack.Screen>
      <Stack.Screen
        name="Notification Primary"
        component={NotificationPrimary}
        options={{ accessToken: null }}
      />
      <Stack.Screen name="Notification Reward" component={NotificationReward} />
    </Stack.Navigator>
  );
}
