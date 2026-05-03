import React from 'react';
import clsx from 'clsx';
import styles from './Skeleton.module.css';

type SkeletonProps = {
  aspect?: string;
  radius?: number;
  className?: string;
  style?: React.CSSProperties;
};

export default function Skeleton({
  aspect = '1 / 1',
  radius = 12,
  className,
  style,
}: SkeletonProps): JSX.Element {
  return (
    <div
      className={clsx(styles.skeleton, className)}
      style={{aspectRatio: aspect, borderRadius: radius, ...style}}
      aria-hidden="true"
    />
  );
}
