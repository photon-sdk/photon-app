import {HDSegwitBech32Wallet, KeyBackup} from '@photon-sdk/photon-lib';

import store from '../store';
import * as nav from './nav';
import {saveToDisk} from './wallet';

//
// Init
//

export function init() {
  KeyBackup.init({keyServerURI: store.config.keyServer});
}

export async function checkBackup() {
  store.backupExists = await KeyBackup.checkForExistingBackup();
  return store.backupExists;
}

//
// Pin Set screen
//

export function initBackup() {
  store.backup.pin = '';
  store.backup.pinCheck = '';
  nav.reset('Backup');
}

export function setPin(pin) {
  store.backup.pin = pin;
}

export async function validateNewPin() {
  try {
    _validateNewPin();
    nav.goTo('PinCheck');
  } catch (err) {
    initBackup();
    console.error(err);
  }
}

function _validateNewPin() {
  const {pin} = store.backup;
  if (!pin || pin.length < 6) {
    throw new Error('PIN must be at least 6 digits!');
  }
  return pin;
}

//
// Pin Check screen
//

export function setPinCheck(pin) {
  store.backup.pinCheck = pin;
}

export async function validatePinCheck() {
  try {
    const pin = _validatePinCheck();
    nav.reset('Main');
    await _generateWalletAndBackup(pin);
  } catch (err) {
    initBackup();
    console.error(err);
  }
}

function _validatePinCheck() {
  const {pin, pinCheck} = store.backup;
  if (pin !== pinCheck) {
    throw new Error("PINs don't match!");
  }
  return pin;
}

async function _generateWalletAndBackup(pin) {
  // generate new wallet
  const wallet = new HDSegwitBech32Wallet();
  await wallet.generate();
  const mnemonic = await wallet.getSecret();
  // cloud backup of encrypted seed
  const data = {mnemonic};
  await KeyBackup.createBackup({data, pin});
  await saveToDisk(wallet);
}

//
// Restore screen
//

export function initRestore() {
  store.backup.pin = '';
  nav.reset('Restore');
}

export async function validatePin() {
  try {
    nav.reset('Main');
    await _verifyPinAndRestore();
    console.log('Photon: PIN verified and backup restored!');
  } catch (err) {
    initRestore();
    console.error(err);
  }
}

async function _verifyPinAndRestore() {
  const {pin} = store.backup;
  // fetch encryption key and decrypt cloud backup
  const {mnemonic} = await KeyBackup.restoreBackup({pin});
  // restore wallet from seed
  const wallet = new HDSegwitBech32Wallet();
  wallet.setSecret(mnemonic);
  if (!wallet.validateMnemonic()) {
    throw Error('Cannot validate mnemonic');
  }
  await saveToDisk(wallet);
}
