import {
  HDSegwitBech32Wallet,
  WalletStore,
  ElectrumClient,
  KeyBackup,
} from '@photon-sdk/photon-lib';

const keyServerURI =
  'https://uctj65wt6j.execute-api.eu-central-1.amazonaws.com/dev';

export const store = new WalletStore();

//
// Init and startup
//

export async function initLocalStore() {
  try {
    await store.loadFromDisk();
    return !!store.getWallets().length;
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
// Login with phone number
//

export function setPhone(phone) {
  store.phone = phone;
}

export function setCode(code) {
  store.code = code;
}

export async function checkForBackup() {
  try {
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
  } catch (err) {
    console.error(err);
  }
}

export async function verifyCode() {
  try {
    const {phone, code} = store;
    if (!store.backupExists) {
      await _verifyAndCreateNewUser(phone, code);
      console.log('Photon: New user registered and backup created!');
    } else {
      await _verifyDeviceAndRestore(phone, code);
      console.log('Photon: New device registered and backup restored!');
    }
  } catch (err) {
    console.error(err);
  }
}

//
// Register new user and key backup
//

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
  store.wallets.push(wallet);
  // await store.saveToDisk();
}

//
// Register device for existing user and restore backup
//

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
  store.wallets.push(wallet);
  // await store.saveToDisk();
}

//
// Wallet usage apis
//

export async function fetchBalanceAndTx() {
  try {
    await ElectrumClient.waitTillConnected();
    await store.fetchWalletBalances();
    await store.fetchWalletTransactions();
  } catch (err) {
    console.error(err);
  }
}

export function getXpub() {
  const [wallet] = store.getWallets();
  return wallet ? wallet.getXpub() : '';
}

export function getBalance() {
  store.getBalance();
}

export async function getNextAddress() {
  const [wallet] = store.getWallets();
  return wallet.getAddressAsync();
}
