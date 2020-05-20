import {observable} from 'mobx';

export default observable({
  navReady: false,
  backupExists: null,
  phone: null,
  code: null,
  wallet: null,
  xpub: null,
  balance: null,
});
