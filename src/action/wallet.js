import {
  HDSegwitBech32Wallet,
  WalletStore,
  ElectrumClient,
  KeyBackup,
} from '@photon-sdk/photon-lib';

import store from '../store';
import * as nav from './nav';

const keyServerURI =
  'https://uctj65wt6j.execute-api.eu-central-1.amazonaws.com/dev';

const walletStore = new WalletStore();

//
// Init and startup
//

export async function loadFromDisk() {
  try {
    await walletStore.loadFromDisk();
    const [wallet] = walletStore.getWallets();
    store.wallet = wallet;
    return !!wallet;
  } catch (err) {
    console.error(err);
  }
}

export async function initElectrumClient() {
  try {
    await ElectrumClient.connectMain();
  } catch (err) {
    console.error(err);
  }
}

//
// Login screen
//

export function setPhone(phone) {
  store.phone = phone;
}

export async function checkPhone() {
  try {
    await _checkForBackup();
    nav.navigate('Verify');
  } catch (err) {
    console.error(err);
  }
}

async function _checkForBackup() {
  const {phone} = store;
  KeyBackup.init({keyServerURI});
  walletStore.backupExists = await KeyBackup.checkForExistingBackup({phone});
  if (!walletStore.backupExists) {
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
    await _verifyCode();
    nav.navigate('Main');
  } catch (err) {
    console.error(err);
  }
}

async function _verifyCode() {
  const {phone, code} = store;
  if (!walletStore.backupExists) {
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
  // store wallet on device
  walletStore.wallets.push(wallet);
  await walletStore.saveToDisk();
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
  // store wallet on device
  walletStore.wallets.push(wallet);
  await walletStore.saveToDisk();
}

//
// Wallet usage apis
//

export async function fetchBalanceAndTx() {
  try {
    await ElectrumClient.waitTillConnected();
    await walletStore.fetchWalletBalances();
    await walletStore.fetchWalletTransactions();
  } catch (err) {
    console.error(err);
  }
}

export function getXpub() {
  store.xpub = store.wallet.getXpub();
}

export function getBalance() {
  store.balance = walletStore.getBalance();
}

export async function getNextAddress() {
  const [wallet] = walletStore.getWallets();
  return wallet.getAddressAsync();
}
