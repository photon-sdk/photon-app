import {CommonActions} from '@react-navigation/native';
import store from '../store';

let _navigate;
let _reset;
let _back;

export function setTopLevelNavigator(navigatorRef) {
  _navigate = name => navigatorRef.dispatch(CommonActions.navigate({name}));

  _back = () => navigatorRef.dispatch(CommonActions.back());

  _reset = name =>
    navigatorRef.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name}],
      }),
    );

  store.navReady = true;
}

export function back() {
  _back();
}

export function navigate(routeName) {
  _navigate(routeName);
}

export function reset(routeName) {
  _reset(routeName);
}
