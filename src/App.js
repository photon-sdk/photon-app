import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import WalletScreen from './screen/wallet';
import LoginScreen from './screen/login';
import VerifyScreen from './screen/verify';
import {initLocalStore, initElectrumClient} from './action/wallet';

let hasWallet;

(async function init() {
  // hasWallet = await initLocalStore();
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
    <BackupStack.Screen name="Login" component={LoginScreen} />
    <BackupStack.Screen name="Verify" component={VerifyScreen} />
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
