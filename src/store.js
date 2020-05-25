import {observable} from 'mobx';

export default observable({
  navReady: false,
  backupExists: null,
  phone: null,
  code: null,
  walletReady: false,
  electrumConnected: false,
  xpub: null,
  balance: null,
  transactions: [],
  nextAddress: null,
});
