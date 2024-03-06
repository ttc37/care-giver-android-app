import * as React from 'react';
import { StyleSheet, Text, View, TextInput, Image, FlatList } from 'react-native';
import { Icon, ListItem } from 'react-native-elements';
import getNotificationStatus from '../CaregiverDashboard/GetNotificationStatus';


const CaregiverProfile = ({route}) => {
    const userInfo = route.params.userInfo;
    const email = route.params.email;
    const styles = StyleSheet.create({
        notes: {
            borderWidth: 1,
            height: 150,
            padding: 5,
            margin: 15
        },
        text2: {
            textAlign: 'center',
            padding: 5,
            fontSize:15
        },
        text: {
            textAlign: 'center',
            padding: 5,
            fontSize: 25
        }
      });

    return (
    <View style = {{flex: 1}}> 
        <Text style={styles.text}>{'Name: ' + userInfo.username}</Text>
        <Text style={styles.text}>{'Email: ' + email}</Text>
    </View>
    );
}



export default CaregiverProfile;