import { useIsFocused } from '@react-navigation/native';
import * as React from 'react';
import { useState } from 'react';
import { ListItem } from 'react-native-elements'

const CaregiveeCheckboxItem = (props) => {
    const [isChecked, setIsChecked] = useState(false);
    const {item} = props;
    const {changeCaregivee} = props;
    const {checkCaregivee} = props;
    const isFocused = useIsFocused();

    const onPress = (item) => {
        setIsChecked(!isChecked);
        changeCaregivee(item);
    }

    React.useEffect(() => {
        setIsChecked(checkCaregivee(item.id));
    }, [isFocused]);

    return (
        <ListItem bottomDivider onPress={() => onPress(item)}>
            <ListItem.CheckBox checked={isChecked} onPress={() => onPress(item)}/>
            <ListItem.Content>
                <ListItem.Title>{item.name}</ListItem.Title>
            </ListItem.Content>
        </ListItem>
    );
  }

  export default CaregiveeCheckboxItem;