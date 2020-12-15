import {DevSettings} from 'react-native';
import Clipboard from '@react-native-community/clipboard';
import DocumentPicker from 'react-native-document-picker';
import RNFS from 'react-native-fs';
import {
  WalletStore,
  ElectrumClient,
  MultisigHDWallet,
} from '@photon-sdk/photon-lib';

import store from '../store';
import * as nav from './nav';
import * as alert from './alert';
import {nap} from '../util';

const walletStore = new WalletStore();
const PIN_KEY = 'photon.pin';

//
// Init and startup
//

export async function savePinToDisk(pin) {
  await walletStore.setItem(PIN_KEY, pin);
}

export async function saveToDisk(wallet, pin) {
  await savePinToDisk(pin);
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
  const multisig = getMultisigWallet();
  if (multisig) {
    return multisig;
  }
  const [wallet] = walletStore.getWallets();
  return wallet;
}

export function getMultisigWallet() {
  const wallets = walletStore.getWallets();
  return wallets.length === 2 ? wallets[1] : null;
}

export async function checkPin() {
  try {
    const {pin} = store.backup;
    const storedPin = await walletStore.getItem(PIN_KEY);
    // migration to local PIN storage ...
    if (!storedPin) {
      return alert.confirm({
        title: 'Heads up',
        message:
          'No PIN stored in local keychain. Wipe app storage and restart?',
        onOk: () => _wipeAndRestart(),
      });
    }
    // ... migration end
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
    await ElectrumClient.connectMain(store.config.electrum);
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
  store.balanceRefreshing = true;
  while (!store.walletReady || !store.electrumConnected) {
    await nap(100);
  }
  await fetchBalance();
  // await fetchTransactions();
  await saveCache();
  store.balanceRefreshing = false;
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
// Multisig
//

export async function importColdCardCosigner() {
  try {
    await _importColdCardFile();
  } catch (err) {
    alert.error({err});
  }
}

async function _importColdCardFile() {
  const res = await DocumentPicker.pick({
    type: [DocumentPicker.types.allFiles],
  });
  const json = await RNFS.readFile(res.uri, 'utf8');
  const config = JSON.parse(json);
  if (!config.p2wsh || !config.xfp) {
    throw new Error('Invalid ColdCard json format!');
  }
  store.cosigners.push({
    xpub: config.p2wsh,
    fingerprint: config.xfp,
  });
}

export async function createMultiSig() {
  try {
    await _createMultiSig();
  } catch (err) {
    alert.error({err});
  }
}

async function _createMultiSig() {
  const multisig = getMultisigWallet();
  if (multisig) {
    throw new Error('Multisig wallet already exists!');
  }
  const mnemonic = await getWallet().getSecret();
  const msWallet = new MultisigHDWallet();
  msWallet.addCosigner(mnemonic);
  if (!store.cosigners.length) {
    throw new Error('Not enough cosigners!');
  }
  store.cosigners.forEach(cosigner => {
    msWallet.addCosigner(cosigner.xpub, cosigner.fingerprint);
  });
  msWallet.setDerivationPath("m/48'/0'/0'/2'");
  msWallet.setM(2);
  walletStore.wallets.push(msWallet);
  await walletStore.saveToDisk();
}

//
// Logout and cleanup
//

export async function logout() {
  alert.confirm({
    title: 'Logout',
    message: 'Wipe app storage and restart?',
    onOk: () => _wipeAndRestart(),
  });
}

export async function _wipeAndRestart() {
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
