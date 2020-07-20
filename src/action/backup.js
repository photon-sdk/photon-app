import {HDSegwitBech32Wallet, KeyBackup} from '@photon-sdk/photon-lib';

import store from '../store';
import * as nav from './nav';
import * as alert from './alert';
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
  store.backup.pinVerify = '';
  nav.reset('Backup');
}

export function setPin(pin) {
  store.backup.pin = pin;
}

export async function validateNewPin() {
  const {pin} = store.backup;
  if (!pin || pin.length < 6) {
    return alert.error({message: 'PIN must be at least 6 digits!'});
  }
  nav.goTo('BackupPinVerify');
}

//
// Pin Check screen
//

export function setPinVerify(pin) {
  store.backup.pinVerify = pin;
}

export async function validatePinVerify() {
  const {pin, pinVerify} = store.backup;
  if (pin !== pinVerify) {
    return alert.error({message: "PINs don't match!"});
  }
  try {
    nav.goTo('BackupWait', {
      message: 'Creating backup...',
    });
    await _generateWalletAndBackup(pin);
    nav.reset('Main');
  } catch (err) {
    nav.goTo('BackupPinVerify');
    alert.error({err});
  }
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
    nav.goTo('RestoreWait', {
      message: 'Restoring wallet...',
    });
    await _verifyPinAndRestore();
    nav.reset('Main');
  } catch (err) {
    nav.goTo('RestorePin');
    alert.error({message: 'Invalid PIN'});
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
