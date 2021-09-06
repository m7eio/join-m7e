import React from 'react';
import { Dropdown, Menu } from 'antd';

import event, { EVENT_NAME } from '../event';
import useWalletProvider from '../wallet-provider';
import Button from '../button';
import images from '../image';
import useI18n from '../use-i18n';

import styles from './styles.module.less';

const { metaMask } = images;

export const simpleAdress = (address: string, startLength = 17, endLength = 7) => {
  if (!address) return '';

  const start = address.substring(0, startLength);
  const end = address.substr(-endLength, endLength);

  return `${start}...${end}`;
};

export const switchWallet = () => {
  event.emit(EVENT_NAME.SHOW_CHOOSE_WALLET);
};

interface Props extends React.HTMLProps<HTMLDivElement> {
  network?: any[];
}

export default function CollectWallet(props: Props) {
  const { address } = useWalletProvider({ network: props.network || [] });

  const t = useI18n();

  const menu = (
    <Menu>
      <Menu.Item onClick={switchWallet}>
        <span>{t('wallet-connect.change')}</span>
      </Menu.Item>
      <Menu.Item>{simpleAdress(address)}</Menu.Item>
    </Menu>
  );

  // if (address) {
  //   return (
  //     <div {...props} className="text-white">
  //       {simpleAdress(address)}
  //     </div>
  //   );
  // }

  return (
    // eslint-disable-next-line
    // @ts-ignore
    <button
      className="h-10 sm:h-14 px-4 py-2 bg-white text-black fonts-times-new-roman"
      {...props}
      onClick={switchWallet}
    >
      {address ? simpleAdress(address, 6, 4) : t('wallet-connect.connect')}
    </button>
  );
}
