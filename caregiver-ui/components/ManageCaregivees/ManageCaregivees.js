import * as React from 'react';
import { StyleSheet, Text, View, TextInput, FlatList, Alert } from 'react-native';
import { useState } from 'react';
import { ListItem, Icon, Button, Tab, TabView } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { sendCaregiveeRequest } from '../Server/BackendCaregiveeRequest';

const ManageCaregivees = (props) => {
    const {isParent} = props;
    const {accessToken} = props;
    const {user} = props;
    const {activeCaregivees} = props;
    const {activeCaregivers} = props;
    const {requestsSent} = props;
    const {requestsSentCaregivers} = props;
    const {parentCaregivers} = props;
    const {caregiverRequestsReceived} = props;
    const [caregiveeEmail, setCaregiveeEmail] = useState('');
    const navigation = useNavigation();
    const [index, setIndex] = React.useState(0);

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
        flexDirection: 'row'
      },
      button: {
        marginTop: 20
      }
    });
    const reset = () => {
      setCaregiveeEmail("");
      setCaregiverEmail("");
    }

    const sendRequest = () => {
      if(caregiveeEmail)
      {
        try {
          let request = {
            requestToEmail: caregiveeEmail,
            requestFrom: user
          };
          sendCaregiveeRequest(request, accessToken);
          Alert.alert(
            'Request Sent',
            `Request has been sent to the caregivee's device. You can accept the request by logging into the caregivee's account and pressing the accept button.`,
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
          "Please Enter a Caregivee's Email",
          [
            { text: "OK" }
          ]
        );
      }
    }

    return (
    <View style = {{flex: 1}}> 
      <View style = {{flex: 1}}> 
          {isParent ? 
            <View style={styles.row}>
              <TextInput
              onChangeText={setCaregiveeEmail}
              value={caregiveeEmail}
              placeholder="Caregivee email"
              style={styles.email}
              />
              <Button onPress={sendRequest} buttonStyle={styles.button} icon={<Icon name="add" color="#FFFFFF"/>}></Button>
            </View>
            :
            <></>
          }
        <Text style = {styles.text}>Active Caregivees </Text>
        <FlatList
          data = {activeCaregivees}
          renderItem = {({item}) => (
            <ListItem style={styles.item} bottomDivider onPress={() => navigation.navigate('Caregivee Primary', {'caregivee':item})}>
              <Icon name={item.icon} />
              <ListItem.Content style={styles.listItem}>
                <ListItem.Title>{item.name}</ListItem.Title>
              </ListItem.Content>
            </ListItem>
          )}
          keyExtractor={item => item.id}
        />
        <Text style = {styles.text}>Requests Sent</Text>
        <FlatList 
          data = {requestsSent}
          renderItem = {({item}) => (
            <ListItem style={styles.item} bottomDivider onPress={() => navigation.navigate('Caregivee Primary', {'caregivee':item})}>
              <Icon name={item.icon} />
              <ListItem.Content style={styles.listItem}>
                <ListItem.Title>{item.sentToCaregivee}</ListItem.Title>
              </ListItem.Content>
            </ListItem>
          )}
          keyExtractor={item => item.id}
        />
      </View>
    </View>
    );
}

export default ManageCaregivees;