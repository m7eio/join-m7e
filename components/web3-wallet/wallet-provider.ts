// @ts-nocheck
import { useEffect, useCallback } from 'react';
import { message } from 'antd';
import Rekv from 'rekv';

import { isNetworkAvailable, convertAddress } from './utils';
import { handleConnect, getAccount, isConnected, getBalance } from './metamask';
import useI18n from './use-i18n';

export const PROVIDER = {
  METAMASK: 'METAMASK',
  IMTOKEN: 'IMTOKEN',
};

export const CONNECT_STATUS = {
  CONNECTTING: 'CONNECTTING',
  CONNECTED: 'CONNECTED',
  UNCONNECT: 'UNCONNECT',
  FAIL: 'FAIL',
};

const state = new Rekv({
  address: '',
  provider: PROVIDER.METAMASK,
  chainId: 3,
  status: '',
  balance: '',
});

const providerListenerList = {
  [PROVIDER.METAMASK]: false,
};

export default function useWalletProvider({ network = [], locale = 'en-US' }) {
  const { address, provider, chainId, status } = state.useState(
    'address',
    'provider',
    'chainId',
    'status',
  );

  const t = useI18n(locale);

  const connect = async (p: string) => {
    const innerProvider = p || provider;
    if (innerProvider === PROVIDER.METAMASK) {
      try {
        state.setState({ status: CONNECT_STATUS.CONNECTTING });
        const addr = await handleConnect(network);
        state.setState({
          address: addr || '',
          status: CONNECT_STATUS.CONNECTED,
          provider: PROVIDER.METAMASK,
        });
      } catch (err) {
        state.setState({ status: CONNECT_STATUS.FAIL });
      }
    }
  };

  const walletListener = useCallback(async () => {
    const hasRegisted = providerListenerList[provider];

    if (!hasRegisted && provider === PROVIDER.METAMASK) {
      providerListenerList[provider] = true;

      window.ethereum.on('accountsChanged', async (accounts: [string]) => {
        if (accounts && Array.isArray(accounts)) {
          const addr = accounts[0];
          if (addr) {
            const balance = await getBalance(addr);
            const formattedAddress = convertAddress(addr) || '';
            state.setState({
              address: formattedAddress.toLowerCase(),
              balance,
              status: CONNECT_STATUS.CONNECTED,
            });
          } else {
            state.setState({ address: '', status: CONNECT_STATUS.UNCONNECT });
          }
        }
      });

      window.ethereum.on('chainChanged', (cId: string) => {
        const netStatus = isNetworkAvailable(network, cId);

        if (!netStatus) {
          message.info(t('wallet-connect.notice.metamask.network'));
          return;
        }

        state.setState({ chainId: cId });
      });

      state.setState({ chainId: +window.ethereum.chainId });

      const isConnect = await isConnected();
      if (isConnect) {
        try {
          const addr = await getAccount(network);
          state.setState({
            status: addr ? CONNECT_STATUS.CONNECTED : CONNECT_STATUS.UNCONNECT,
            address: addr,
          });
        } catch (err) {
          // empty
        }
      }
    }
  }, [provider, network]);

  useEffect(() => {
    if (provider === PROVIDER.METAMASK && window.ethereum) {
      walletListener();
    }

    if (provider === PROVIDER.METAMASK && !window.ethereum) {
      state.setState({ status: CONNECT_STATUS.UNCONNECT });
    }
  }, [provider]);

  return {
    address,
    provider,
    chainId,
    status,
    connect,
  };
}
