import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { LogBox, View, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements'
import CreateTask from './CreateTask'
import SendNotification from './SendNotification';
import SelectTask from './SelectTask';
import EditTask from './EditTask';
import { useState } from 'react';

LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state',
   ]);
const Stack = createStackNavigator();

export default function SendNotificationNavigator(props) {
  const {locations} = props;
  const {tasks} = props;
  const {caregivees} = props;
  const {isParent} = props;
  const {accessToken} = props;
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const {user} = props;
  const {updateNotificationsHandler }= props;
  const {updateTasksHandler} = props;


  const styles = StyleSheet.create({
    buttonDisabled: {
      marginRight:20,
      opacity:0.5
    },
    buttonEnabled: {
      marginRight:20,
      opacity:1
    }
  });

  const editButtonPressed = () => {
    setIsDeleteMode(false);
    setIsEditMode(!isEditMode);
  }
  const deleteButtonPressed = () => {
    setIsEditMode(false);
    setIsDeleteMode(!isDeleteMode);
  }

    return (
      <Stack.Navigator>
        <Stack.Screen name="New Notification" options={{headerLeft: () => null}}>
          {(props) => <SendNotification {...props} updateNotificationsHandler={updateNotificationsHandler} caregivees={caregivees} user={user} accessToken={accessToken}></SendNotification>}
        </Stack.Screen>
        <Stack.Screen name="Create Task">
          {(props) => <CreateTask {...props} user={user} accessToken={accessToken} updateTasksHandler={updateTasksHandler}></CreateTask>}
        </Stack.Screen>
        <Stack.Screen name="Select Task" options={{
          headerRight: () => (
            <View style={{flexDirection:"row"}}>
            <Icon
              name="edit"
              type="MaterialIcons"
              onPress={()=>editButtonPressed()}
              iconStyle={isEditMode ? styles.buttonEnabled : styles.buttonDisabled}
              />
            <Icon
              name="delete"
              type="MaterialIcons"
              onPress={()=>deleteButtonPressed()}
              iconStyle={isDeleteMode ? styles.buttonEnabled : styles.buttonDisabled}
            />
            </View>
          ),
        }}>
          {(props) => <SelectTask {...props} locations={locations} 
                        tasks={tasks} 
                        isParent={isParent} 
                        isEditMode={isEditMode} 
                        isDeleteMode={isDeleteMode}
                        updateTasksHandler={updateTasksHandler}
                        accessToken={accessToken}
                        ></SelectTask>}
        </Stack.Screen>
        <Stack.Screen name="Edit Task">
          {(props) => <EditTask {...props} accessToken={accessToken} updateTasksHandler={updateTasksHandler}></EditTask>}
        </Stack.Screen>
      </Stack.Navigator>
    );
  }