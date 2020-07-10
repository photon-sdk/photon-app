import {KeyBackup} from '@photon-sdk/photon-lib';

import store from '../store';
import * as nav from './nav';

//
// Init
//

export async function init() {
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
    await _registerEmail();
  } catch (err) {
    initPinSet();
    console.error(err);
  }
}

async function _registerEmail() {
  const {email, pin} = store.userId;
  await KeyBackup.registerEmail({userId: email, pin});
}

//
// Email Verify screen
//

export function initEmailVerify() {
  store.userId.code = '';
  nav.goTo('EmailVerify');
}

export function setCode(code) {
  store.userId.code = code;
}

export async function validateEmailCode() {
  try {
    nav.goTo('EmailWait');
    await _verifyEmail();
    await init();
    nav.goTo('Settings');
  } catch (err) {
    nav.goTo('EmailVerify');
    console.error(err);
  }
}

async function _verifyEmail() {
  const {email, code} = store.userId;
  await KeyBackup.verifyEmail({userId: email, code});
}
