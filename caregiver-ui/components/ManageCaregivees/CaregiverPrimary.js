import * as React from 'react';
import { StyleSheet, Text, View, TextInput, Image, FlatList } from 'react-native';
import { Icon } from 'react-native-elements';


const CaregiverPrimary = ({route}) => {
    const caregiver = route.params.caregiver;

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
        <Icon name={caregiver.icon} size={100}></Icon>
        <Text style={styles.text}>{caregiver.name}</Text>
        <Text style={styles.text2}>{caregiver.description}</Text>
    </View>
    );
}



export default CaregiverPrimary;