import React, { useEffect, useState, useCallback } from 'react';
import Loading from './loading';
import event, { EVENT_NAME } from './event';
import Modal from './modal';
import H2 from './h2';
import H3 from './h3';
import Description from './description';
import useI18n from './use-i18n';
import useWalletProvider, { PROVIDER, CONNECT_STATUS } from './wallet-provider';

import images from './image/index';

import styles from './styles.module.less';

const { logo, rightArrow, metaMask } = images;

interface Props {
  visible?: boolean;
  network: any[];
}

interface ListItemProps {
  onClose: () => void;
  network: any[];
}
const MetaMask = ({ onClose, network }: ListItemProps) => {
  const { connect, status } = useWalletProvider({ network });

  const onChooseMetamask = async () => {
    await connect(PROVIDER.METAMASK);
    onClose();
  };

  return (
    <div className={styles['web3-wallet-choose-wallet-list-item']} onClick={onChooseMetamask}>
      <img src={metaMask} className={styles['web3-wallet-choose-wallet-type']} />
      <H3 style={{ marginBottom: 0 }}>MetaMask</H3>
      <div className={styles['web3-wallet-choose-wallet-arrow-box']}>
        {status === CONNECT_STATUS.CONNECTTING ? (
          <Loading />
        ) : (
          <img src={rightArrow} className={styles['web3-wallet-choose-wallet-item-arrow']} />
        )}
      </div>
    </div>
  );
};

export default function ChooseWallet({ visible, network }: Props) {
  const [innerVisible, setInnerVisible] = useState(visible || false);
  const t = useI18n();

  const showModal = useCallback(() => {
    setInnerVisible(true);
  }, [null]);

  const closeModal = useCallback(() => {
    setInnerVisible(false);
  }, [null]);

  const onCloseModal = useCallback(() => {
    event.emit(EVENT_NAME.CLOSE_CHOOSE_WALLET);
  }, []);

  useEffect(() => {
    event.on(EVENT_NAME.SHOW_CHOOSE_WALLET, showModal);
    event.on(EVENT_NAME.CLOSE_CHOOSE_WALLET, closeModal);

    return () => {
      event.off(EVENT_NAME.SHOW_CHOOSE_WALLET, showModal);
      event.off(EVENT_NAME.CLOSE_CHOOSE_WALLET, closeModal);
    };
  }, [null]);

  useEffect(() => {
    if (visible !== undefined) {
      setInnerVisible(visible);
    }
  }, [visible]);

  return (
    <Modal visible={innerVisible} onClose={onCloseModal}>
      <div className={styles['web3-wallet-choose-wallet']}>
        <img src={logo} className={styles['web3-wallet-choose-wallet-logo']} />
        <H2 style={{ marginTop: 16 }}>{t('wallet-connect.tips')}</H2>
        <Description style={{ marginTop: 4 }}>
          Powered by <a target="_blank" href="https://goatnft.io" className="underline">GOATNFT</a>
        </Description>
        <div className={styles['web3-wallet-choose-wallet-list']}>
          <MetaMask onClose={onCloseModal} network={network} />
        </div>
      </div>
    </Modal>
  );
}
