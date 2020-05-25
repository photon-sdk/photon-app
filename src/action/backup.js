import {HDSegwitBech32Wallet, KeyBackup} from '@photon-sdk/photon-lib';

import store from '../store';
import * as nav from './nav';
import {saveToDisk} from './wallet';

const keyServerURI =
  'https://uctj65wt6j.execute-api.eu-central-1.amazonaws.com/dev';

//
// Login screen
//

export function setPhone(phone) {
  store.phone = phone;
}

export async function checkPhone() {
  try {
    nav.goTo('Verify');
    await _checkForBackup();
  } catch (err) {
    nav.goBack();
    console.error(err);
  }
}

async function _checkForBackup() {
  const {phone} = store;
  KeyBackup.init({keyServerURI});
  store.backupExists = await KeyBackup.checkForExistingBackup({phone});
  if (!store.backupExists) {
    console.log('Photon: No backup found. Register new user ...');
    await KeyBackup.registerNewUser({phone});
  } else {
    console.log('Photon: Backup found. Register new device ...');
    await KeyBackup.registerDevice({phone});
  }
}

//
// Verify screen
//

export function setCode(code) {
  store.code = code;
}

export async function checkCode() {
  try {
    nav.reset('Main');
    await _verifyCode();
  } catch (err) {
    nav.reset('Backup');
    console.error(err);
  }
}

async function _verifyCode() {
  const {phone, code, backupExists} = store;
  if (!backupExists) {
    await _verifyAndCreateNewUser(phone, code);
    console.log('Photon: New user registered and backup created!');
  } else {
    await _verifyDeviceAndRestore(phone, code);
    console.log('Photon: New device registered and backup restored!');
  }
}

async function _verifyAndCreateNewUser(phone, code) {
  // verify and fetch encryption key
  await KeyBackup.verifyNewUser({phone, code});
  // generate new wallet
  const wallet = new HDSegwitBech32Wallet();
  await wallet.generate();
  const mnemonic = await wallet.getSecret();
  // cloud backup of encrypted seed
  await KeyBackup.createBackup({mnemonic});
  await saveToDisk(wallet);
}

async function _verifyDeviceAndRestore(phone, code) {
  // verify and fetch encryption key
  await KeyBackup.verifyDevice({phone, code});
  // fetch and decrypt user's seed
  const {mnemonic} = await KeyBackup.restoreBackup();
  // restore wallet from seed
  const wallet = new HDSegwitBech32Wallet();
  wallet.setSecret(mnemonic);
  if (!wallet.validateMnemonic()) {
    throw Error('Cannot validate mnemonic');
  }
  await saveToDisk(wallet);
}
