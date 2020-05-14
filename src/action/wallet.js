import {
  HDSegwitBech32Wallet,
  WalletStore,
  ElectrumClient,
  KeyBackup,
} from '@photon-sdk/photon-lib';

const keyServerURI =
  'https://uctj65wt6j.execute-api.eu-central-1.amazonaws.com/dev';

let _store;

//
// Init and startup
//

export async function initLocalStore() {
  try {
    _store = new WalletStore();
    await _store.loadFromDisk();
    return !!_store.getWallets().length;
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

export async function checkForBackup(phone) {
  try {
    KeyBackup.init({keyServerURI});
    let exists = await KeyBackup.checkForExistingBackup({phone});
    return exists;
  } catch (err) {
    console.error(err);
  }
}

//
// Register new user and key backup
//

export async function registerNewUser(phone) {
  try {
    await KeyBackup.registerNewUser({phone});
  } catch (err) {
    console.error(err);
  }
}

export async function verifyAndCreateNewUser(phone, code) {
  try {
    // verify and fetch encryption key
    await KeyBackup.verifyNewUser({phone, code});
    // generate new wallet
    const wallet = new HDSegwitBech32Wallet();
    await wallet.generate();
    const mnemonic = await wallet.getSecret();
    // cloud backup of encrypted seed
    await KeyBackup.createBackup({mnemonic});
    // store wallet on device
    _store.wallets.push(wallet);
    await _store.saveToDisk();
  } catch (err) {
    console.error(err);
  }
}

//
// Register device for existing user and restore backup
//

export async function registerNewDevice(phone) {
  try {
    await KeyBackup.registerDevice({phone});
  } catch (err) {
    console.error(err);
  }
}

export async function verifyDeviceAndRestore(phone, code) {
  try {
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
    _store.wallets.push(wallet);
    await _store.saveToDisk();
  } catch (err) {
    console.error(err);
  }
}

//
// Wallet usage apis
//

export async function fetchBalanceAndTx() {
  try {
    await ElectrumClient.waitTillConnected();
    await _store.fetchWalletBalances();
    await _store.fetchWalletTransactions();
  } catch (err) {
    console.error(err);
  }
}

export function getBalance() {
  _store.getBalance();
}

export async function getNextAddress() {
  const [wallet] = _store.getWallets();
  return wallet.getAddressAsync();
}
