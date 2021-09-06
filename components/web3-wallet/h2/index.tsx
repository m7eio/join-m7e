import React from 'react';
import classnames from 'classnames';

import styles from './styles.module.less';

export default function H2({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const cls = classnames(styles['web3-wallet-h2'], className);

  return (
    <h2 className={cls} {...props}>
      {children}
    </h2>
  );
}
