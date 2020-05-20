import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import './action';
import {setTopLevelNavigator} from './action/nav';

import SplashScreen from './screen/splash';
import LoginScreen from './screen/login';
import VerifyScreen from './screen/verify';
import WalletScreen from './screen/wallet';

const BackupStack = createStackNavigator();
const MainStack = createStackNavigator();
const RootStack = createStackNavigator();

const BackupStackScreen = () => (
  <BackupStack.Navigator>
    <BackupStack.Screen name="Login" component={LoginScreen} />
    <BackupStack.Screen name="Verify" component={VerifyScreen} />
  </BackupStack.Navigator>
);

const MainStackScreen = () => (
  <MainStack.Navigator>
    <MainStack.Screen name="Wallet" component={WalletScreen} />
  </MainStack.Navigator>
);

const App = () => (
  <NavigationContainer ref={navRef => setTopLevelNavigator(navRef)}>
    <RootStack.Navigator screenOptions={{gestureEnabled: false}}>
      <RootStack.Screen
        name="Splash"
        component={SplashScreen}
        options={{headerShown: false}}
      />
      <RootStack.Screen
        name="Backup"
        component={BackupStackScreen}
        options={{headerShown: false}}
      />
      <RootStack.Screen
        name="Main"
        component={MainStackScreen}
        options={{headerShown: false}}
      />
    </RootStack.Navigator>
  </NavigationContainer>
);

export default App;
