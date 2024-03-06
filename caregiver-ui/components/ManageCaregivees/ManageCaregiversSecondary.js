import * as React from 'react';
import { StyleSheet, Text, View, TextInput, FlatList, Alert } from 'react-native';
import { useState } from 'react';
import { ListItem, Icon } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import TimeAgo from 'react-native-timeago';
import { Button } from 'react-native-elements';
import { createCaregiverCaregiverConnection } from '../Server/BackendCaregiver';

const ManageCaregiversSecondary = (props) => {
    const {parentCaregivers} = props;
    const {caregiverRequestsReceived} = props;
    const { user } = props;
    const { accessToken } = props;
    const navigation = useNavigation();

    const styles = StyleSheet.create({
        email: {
          fontSize: 20,
          marginLeft: 10,
          marginTop: 20,
          marginBottom: 5,
          height: 40,
          margin: 12,
          borderWidth: 1,
          padding: 10,
          width: "75%"
        },
        text: {
          fontSize: 20,
          marginLeft: 10,
          marginTop: 5,
          marginBottom: 5
        },
        list: {
            alignSelf: 'center',
            flex: 3
        },
        listItem: {
          height: 30
        },
        item: {
          marginTop: 5
        },
        row: {
          width: "100%",
          flexDirection: 'row'
        },
        button: {
          width: "100%",
          marginTop: 20
        },
        timeAgo: {
          fontSize:12
        },
      });

      const acceptRequest = (requestAccepted) => {
        let caregiver = {
          name: requestAccepted.sentToCaregiver,
          parentCaregiver: requestAccepted.sentFromCaregiver,
          userName: user,
          canEdit: false
        }
        createCaregiverCaregiverConnection(caregiver, accessToken);
        console.log("Request Accepted!");
      }

    return (
        <View style = {{flex: 1}}> 
          <Text style = {styles.text}>Parent Caregivers </Text>
          <FlatList
            data = {parentCaregivers}
            renderItem = {({item}) => (
              <ListItem style={styles.item} bottomDivider onPress={() => navigation.navigate('Caregiver Primary', {'caregiver':item})}>
                <Icon name={item.icon} />
                <ListItem.Content style={styles.listItem}>
                  <ListItem.Title>{item.name}</ListItem.Title>
                </ListItem.Content>
              </ListItem>
            )}
            keyExtractor={item => item.id}
          />
          <Text style = {styles.text}>Requests Received</Text>
          <FlatList
            data={caregiverRequestsReceived}
            renderItem={({item}) => (
              <ListItem bottomDivider>
                <ListItem.Content>
                  <ListItem.Title>{item.sentFromCaregiver}</ListItem.Title>
                  <ListItem.Subtitle>{item.sentFromCaregiver} has requested to add you to their caregiver network</ListItem.Subtitle>
                  <ListItem.Subtitle><TimeAgo style={styles.timeAgo} time={item.dateSent}/></ListItem.Subtitle>
                  <Button
                    title="Accept"
                    onPress={() => acceptRequest(item)}
                    style={styles.button}
                    icon={{
                      name: 'checkcircle',
                      type: 'antdesign',
                      size: 20,
                      color: 'white',
                    }}
                    buttonStyle={{
                      backgroundColor: 'rgba(27, 181, 91, 1)',
                      borderRadius: 15,
                      height: 50,
                      width: 200,
                      marginTop: 10
                    }}
                  />
                  </ListItem.Content>
                  <ListItem.Chevron />
                </ListItem>
            )}
            keyExtractor={item => item.id}
          />
        </View>
    );
  }

  export default ManageCaregiversSecondary;