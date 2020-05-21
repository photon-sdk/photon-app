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
    wallet.loadXpub();
    wallet.loadBalance();
    wallet.loadTransactions();
    await wallet.initElectrumClient();
  },
);

when(
  () => store.wallet && store.electrumConnected,
  async () => {
    await wallet.fetchBalance();
    await wallet.fetchTransactions();
    await wallet.fetchNextAddress();
    await wallet.saveCache();
  },
);
