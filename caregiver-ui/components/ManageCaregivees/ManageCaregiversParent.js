import * as React from 'react';
import { StyleSheet, Text, View, TextInput, FlatList } from 'react-native';
import { useState } from 'react';
import { ListItem, Icon, Button} from 'react-native-elements';
import CaregiverCheckboxItem from './CaregiverCheckboxItem';
import { useNavigation } from '@react-navigation/native';

const ManageCaregiversParent = (props) => {
    const {activeCaregivers} = props;
    const {requestsSentCaregivers} = props;
    const {accessToken} = props;
    const [caregiverEmail, setCaregiverEmail] = useState('');
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
          marginTop: 20
        },
        column2: {
            fontSize: 17,
            marginLeft: 220,
            marginTop: 9,
            marginBottom: 5
        }
      });

      const sendRequestCaregiver = () => {
        if(caregiverEmail)
        {
          try {
            let request = {
              requestToEmail: caregiverEmail
            };
            sendCaregiverRequest(request, accessToken);
            Alert.alert(
              'Request Sent',
              `Request sent to ${caregiverEmail}`,
              [
                { text: "OK", onPress: () => reset() }
              ]
            );
          } catch {
            console.log("Error Sending Request");
          }
        } else
        {
          Alert.alert(
            "No Email Entered",
            "Please Enter a Caregiver's Email",
            [
              { text: "OK" }
            ]
          );
        }
      }

    return (
        <View style = {{flex: 1}}> 
          <View style={styles.row}>
            <TextInput
            onChangeText={setCaregiverEmail}
            value={caregiverEmail}
            placeholder="Caregiver email"
            style={styles.email}
            />
            <Button onPress={sendRequestCaregiver} buttonStyle={styles.button} icon={<Icon name="add" color="#FFFFFF"/>}></Button>
          </View>
          <View style={styles.row}>
            <Text style = {styles.text}>Caregivers </Text>
            <Text style = {styles.column2}>Can edit?</Text>
          </View>
          <FlatList
            data = {activeCaregivers}
            renderItem = {({item}) => (
              <CaregiverCheckboxItem item={item} accessToken={accessToken}></CaregiverCheckboxItem>
            )}
            keyExtractor={item => item.id}
          />
          <Text style = {styles.text}>Requests Sent</Text>
          <FlatList 
            data = {requestsSentCaregivers}
            renderItem = {({item}) => (
              <ListItem style={styles.item} bottomDivider onPress={() => navigation.navigate('Caregiver Primary', {'caregiver':item})}>
                <Icon name={item.icon} />
                <ListItem.Content style={styles.listItem}>
                  <ListItem.Title>{item.sentToCaregiver}</ListItem.Title>
                </ListItem.Content>
              </ListItem>
            )}
            keyExtractor={item => item.id}
          />
        </View>
    );
  }

  export default ManageCaregiversParent;