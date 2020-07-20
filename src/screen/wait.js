import React from 'react';
import {StyleSheet, View} from 'react-native';
import {observer} from 'mobx-react';

import {Text} from '../component/text';
import {LargeSpinner} from '../component/spinner';
import {font} from '../component/style';

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: {
    marginTop: 25,
    fontSize: font.sizeL,
    lineHeight: font.lineHeightsL,
  },
});

const WaitScreen = ({route}) => (
  <View style={styles.wrapper}>
    <LargeSpinner />
    <Text style={styles.message}>{route.params.message}</Text>
  </View>
);

export default observer(WaitScreen);
