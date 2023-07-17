import cn from 'classnames';
import { FC } from 'react';

import { PropsWith } from '@type/PropsWith';

import styles from './Button.module.scss';
import type { ButtonProps } from './Button.props';

const Button: FC<PropsWith<'children', ButtonProps>> = ({
  children,
  onClick
}) => {
  return (
    <button className={cn(styles.button, styles.active)} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
