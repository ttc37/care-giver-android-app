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

const TaskListItem = (props) => {
    const {task} = props;
    const {goBack} = props;
    const {taskdeletion} = props;
    const navigation = useNavigation();
    const {isEditMode} = props;
    const {isDeleteMode} = props;
    const [imageUrl, setImageUrl] = React.useState();
    const getImageUrl = (name) => {
        Storage.get(name, {
          level: 'public',
          bucket: 'caregiver-android',
          region: 'us-east-1',
        })
          .then(result => {
            console.log(result);
            setImageUrl(result);
          })
          .catch(err => {
            console.log(err);
          });
      }
    React.useEffect(() => {
        getImageUrl(`${task.image_url}`);
      }, []);
    return (
        <ListItem bottomDivider onPress={() => goBack(task, imageUrl)}>
            <Avatar source={{uri: imageUrl}} imageProps={{ resizeMode: "contain"}} />
            <ListItem.Content>
            <ListItem.Title>{task.name}</ListItem.Title>
            </ListItem.Content>
            {
            isEditMode ?
            <Icon
                name="edit"
                type="MaterialIcons"
                onPress={() => navigation.navigate('Edit Task', {'task': task})}
            /> : isDeleteMode ?
            <Icon
                name="delete"
                type="MaterialIcons"
                onPress={() => taskdeletion(task)}
            /> :
            <ListItem.Chevron />
            }
        </ListItem>
    )
}
export default TaskListItem;