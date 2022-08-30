import React from 'react';
import {StyleSheet, View} from 'react-native';
import {observer} from 'mobx-react';

import {Text} from '../component/text';
import {PillButton} from '../component/button';
import {font} from '../component/style';

import store from '../store';
import * as send from '../action/send';

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    padding: 25,
  },
  paramsWrapper: {
    flex: 1,
  },
  label: {
    marginTop: 30,
  },
  value: {
    marginTop: 10,
    fontSize: font.sizeXXL,
    lineHeight: font.lineHeightXXL,
  },
  fee: {
    marginTop: 10,
    fontSize: font.sizeXL,
    lineHeight: font.lineHeightXL,
  },
  addressText: {
    marginVertical: 20,
    fontSize: font.sizeSub,
    lineHeight: font.lineHeightSub,
  },
  nextBtn: {
    marginTop: 50,
  },
});

const SendConfirmScreen = () => (
  <View style={styles.wrapper}>
    <View style={styles.paramsWrapper}>
      <Text style={styles.label}>Amount:</Text>
      <Text style={styles.value} adjustsFontSizeToFit={true} numberOfLines={1}>
        {store.sendValueLabel} sats
      </Text>
      <Text style={styles.label}>Fee:</Text>
      <Text style={styles.fee} adjustsFontSizeToFit={true} numberOfLines={1}>
        {store.sendFeeLabel} sats
      </Text>
      <Text style={styles.label}>To:</Text>
      <Text
        style={styles.addressText}
        adjustsFontSizeToFit={true}
        numberOfLines={1}>
        {store.send.newTx.outputs[0].address}
      </Text>
    </View>
    <PillButton style={styles.nextBtn} onPress={() => send.validateSend()}>
      Send
    </PillButton>
  </View>
);

export default observer(SendConfirmScreen);
