import * as React from 'react';
import { useState } from 'react';
import { Text, View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { ListItem, Icon, Avatar } from 'react-native-elements'
import { Button } from 'react-native-elements'
import { useNavigation } from '@react-navigation/native';
import { BackgroundImage } from 'react-native-elements/dist/config';
import LocationDropdown from './LocationDropdown';
import { deleteTask } from '../Server/BackendTask';
import { Storage } from "aws-amplify";
import TaskListItem from './TaskListItem';

const SelectTask = (props) => {

  const {route} = props;
  const {locations} = props;
  const {tasks} = props;
  const {isEditMode} = props;
  const {isDeleteMode} = props;
  const navigation = useNavigation();
  const [selectedLocation, setSelectedLocation] = useState(null);
  const {updateTasksHandler} = props;
  const {accessToken} = props;

  const styles = StyleSheet.create({
    timeAgo: {
      fontSize:12
    },
    notificationHeader: {
      fontSize: 18,
      marginLeft: 10
    },
    touchableOpacityStyle: {
      position: 'absolute',
      width: 50,
      height: 50,
      alignItems: 'center',
      justifyContent: 'center',
      right: 30,
      bottom: 30,
      color: "#00aced"
    },
    floatingButtonStyle: {
      resizeMode: 'contain',
      width: 50,
      height: 50,
      //backgroundColor:'black'
    },
  });
  
  const goBack = (item, imageUrl) => {
      route.params.onGoBack(item, imageUrl);
      navigation.goBack();
  }

  const taskdeletion = (task) => {
    deleteTask(task, accessToken).then(() => {
      updateTasksHandler();
    });
    console.log(`${task.name} deleted`);
  }

  const changeSelectedLocation = (item) => {
    let newLocation = locations.find(loc => loc.id == item);
    setSelectedLocation(newLocation);
  }
  console.log("locations: " + JSON.stringify(locations));
  console.log("tasks: " + JSON.stringify(tasks));
  if (locations.length == 0){
    locations.push("");
  }
  return (
    <View style={{flex: 1}}>
      <LocationDropdown locations={locations} changeLocation={(item) => changeSelectedLocation(item)}></LocationDropdown>
      <FlatList
        data={selectedLocation ? [selectedLocation] : locations}
        renderItem={({item}) => (
          <View>
            <Text style={styles.notificationHeader}>{item.name}</Text>
            <FlatList
              data={tasks.filter(task => task.location == item.name)}
              renderItem={({item}) => (
                <TaskListItem task={item} goBack={goBack} isEditMode={isEditMode} isDeleteMode={isDeleteMode} taskdeletion={taskdeletion} ></TaskListItem>
              )}
              keyExtractor={item => item.id}
            />
          </View>
        )}
        keyExtractor={loc => loc.id}
      />
      <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.navigate('Create Task')}
          style={styles.touchableOpacityStyle}>
          <Icon
            reverse
            name="add"
            color='#00aced'
            style={styles.floatingButtonStyle}
          />
        </TouchableOpacity>
    </View>
  );
}

export default SelectTask;
