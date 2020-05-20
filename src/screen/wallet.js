import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {observer} from 'mobx-react';

import store from '../store';

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

const WalletScreen = () => (
  <View style={styles.wrapper}>
    <Text style={styles.h1}>
      Wallet {store.backupExists !== false ? 'Restored' : 'Backed Up'}!
    </Text>
    <Text style={styles.xpub}>Public key: {store.xpub}</Text>
  </View>
);

export default observer(WalletScreen);
