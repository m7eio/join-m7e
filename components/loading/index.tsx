import React from 'react';
import { LoadingOutlined } from '@ant-design/icons';

export interface LodingProps {
  className?: string;
  style?: React.CSSProperties;
  rotate?: number;
  loading?: boolean;
  twoToneColor?: string;
}

export default function Loading({ loading, ...props }: LodingProps) {
  return <LoadingOutlined spin={loading} {...props} />;
}
