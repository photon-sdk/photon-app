import React from 'react';
import {StyleSheet, View} from 'react-native';
import {observer} from 'mobx-react';

import {Text} from '../component/text';
import {QRCode} from '../component/qrcode';
import {PillButton} from '../component/button';
import {LargeSpinner} from '../component/spinner';
import {font} from '../component/style';

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
    fontSize: font.sizeSub,
    lineHeight: font.lineHeightSub,
  },
  copyBtn: {
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
    <Text
      style={styles.addressText}
      adjustsFontSizeToFit={true}
      numberOfLines={1}>
      {store.nextAddress}
    </Text>
    <PillButton style={styles.copyBtn} onPress={() => wallet.copyAddress()}>
      Copy Address
    </PillButton>
  </View>
);

export default observer(ReceiveScreen);
