import React from 'react';
import ReactModal from 'react-modal';
import classnames from 'classnames';
import Box from '../box';
import CloseIcon from '../icon/close';

import styles from './styles.module.less';

interface ModalProps {
  visible: boolean;
  className?: string;
  onClose?: () => void;
  overlayClassName?: string;
  children?: React.ReactNode;
}

export default function Modal({
  visible,
  children,
  className,
  overlayClassName,
  onClose,
  ...props
}: ModalProps) {
  const cls = classnames(styles['web3-wallet-modal'], className);
  const overlayCls = classnames(styles['web3-wallet-modal-overlay'], overlayClassName);

  return (
    <ReactModal
      {...props}
      onRequestClose={onClose}
      isOpen={visible}
      className={cls}
      overlayClassName={overlayCls}
    >
      <Box className={styles['web3-wallet-modal-content']}>
        <CloseIcon
          width={12}
          height={12}
          className={styles['web3-wallet-modal-close']}
          onClick={onClose}
        />
        {children}
      </Box>
    </ReactModal>
  );
}
