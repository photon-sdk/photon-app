import React from 'react';
import {StyleSheet, View} from 'react-native';
import {observer} from 'mobx-react';

import {QRCode} from '../component/qrcode';
import {PillButton} from '../component/button';
import {LargeSpinner} from '../component/spinner';
import {font} from '../component/style';

import store from '../store';
import * as wallet from '../action/wallet';
import * as multisig from '../action/multisig';

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 25,
  },
  codeWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addressText: {
    marginTop: 20,
    fontSize: font.sizeSub,
    lineHeight: font.lineHeightSub,
  },
});

const CosignerExportScreen = ({navigation}) => {
  return (
    <View style={styles.wrapper}>
      {store.cosignerExport ? <Cosigner /> : <LargeSpinner />}
    </View>
  );
};

const Cosigner = () => (
  <View>
    <View style={styles.codeWrapper}>
      <QRCode size={260}>{store.cosignerExport}</QRCode>
    </View>
    <PillButton onPress={() => multisig.shareCosigner()}>
      Share Cosigner
    </PillButton>
  </View>
);

export default observer(CosignerExportScreen);
