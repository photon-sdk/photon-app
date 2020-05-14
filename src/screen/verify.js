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
    <Text style={{fontSize: 30}}>This is the verify screen!</Text>
    <Button
      onPress={() => navigation.navigate('Backup')}
      title="Open Modal"
    />
  </View>
);

export default BackupScreen;
