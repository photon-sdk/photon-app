import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {observer} from 'mobx-react';

import {LargeSpinner} from '../component/spinner';

import store from '../store';

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 25,
  },
});

const WalletScreen = () => (
  <View style={styles.wrapper}>
    {store.balance === null ? <LargeSpinner /> : <Balance />}
  </View>
);

const balanceStyles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 30,
  },
  numeral: {
    marginTop: 10,
    fontSize: 50,
  },
});

const Balance = () => (
  <View style={balanceStyles.wrapper}>
    <Text style={balanceStyles.label}>Total sats</Text>
    <Text
      style={balanceStyles.numeral}
      adjustsFontSizeToFit={true}
      numberOfLines={1}>
      {store.balance}
    </Text>
  </View>
);

export default observer(WalletScreen);
