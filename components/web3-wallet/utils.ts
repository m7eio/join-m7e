// @ts-nocheck
import { ethers } from 'ethers';

/**
 * 根据chainID，查找对应网络
 */
export const getNetworkById = (network, cID?: string, type = 'goat') => {
  const chainID = cID || window.ethereum.chainId;

  const data = network.find((item) => item.chainID === parseInt(chainID, 16) && item.type === type);
  return (
    data || {
      chainID,
      chainName: 'unknown',
      contractAddress: '',
      fromBlock: 0,
    }
  );
};

/**
 * 判断当前网络是否可用
 */
export const isNetworkAvailable = (network, chainID: string) => {
  return network.some((item) => item.chainID === parseInt(chainID, 16));
};

export const convertAddress = (address: string) => {
  return ethers.utils.getAddress(address);
};
