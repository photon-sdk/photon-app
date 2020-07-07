import {HDSegwitBech32Wallet, KeyBackup} from '@photon-sdk/photon-lib';

import store from '../store';
import * as nav from './nav';
import {saveToDisk} from './wallet';

export async function checkBackup() {
  KeyBackup.init({keyServerURI: store.settings.keyServer});
  store.backupExists = await KeyBackup.checkForExistingBackup();
  return store.backupExists;
}

export function setPin(pin) {
  store.pin = pin;
}

export function setPinCheck(pin) {
  store.pinCheck = pin;
}

//
// Backup screen
//

export async function checkNewPin() {
  try {
    const pin = _validateNewPin();
    nav.reset('Main');
    await _generateWalletAndBackup(pin);
    console.log('Photon: New key generated and backup created!');
  } catch (err) {
    nav.reset('Backup');
    console.error(err);
  }
}

function _validateNewPin() {
  const {pin, pinCheck} = store;
  if (!pin || pin.length < 6) {
    throw new Error('PIN must be at least 6 digits!');
  }
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

export async function checkPin() {
  try {
    nav.reset('Main');
    await _verifyPinAndRestore();
    console.log('Photon: PIN verified and backup restored!');
  } catch (err) {
    nav.reset('Restore');
    console.error(err);
  }
}

async function _verifyPinAndRestore() {
  const {pin} = store;
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
