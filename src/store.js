import {observable} from 'mobx';
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
  transactions: [],
  nextAddress: null,

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
      host: 'blockstream.info',
      tcp: null,
      ssl: '700',
    },
    keyServer: 'https://keys.mymattress.io',
  },
});

ComputedSend(store);
ComputedWallet(store);

export default store;
