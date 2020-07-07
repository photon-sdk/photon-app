import React from 'react';
import {StyleSheet, Button, View, Text} from 'react-native';
import {observer} from 'mobx-react';

import {TextInput} from '../component/input';

import store from '../store';
import * as backup from '../action/backup';

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

const RestoreScreen = () => (
  <View style={styles.wrapper}>
    <Text style={styles.h1}>Enter your PIN</Text>
    <TextInput
      placeholder="PIN"
      keyboardType="number-pad"
      textContentType="password"
      secureTextEntry
      autoFocus
      style={styles.input}
      value={store.pin}
      onChangeText={pin => backup.setPin(pin)}
    />
    <View style={styles.btnWrapper}>
      <Button
        title="Next"
        style={styles.btnNext}
        onPress={() => backup.checkPin()}
      />
    </View>
  </View>
);

export default observer(RestoreScreen);
