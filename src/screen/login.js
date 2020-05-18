import React from 'react';
import {StyleSheet, Button, View, Text} from 'react-native';
import {TextInput} from '../component/input';

import {store, setPhone, checkForBackup} from '../action/wallet';

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    padding: 15,
  },
  h1: {
    fontSize: 30,
  },
  input: {
    marginTop: 30,
    fontSize: 20,
    height: 20,
  },
  btnWrapper: {
    flex: 1,
    marginTop: 50,
  },
  btnNext: {
    alignSelf: 'flex-end',
  },
});

const LoginScreen = ({navigation}) => {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.h1}>Enter your phone number</Text>
      <TextInput
        placeholder="phone"
        keyboardType="phone-pad"
        style={styles.input}
        autoFocus
        value={store.phone}
        onChangeText={phone => setPhone(phone)}
      />
      <View style={styles.btnWrapper}>
        <Button
          title="Next"
          style={styles.btnNext}
          onPress={async () => {
            await checkForBackup();
            navigation.navigate('Verify');
          }}
        />
      </View>
    </View>
  );
};

export default LoginScreen;
