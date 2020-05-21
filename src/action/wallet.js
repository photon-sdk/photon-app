import {WalletStore, ElectrumClient} from '@photon-sdk/photon-lib';

import store from '../store';

const walletStore = new WalletStore();

//
// Init and startup
//

export async function saveToDisk(wallet) {
  walletStore.wallets.push(wallet);
  await walletStore.saveToDisk();
  store.wallet = wallet;
}

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
  store.xpub = store.wallet.getXpub();
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

export async function fetchNextAddress() {
  store.nextAddress = await store.wallet.getAddressAsync();
}

export async function saveCache() {
  await walletStore.saveToDisk();
}
