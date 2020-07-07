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

const BackupScreen = () => (
  <View style={styles.wrapper}>
    <Text style={styles.h1}>Please set a new PIN</Text>
    <TextInput
      placeholder="Set PIN"
      keyboardType="number-pad"
      textContentType="newPassword"
      secureTextEntry
      autoFocus
      style={styles.input}
      value={store.pin}
      onChangeText={pin => backup.setPin(pin)}
    />
    <TextInput
      placeholder="Verify PIN"
      keyboardType="number-pad"
      textContentType="newPassword"
      secureTextEntry
      style={styles.input}
      value={store.pinCheck}
      onChangeText={pin => backup.setPinCheck(pin)}
    />
    <View style={styles.btnWrapper}>
      <Button
        title="Next"
        style={styles.btnNext}
        onPress={() => backup.checkNewPin()}
      />
    </View>
  </View>
);

export default observer(BackupScreen);
