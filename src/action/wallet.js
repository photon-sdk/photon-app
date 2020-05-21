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

export async function fetchBalanceAndTx() {
  try {
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
  store.nextAddress = await store.wallet.getAddressAsync();
}
