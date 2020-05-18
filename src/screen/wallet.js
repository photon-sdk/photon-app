import React from 'react';
import {StyleSheet, View, Text} from 'react-native';

import {store, getXpub} from '../action/wallet';

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 25,
  },
  h1: {
    fontSize: 30,
  },
  xpub: {
    marginTop: 50,
    fontSize: 20,
  },
});

const WalletScreen = ({navigation}) => {
  const {backupExists} = store;
  return (
    <View style={styles.wrapper}>
      <Text style={styles.h1}>
        Wallet {backupExists ? 'Restored' : 'Backed Up'}!
      </Text>
      <Text style={styles.xpub}>Public key: {getXpub()}</Text>
    </View>
  );
};

export default WalletScreen;
