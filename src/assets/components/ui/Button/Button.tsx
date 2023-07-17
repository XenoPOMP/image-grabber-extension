import cn from 'classnames';
import { FC } from 'react';

import { PropsWith } from '@type/PropsWith';

import styles from './Button.module.scss';
import type { ButtonProps } from './Button.props';

const Button: FC<
  PropsWith<'children' | 'className' | 'style', ButtonProps>
> = ({ children, className, style, onClick, variant }) => {
  const defaultVariant: ButtonProps['variant'] = variant ? variant : 'normal';

  const getInlineClasses = (): string => {
    let variantClass: string = '';

    switch (defaultVariant) {
      case 'normal': {
        variantClass = styles.normal;
        break;
      }

      case 'cancel': {
        variantClass = cn(styles.hoverable, styles.cancel);
        break;
      }
    }

    return cn(variantClass);
  };

  return (
    <button
      className={cn(
        styles.button,
        styles.active,
        className,
        getInlineClasses()
      )}
      onClick={onClick}
      style={{ ...style }}
    >
      {children}
    </button>
  );
};

export default Button;
