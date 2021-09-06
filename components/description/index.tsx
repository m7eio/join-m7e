import React from "react";
import classnames from "classnames";

import styles from './styles.module.css';

interface Props {
  children: React.ReactNode;
  className?: string;
  [key: string]: any;
}

export default function H2({ children, className, ...props }: Props) {
  const cls = classnames(styles.description, className);

  return <p {...props} className={cls}>{children}</p>
}