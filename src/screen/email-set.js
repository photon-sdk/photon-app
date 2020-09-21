import React from 'react';
import {StyleSheet, View} from 'react-native';
import {observer} from 'mobx-react';

import {H1Text, Text} from '../component/text';
import {TextInput} from '../component/input';
import {PillButton} from '../component/button';
import {MainContent, Spacer} from '../component/layout';
import {Background} from '../component/background';
import {font} from '../component/style';

import store from '../store';
import * as userId from '../action/user-id';

const styles = StyleSheet.create({
  input: {
    marginTop: 20,
  },
  hint: {
    marginHorizontal: 10,
    marginTop: 20,
    color: 'red',
    fontSize: font.sizeSub,
    lineHeight: font.lineHeightSub,
  },
  btnWrapper: {
    marginTop: 30,
    height: 150,
  },
});

const EmailSetScreen = () => (
  <Background>
    <MainContent>
      <H1Text>Set recovery email</H1Text>
      <TextInput
        placeholder="email address"
        keyboardType="email-address"
        autoFocus
        style={styles.input}
        value={store.userId.email}
        onChangeText={email => userId.setEmail(email)}
      />
      <Text style={styles.hint}>
        Use a different email than your iCloud account.
      </Text>
      <Spacer />
      <View style={styles.btnWrapper}>
        <PillButton onPress={() => userId.initPinSet()}>Next</PillButton>
      </View>
    </MainContent>
  </Background>
);

export default observer(EmailSetScreen);
