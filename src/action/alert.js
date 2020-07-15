import {Alert} from 'react-native';

export function info(title, message) {
  Alert.alert(title, message);
}

export function error({title, message, err}) {
  Alert.alert(title, message || err.message);
  console.error(err);
}
