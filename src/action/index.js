import {when} from 'mobx';

import store from '../store';
import * as nav from './nav';
import * as wallet from './wallet';

when(
  () => store.navReady,
  async () => {
    const hasWallet = await wallet.loadFromDisk();
    if (hasWallet) {
      nav.reset('Main');
    } else {
      nav.reset('Backup');
    }
  },
);

when(
  () => store.wallet,
  async () => {
    wallet.getXpub();
    wallet.getBalance();
    // wallet.initElectrumClient();
  },
);
