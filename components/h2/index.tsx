import React from "react";
import classnames from "classnames";

import styles from'./styles.module.css';

interface Props {
  children: React.ReactNode;
  className?: string;
  [key: string]: any;
}

export default function H2({ children, className, ...props }: Props) {
  const cls = classnames(styles.h2, className);

  return <h2 {...props} className={cls}>{children}</h2>
}