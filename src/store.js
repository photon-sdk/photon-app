import {observable} from 'mobx';

export default observable({
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
    pinVerify: '',
  },
  userId: {
    email: '',
    code: '',
    pin: '',
  },
  settings: {
    email: null,
  },

  // Persistent data
  config: {
    electrum: {
      host: 'blockstream.info',
      tcp: null,
      ssl: '700',
    },
    keyServer: 'https://uctj65wt6j.execute-api.eu-central-1.amazonaws.com/dev',
  },
});
