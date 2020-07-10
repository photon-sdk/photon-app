import React from 'react';
import {StyleSheet, View} from 'react-native';
import {observer} from 'mobx-react';

import {LargeSpinner} from '../component/spinner';

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const WaitScreen = () => (
  <View style={styles.wrapper}>
    <LargeSpinner />
  </View>
);

export default observer(WaitScreen);
