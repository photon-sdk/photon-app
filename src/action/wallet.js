import {DevSettings} from 'react-native';
import Clipboard from '@react-native-community/clipboard';
import {WalletStore, ElectrumClient} from '@photon-sdk/photon-lib';

import store from '../store';
import * as nav from './nav';
import * as alert from './alert';
import {poll, nap} from '../util';

const walletStore = new WalletStore();
const PIN_KEY = 'photon.pin';

//
// Init and startup
//

export async function saveToDisk(wallet, pin) {
  await walletStore.setItem(PIN_KEY, pin);
  walletStore.wallets.push(wallet);
  await walletStore.saveToDisk();
  store.walletReady = true;
}

export async function loadFromDisk() {
  try {
    await walletStore.loadFromDisk();
    store.walletReady = !!getWallet();
    return store.walletReady;
  } catch (err) {
    console.error(err);
  }
}

export function getWallet() {
  const [wallet] = walletStore.getWallets();
  return wallet;
}

export async function checkPin() {
  try {
    const {pin} = store.backup;
    const storedPin = await walletStore.getItem(PIN_KEY);
    if (storedPin === pin) {
      nav.reset('Main');
    } else {
      alert.error({message: 'Invalid PIN'});
    }
  } catch (err) {
    console.error(err);
  }
}

export async function initElectrumClient() {
  try {
    await ElectrumClient.connectMain();
    await ElectrumClient.waitTillConnected();
    store.electrumConnected = true;
  } catch (err) {
    console.error(err);
  }
}

//
// Wallet usage apis
//

export function loadXpub() {
  store.xpub = getWallet().getXpub();
}

export function loadBalance() {
  store.balance = walletStore.getBalance() || null;
}

export function loadTransactions() {
  store.transactions = walletStore.getTransactions();
}

export async function fetchBalance() {
  try {
    await walletStore.fetchWalletBalances();
    store.balance = walletStore.getBalance();
  } catch (err) {
    console.error(err);
  }
}

export async function fetchTransactions() {
  try {
    await walletStore.fetchWalletTransactions();
    store.transactions = walletStore.getTransactions();
  } catch (err) {
    console.error(err);
  }
}

export async function saveCache() {
  try {
    await walletStore.saveToDisk();
  } catch (err) {
    console.error(err);
  }
}

export async function pollUpdate() {
  await poll(() => update());
}

export async function update() {
  await fetchBalance();
  // await fetchTransactions();
  await saveCache();
}

//
// Receive address handling
//

export function copyAddress() {
  Clipboard.setString(store.nextAddress);
}

export async function fetchNextAddress() {
  store.nextAddress = null;
  while (!store.electrumConnected) {
    await nap(100);
  }
  store.nextAddress = await getWallet().getAddressAsync();
}

//
// Logout and cleanup
//

export async function logout() {
  try {
    await _stopElectrumClient();
    await _wipeCache();
    alert.confirm({
      title: 'Logout',
      message: 'Wipe app storage and restart?',
      onOk: () => DevSettings.reload(),
    });
  } catch (err) {
    console.error(err);
  }
}

async function _stopElectrumClient() {
  await ElectrumClient.forceDisconnect();
  store.electrumConnected = false;
}

async function _wipeCache() {
  const newStore = new WalletStore();
  await newStore.saveToDisk();
  store.walletReady = false;
}
