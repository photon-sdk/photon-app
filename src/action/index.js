import {when} from 'mobx';

import store from '../store';
import * as nav from './nav';
import * as wallet from './wallet';

wallet.initElectrumClient();

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
  () => {
    wallet.getXpub();
  },
);

when(
  () => store.wallet && store.electrumConnected,
  async () => {
    await wallet.fetchBalance();
    await wallet.fetchTransactions();
    await wallet.getNextAddress();
  },
);
