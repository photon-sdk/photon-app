import React from 'react';
import {StyleSheet, Button, View, Text} from 'react-native';
import {observer} from 'mobx-react';

import {TextInput} from '../component/input';

import store from '../store';
import * as wallet from '../action/wallet';

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

const VerifyScreen = () => (
  <View style={styles.wrapper}>
    <Text style={styles.h1}>Enter the code sent to {store.phone}</Text>
    <TextInput
      keyboardType="number-pad"
      style={styles.input}
      autoFocus
      value={store.code}
      onChangeText={code => wallet.setCode(code)}
    />
    <View style={styles.btnWrapper}>
      <Button
        title="Next"
        style={styles.btnNext}
        onPress={() => wallet.checkCode()}
      />
    </View>
  </View>
);

export default observer(VerifyScreen);
