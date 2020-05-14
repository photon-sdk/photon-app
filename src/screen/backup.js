import React from 'react';
import {StyleSheet, Button, View, Text} from 'react-native';

const styles = StyleSheet.create({
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const BackupScreen = ({navigation}) => (
  <View style={styles.body}>
    <Text style={{fontSize: 30}}>This is the backup screen!</Text>
    <Button
      onPress={() => navigation.navigate('Wallet')}
      title="Open Modal"
    />
  </View>
);

export default BackupScreen;
