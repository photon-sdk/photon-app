import {observable} from 'mobx';
import {Platform} from 'react-native';
import ComputedSend from './computed/send';
import ComputedWallet from './computed/wallet';

const store = observable({
  // app state
  navReady: false,
  backupExists: null,
  walletReady: false,
  electrumConnected: false,
  xpub: null,
  balance: null,
  balanceRefreshing: false,
  transactions: [],
  nextAddress: null,
  cosigners: [],

  // screens
  backup: {
    pin: '',
    newPin: '',
    pinVerify: '',
  },
  userId: {
    email: '',
    code: '',
    pin: '',
    delay: null,
  },
  settings: {
    email: null,
  },
  send: {
    value: null,
    feeRate: '2',
    address: null,
    newTx: {},
  },

  // Persistent data
  config: {
    electrum: {
      host: 'electrum1.bluewallet.io',
      tcp: '50001',
      ssl: null,
    },
    keyServer:
      Platform.OS === 'android'
        ? 'http://6678-205-253-124-76.ngrok.io/prod'
        : 'http://127.0.0.1:3000/prod',
  },
});

ComputedSend(store);
ComputedWallet(store);

export default store;
