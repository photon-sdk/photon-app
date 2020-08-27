import React from 'react';
import {StyleSheet, View} from 'react-native';
import {observer} from 'mobx-react';

import {PillButton} from '../component/button';
import {color} from '../component/style';

import * as send from '../action/send';

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 25,
    backgroundColor: color.black,
  },
  nextBtn: {
    marginTop: 50,
  },
});

const SendAddressScreen = ({navigation}) => {
  React.useEffect(
    () => navigation.addListener('focus', () => send.initSendAddress()),
    [navigation],
  );
  return (
    <View style={styles.wrapper}>
      <PillButton style={styles.nextBtn} onPress={() => send.pasteAddress()}>
        Paste Address
      </PillButton>
    </View>
  );
};

export default observer(SendAddressScreen);
