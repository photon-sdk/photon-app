import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Feather from 'react-native-vector-icons/Feather';

import './action';
import {setTopLevelNavigator} from './action/nav';

import SplashScreen from './screen/splash';
import LoginScreen from './screen/login';
import VerifyScreen from './screen/verify';
import WalletScreen from './screen/wallet';
import SettingsScreen from './screen/settings';

const BackupStack = createStackNavigator();
const MainStack = createBottomTabNavigator();
const RootStack = createStackNavigator();

const BackupStackScreen = () => (
  <BackupStack.Navigator>
    <BackupStack.Screen name="Login" component={LoginScreen} />
    <BackupStack.Screen name="Verify" component={VerifyScreen} />
  </BackupStack.Navigator>
);

const MainStackScreen = () => (
  <MainStack.Navigator
    screenOptions={({route}) => ({
      tabBarIcon: ({focused, color, size}) => {
        let iconName;
        if (route.name === 'Wallet') {
          iconName = 'list';
        } else if (route.name === 'Send') {
          iconName = 'send';
        } else if (route.name === 'Receive') {
          iconName = 'download';
        } else if (route.name === 'Settings') {
          iconName = 'settings';
        }
        return <Feather name={iconName} size={size} color={color} />;
      },
    })}>
    <MainStack.Screen name="Wallet" component={WalletScreen} />
    <MainStack.Screen name="Send" component={WalletScreen} />
    <MainStack.Screen name="Receive" component={WalletScreen} />
    <MainStack.Screen name="Settings" component={SettingsScreen} />
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
        options={{title: 'Wallet'}}
      />
    </RootStack.Navigator>
  </NavigationContainer>
);

export default App;
