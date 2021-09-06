import React from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import classnames from 'classnames';

import styles from './styles.module.less';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  type?: 'primary' | 'ghost' | 'gradient' | 'submit' | 'gray' | 'text' | 'gradientBorder';
  size?: 'small' | 'medium' | 'large';
  className?: string;
  loading?: boolean;
  disabled?: boolean;
  children?: React.ReactNode;
  loadingColor?: string;
}

export default function Button({
  children,
  type = 'primary',
  className,
  loadingColor = '#fff',
  loading = false,
  disabled = false,
  size = 'medium',
  ...props
}: Props) {
  const cls = classnames(
    styles['goatnft-btn'],
    {
      [styles['goatnft-btn-primary']]: type === 'primary',
      [styles['goatnft-btn-ghost']]: type === 'ghost',
      [styles['goatnft-btn-gradient']]: type === 'gradient',
      [styles['goatnft-btn-gray']]: type === 'gray',
      [styles['goatnft-btn-text']]: type === 'text',
      [styles['goatnft-btn-loading']]: loading,
      [styles['goatnft-btn-disabled']]: disabled,
      [styles['goatnft-btn-gradientBorder']]: type === 'gradientBorder',
      [styles['goatnft-btn-small']]: size === 'small',
      [styles['goatnft-btn-medium']]: size === 'medium',
      [styles['goatnft-btn-large']]: size === 'large',
    },
    className,
  );

  if (type === 'ghost') {
    return (
      <span style={{ overflow: 'hidden', borderRadius: 24 }}>
        <span {...props} className={cls}>
          {children}
        </span>
      </span>
    );
  }

  if (type === 'gradientBorder') {
    return (
      <span>
        <span {...props} className={cls}>
          <span>{children}</span>
          <span className="bg-white">{children}</span>
        </span>
      </span>
    );
  }

  const render = () => {
    if (loading) {
      return (
        <span {...props} className={cls}>
          <LoadingOutlined style={{ marginRight: 8, color: loadingColor }} />
          <span>{children}</span>
        </span>
      );
    }

    return (
      <span {...props} className={cls}>
        {children}
      </span>
    );
  };

  return render();
}
