import {when} from 'mobx';

import store from '../store';
import * as nav from './nav';
import * as wallet from './wallet';
import * as backup from './backup';
import * as userId from './user-id';

when(
  () => store.navReady,
  async () => {
    backup.init();
    const hasWallet = await wallet.loadFromDisk();
    if (hasWallet) {
      nav.reset('Main');
      return;
    }
    const hasBackup = await backup.checkBackup();
    if (!hasBackup) {
      backup.initBackup();
    } else {
      backup.initRestore();
    }
  },
);

when(
  () => store.walletReady,
  async () => {
    wallet.loadXpub();
    wallet.loadBalance();
    wallet.loadTransactions();
    await userId.fetchUserIds();
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
