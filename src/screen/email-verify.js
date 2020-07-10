import React from 'react';
import {StyleSheet, Button, View, Text} from 'react-native';
import {observer} from 'mobx-react';

import {TextInput} from '../component/input';

import store from '../store';
import * as userId from '../action/user-id';

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

const EmailVerifyScreen = () => (
  <View style={styles.wrapper}>
    <Text style={styles.h1}>Enter the code sent to {store.userId.email}</Text>
    <TextInput
      placeholder="code"
      keyboardType="number-pad"
      autoFocus
      style={styles.input}
      value={store.userId.code}
      onChangeText={code => userId.setCode(code)}
    />
    <View style={styles.btnWrapper}>
      <Button
        title="Next"
        style={styles.btnNext}
        onPress={() => userId.validateEmailCode()}
      />
    </View>
  </View>
);

export default observer(EmailVerifyScreen);
