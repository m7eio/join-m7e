// @ts-nocheck
/* eslint-disable */
import { message } from 'antd';
import { fromWei, hexToNumberString } from 'web3-utils';
import { isNetworkAvailable } from './utils';
import event, { EVENT_NAME } from './event';
import useI18n from './use-i18n';

let timer: NodeJS.Timeout | null = null;

/**
 * 判断钱包是否解锁
 */
export const isUnlocked = async (): Promise<boolean> => {
  return window.ethereum._metamask.isUnlocked();
};

/**
 * 点击连接钱包
 */
export const handleConnect = async (network): Promise<string | void> => {
  const t = useI18n();
  if (!window.ethereum || !window.ethereum.isMetaMask) {
    message.info(t('notice.metamask.install'));
    throw new Error('MetaMask is not installed');
  }
  
  if (window.ethereum) {
    return await getAccount(network);
  }

  const isUnlock = await isUnlocked();

  if (!isUnlock) {
    message.info(t('notice.metamask.lock'));

    throw new Error('MetaMask is not locked');
  }

  message.error(t('notice.metamask.unknown-error'));

  throw new Error('unknown-error');
};

/**
 * 判断是否处理连接状态
 */
export const isConnected = async (): Promise<boolean> => {
  if (!window.ethereum) {
    return message.error(t('notice.metamask.install'));
  }

  const data = await window.ethereum.request({ method: 'eth_accounts' });
  if (data && Array.isArray(data) && data.length) {
    return true;
  }
  return false;
};

/**
 * 获取钱包账户
 */
export const getAccount = async (network): Promise<string | void> => {
  const data = await window.ethereum.request({ method: 'eth_requestAccounts' });
  if (data && Array.isArray(data)) {
    if (data.length) {
      const t = useI18n();
      const { chainId } = window.ethereum;
      const status = isNetworkAvailable(network, chainId);
      if (!status) {
        message.info(t('wallet-connect.notice.metamask.network'));

        throw new Error('the network is not support');
      }
      const acc = data[0];

      return acc.toLowerCase();
    } else {
      // 钱包锁定或者没有创建账户
      checkWallet();
    }
  }
};

/**
 * 获取网络
 */
export const getNetwork = async (network): Promise<void> => {
  const chainId = await window.ethereum.request({
    method: 'eth_chainId',
  });
  const status = isNetworkAvailable(network, chainId);
  if (!status) {
    const t = useI18n();
    message.info(t('wallet-connect.notice.metamask.network'));

    throw new Error('the network is not support');
  }
};

/**
 * 获取账户余额
 */
export const getBalance = async (address: string): Promise<string> => {
  const walletBalance = await window.ethereum.request({
    method: 'eth_getBalance',
    params: [address, 'latest'],
  });

  const num = hexToNumberString(walletBalance);
  const number = fromWei(num);
  return number;
};

/**
 * 判断钱包
 * 锁定状态
 * 没有创建账户
 */
export const checkWallet = async (): Promise<void> => {
  const unlocked = await isUnlocked();
  const t = useI18n();

  if (unlocked) {
    // 钱包没有创建账户
    message.info(t('notice.metamask.account'));
  } else {
    // 钱包被锁定提示
    message.info(t('notice.metamask.lock'));
  }
};

