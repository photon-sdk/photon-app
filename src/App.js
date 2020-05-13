import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import {Button, View, Text} from 'react-native';

// import HomeScreen from './src/screen/home';

function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 30 }}>This is the home screen!</Text>
      <Button
        onPress={() => navigation.navigate('Backup')}
        title="Open Modal"
      />
    </View>
  );
}

function ModalScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 30 }}>This is a modal!</Text>
      <Button onPress={() => navigation.goBack()} title="Dismiss" />
    </View>
  );
}

const MainStack = createStackNavigator();
const BackupStack = createStackNavigator();
const RootStack = createStackNavigator();

const MainStackScreen = () => (
  <MainStack.Navigator>
    <MainStack.Screen
      name="Home"
      component={HomeScreen}
      options={{title: 'Wallet'}}
    />
  </MainStack.Navigator>
);

const BackupStackScreen = () => (
  <BackupStack.Navigator>
    <BackupStack.Screen
      name="MyModal"
      component={ModalScreen}
      options={{headerShown: false}}
    />
  </BackupStack.Navigator>
);

const App = () => {
  return (
    <NavigationContainer>
      <RootStack.Navigator mode="modal">
        <RootStack.Screen
          name="Main"
          component={MainStackScreen}
          options={{headerShown: false}}
        />
        <RootStack.Screen
          name="Backup"
          component={BackupStackScreen}
          options={{title: 'Sync'}}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default App;
