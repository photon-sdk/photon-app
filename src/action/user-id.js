import {KeyBackup} from '@photon-sdk/photon-lib';

import store from '../store';
import * as nav from './nav';
import * as alert from './alert';
import * as backup from './backup';

//
// Init
//

export async function fetchUserIds() {
  store.settings.email = await KeyBackup.getEmail();
}

//
// Email Set screen
//

export function initEmailSet() {
  store.userId.email = '';
  nav.goTo('EmailSet');
}

export function setEmail(email) {
  store.userId.email = email;
}

//
// Email Pin screen
//

export function initPinSet() {
  store.userId.pin = '';
  nav.goTo('EmailPin');
}

export function setPin(pin) {
  store.userId.pin = pin;
}

export async function validateEmailPin() {
  try {
    initEmailVerify();
    const {email, pin} = store.userId;
    await KeyBackup.registerEmail({userId: email, pin});
  } catch (err) {
    initPinSet();
    alert.error({err});
  }
}

//
// Email Verify screen
//

export function initEmailVerify() {
  store.userId.code = '';
  nav.goTo('EmailVerify', {
    onNext: validateEmailCode,
  });
}

export function setCode(code) {
  store.userId.code = code;
}

export async function validateEmailCode() {
  try {
    nav.goTo('EmailWait');
    const {email, code} = store.userId;
    await KeyBackup.verifyEmail({userId: email, code});
    await fetchUserIds();
    nav.goTo('Settings');
  } catch (err) {
    initEmailVerify();
    alert.error({err});
  }
}

//
// Restore screen
//

export async function initPinReset() {
  try {
    nav.goTo('PinResetWait');
    store.userId.email = await KeyBackup.getEmail();
    if (!store.userId.email) {
      backup.initRestore();
      return alert.info('PIN Reset Failed', 'No recovery email address.');
    }
    await KeyBackup.initPinReset({userId: store.userId.email});
    initPinResetVerify();
  } catch (err) {
    backup.initRestore();
    alert.error({err});
  }
}

//
// Pin Reset Verify screen
//

export function initPinResetVerify() {
  store.userId.code = '';
  nav.goTo('PinResetVerify', {
    onNext: verifyPinReset,
  });
}

export async function verifyPinReset() {
  try {
    nav.goTo('PinResetWait');
    const {email, code} = store.userId;
    store.userId.delay = await KeyBackup.verifyPinReset({userId: email, code});
    const {delay} = store.userId;
    if (delay) {
      backup.initRestore();
      return alert.info(
        'PIN Reset Initialized',
        `For your security PIN reset is locked until ${new Date(delay)}.`,
      );
    }
    initPinResetFinalize();
  } catch (err) {
    backup.initRestore();
    alert.error({err});
  }
}

//
// Pin Reset Finalize screen
//

export function initPinResetFinalize() {
  store.userId.code = '';
  nav.goTo('PinResetFinalize');
}

export async function finalizePinReset() {
  const {email, code, newPin} = store.userId;
  await KeyBackup.finalizePinReset({userId: email, code, newPin});
}
