import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import WalletScreen from './screen/wallet';
import BackupScreen from './screen/backup';
import {initLocalStore, initElectrumClient} from './action/wallet';

let hasWallet;

(async function init() {
  hasWallet = await initLocalStore();
  // initElectrumClient();
})();

const MainStack = createStackNavigator();
const BackupStack = createStackNavigator();
const RootStack = createStackNavigator();

const MainStackScreen = () => (
  <MainStack.Navigator>
    <MainStack.Screen name="Wallet" component={WalletScreen} />
  </MainStack.Navigator>
);

const BackupStackScreen = () => (
  <BackupStack.Navigator>
    <BackupStack.Screen name="Backup" component={BackupScreen} />
  </BackupStack.Navigator>
);

const App = () => {
  return (
    <NavigationContainer>
      <RootStack.Navigator
        initialRouteName={hasWallet ? 'Main' : 'Backup'}
        screenOptions={{gestureEnabled: false}}>
        <RootStack.Screen
          name="Main"
          component={MainStackScreen}
          options={{headerShown: false}}
        />
        <RootStack.Screen
          name="Backup"
          component={BackupStackScreen}
          options={{headerShown: false}}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default App;
