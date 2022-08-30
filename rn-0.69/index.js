/**
 * @format
 */

import 'node-libs-react-native/globals';

// Polyfill ECMAScript Internationalization API on Android
// See: https://github.com/facebook/react-native/issues/19410
import 'intl';
import 'intl/locale-data/jsonp/en-US';

import 'react-native-gesture-handler';
import 'mobx-react-lite/batchingForReactNative';

import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
