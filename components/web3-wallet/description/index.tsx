import React from 'react';
import classnames from 'classnames';

import styles from './styles.module.less';

export default function Description({ children, className }: React.HTMLAttributes<HTMLDivElement>) {
  const cls = classnames(styles['web3-wallet-description'], className);

  return <p className={cls}>{children}</p>;
}
