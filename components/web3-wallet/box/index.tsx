import React from 'react';
import classnames from 'classnames';

import styles from './styles.module.less';

export default function Box({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const cls = classnames(styles['web3-wallet-box'], className);

  return (
    <div {...props} className={cls}>
      {children}
    </div>
  );
}
