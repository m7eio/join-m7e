import React from 'react';
import images from '../image/index';

const { close } = images;


interface Props extends React.HTMLAttributes<HTMLImageElement> {
  width?: number;
  height?: number;
}

export default function Clock({ width = 20, height = 20, ...props }: Props) {
  return <img width={width} height={height} {...props} src={close} />;
}
