import React from 'react';
import {StyleSheet, Button, View, Text} from 'react-native';

const styles = StyleSheet.create({
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const WalletScreen = ({navigation}) => (
  <View style={styles.body}>
    <Text style={{fontSize: 30}}>This is the wallet screen!</Text>
    <Button
      onPress={() => navigation.navigate('Login')}
      title="Open Modal"
    />
  </View>
);

export default WalletScreen;
