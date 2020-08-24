import React from 'react';
import {StyleSheet, View} from 'react-native';
import {observer} from 'mobx-react';

import {Text} from '../component/text';
import {QRCode} from '../component/qrcode';
import {PillButton} from '../component/button';
import {LargeSpinner} from '../component/spinner';

import store from '../store';
import * as wallet from '../action/wallet';

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 25,
  },
  addressWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  addressText: {
    marginTop: 20,
  },
  btnWrapper: {
    alignSelf: 'stretch',
    marginTop: 50,
  },
});

const ReceiveScreen = ({navigation}) => {
  React.useEffect(
    () => navigation.addListener('focus', () => wallet.fetchNextAddress()),
    [navigation],
  );
  return (
    <View style={styles.wrapper}>
      {store.nextAddress === null ? <LargeSpinner /> : <Address />}
    </View>
  );
};

const Address = () => (
  <View style={styles.addressWrapper}>
    <QRCode size={260}>{store.nextAddress}</QRCode>
    <Text style={styles.addressText}>{store.nextAddress}</Text>
    <View style={styles.btnWrapper}>
      <PillButton onPress={() => wallet.copyAddress()}>Copy Address</PillButton>
    </View>
  </View>
);

export default observer(ReceiveScreen);
