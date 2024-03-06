import { useIsFocused } from '@react-navigation/native';
import * as React from 'react';
import { useState } from 'react';
import { ListItem, Icon } from 'react-native-elements'
import { updateCaregiver } from '../Server/BackendCaregiver';
import { StyleSheet } from 'react-native';

const CaregiverCheckboxItem = (props) => {
    const [isChecked, setIsChecked] = useState(false);
    const {item} = props;
    const { accessToken } = props;
    const isFocused = useIsFocused();
    const navigation = props.navigation;
    console.log(props);
    const onPress = () => {
        setIsChecked(!isChecked);
        updatePermissions();
    }

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
        }
      });

    const updatePermissions = () => {
        let newCaregiver = {
            id: item.id,
            name: item.name,
            icon: item.icon,
            description: item.description,
            canEdit: !item.canEdit
        };

        updateCaregiver(newCaregiver, accessToken);
    }

    React.useEffect(() => {
        setIsChecked(item.canEdit);
    }, [isFocused]);

    return (
        <ListItem style={styles.item} bottomDivider onPress={() => navigation.navigate('Caregiver Primary', {'caregiver':item})}>
            <Icon name={item.icon} />
            <ListItem.Content style={styles.listItem}>
                <ListItem.Title>{item.name}</ListItem.Title>
            </ListItem.Content>
            <ListItem.CheckBox checked={isChecked} onPress={() => onPress()}/>
        </ListItem>
    );
  }

  export default CaregiverCheckboxItem;