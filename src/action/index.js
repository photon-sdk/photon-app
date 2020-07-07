import {when} from 'mobx';

import store from '../store';
import * as nav from './nav';
import * as wallet from './wallet';
import * as backup from './backup';

when(
  () => store.navReady,
  async () => {
    const hasWallet = await wallet.loadFromDisk();
    if (hasWallet) {
      nav.reset('Main');
      return;
    }
    const hasBackup = await backup.checkBackup();
    if (!hasBackup) {
      nav.reset('Backup');
    } else {
      nav.reset('Restore');
    }
  },
);

when(
  () => store.walletReady,
  async () => {
    wallet.loadXpub();
    wallet.loadBalance();
    wallet.loadTransactions();
    await wallet.initElectrumClient();
  },
);

when(
  () => store.walletReady && store.electrumConnected,
  async () => {
    await wallet.fetchBalance();
    await wallet.fetchTransactions();
    await wallet.fetchNextAddress();
    await wallet.saveCache();
  },
);
