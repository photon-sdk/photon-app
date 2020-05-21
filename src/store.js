import {observable} from 'mobx';

export default observable({
  navReady: false,
  backupExists: null,
  phone: null,
  code: null,
  wallet: null,
  electrumConnected: false,
  xpub: null,
  balance: null,
  transactions: [],
  nextAddress: null,
});
