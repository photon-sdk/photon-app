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

const EmailSetScreen = () => (
  <View style={styles.wrapper}>
    <Text style={styles.h1}>Enter your email address</Text>
    <TextInput
      placeholder="email"
      keyboardType="email-address"
      autoFocus
      style={styles.input}
      value={store.userId.email}
      onChangeText={email => userId.setEmail(email)}
    />
    <View style={styles.btnWrapper}>
      <Button
        title="Next"
        style={styles.btnNext}
        onPress={() => userId.initPinSet()}
      />
    </View>
  </View>
);

export default observer(EmailSetScreen);
