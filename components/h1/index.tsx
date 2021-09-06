import React from "react";
import classnames from "classnames";

import styles from'./styles.module.css';

interface Props {
  children: React.ReactNode;
  className?: string;
}

export default function H1({ children, className, ...props }: Props) {
  const cls = classnames(styles.h1, className);

  return <h1 {...props} className={cls}>{children}</h1>
}