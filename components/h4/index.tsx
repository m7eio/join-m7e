import React from 'react';
import classnames from 'classnames';

interface Props {
  children: React.ReactNode;
  className?: string;
  [key: string]: any;
}

export default function H4({ children, className, ...props }: Props) {
  const cls = classnames('text-xl', className);

  return (
    <h3 {...props} className={cls}>
      {children}
    </h3>
  );
}
