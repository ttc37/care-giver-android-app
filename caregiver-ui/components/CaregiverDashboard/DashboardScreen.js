import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Dashboard from './Dashboard'
import NotificationDetails from './NotificationDetails'
import { LogBox, View, StyleSheet } from 'react-native';
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { Icon, BottomSheet, ListItem } from 'react-native-elements';
LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state',
   ]);
const Stack = createStackNavigator();

export default function DashboardScreen(props) {
  const {notifications} = props;
  const {logoutFunction} = props;
  const {userInformation} = props;
  const {email} = props;
  const {isParent} = props;
  const [visible, setVisible] = React.useState(false);
  const navigation = useNavigation();

  const openMenu = () => setVisible(true);

  const closeMenu = () => setVisible(false);

  const logout = () => {
    logoutFunction();
    setVisible(false);
    navigation.navigate("CaregiverCaregiveeChoice");
  }

  const styles = StyleSheet.create({
    profileIcon: {
      marginRight: 20
    }
  });

  const list = [
    {
      title: 'Profile',
      onPress: () => {
        setVisible(false);
        if(isParent)
        {
          navigation.navigate('Parent Profile', {userInfo: userInformation, email: email});
        }
        else
        {
          navigation.navigate('Caregiver Profile', {userInfo: userInformation, email: email});
        }
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
        <Stack.Screen name="Caregiver Dashboard" options={{ headerLeft: () => null, headerRight: () => (
          <View style={{flexDirection:"row"}}>
          <Icon name="account-circle" iconStyle={styles.profileIcon} type="materialicons" size={30} onPress={() => setVisible(!visible)}></Icon>
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
          {(props) => <Dashboard {...props} notifications={notifications}></Dashboard>}
        </Stack.Screen>
        <Stack.Screen name="Notification Details" component={NotificationDetails} />
      </Stack.Navigator>
    );
  }