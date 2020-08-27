import {DevSettings} from 'react-native';
import Clipboard from '@react-native-community/clipboard';
import {WalletStore, ElectrumClient} from '@photon-sdk/photon-lib';

import store from '../store';

const walletStore = new WalletStore();

//
// Init and startup
//

export async function saveToDisk(wallet) {
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

export async function update() {
  await fetchBalance();
  await fetchTransactions();
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
  await ElectrumClient.waitTillConnected();
  store.nextAddress = await getWallet().getAddressAsync();
}

//
// Logout and cleanup
//

export async function logout() {
  try {
    await _stopElectrumClient();
    await _wipeCache();
    DevSettings.reload();
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
