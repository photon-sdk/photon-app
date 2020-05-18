import React from 'react';
import {StyleSheet, Button, View, Text} from 'react-native';
import {TextInput} from '../component/input';

import {store, setCode, verifyCode} from '../action/wallet';

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

const VerifyScreen = ({navigation}) => {
  const {phone} = store;
  return (
    <View style={styles.wrapper}>
      <Text style={styles.h1}>Enter the code sent to {phone}</Text>
      <TextInput
        keyboardType="number-pad"
        style={styles.input}
        autoFocus
        onChangeText={code => setCode(code)}
      />
      <View style={styles.btnWrapper}>
        <Button
          title="Next"
          style={styles.btnNext}
          onPress={async () => {
            await verifyCode();
            navigation.navigate('Main');
          }}
        />
      </View>
    </View>
  );
};

export default VerifyScreen;
