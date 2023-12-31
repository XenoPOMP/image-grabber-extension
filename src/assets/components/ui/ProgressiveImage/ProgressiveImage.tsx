import cn from 'classnames';
import { CSSProperties, FC, ReactElement, useEffect, useState } from 'react';

import Loader from '@ui/Loader/Loader';

import { PropsWith } from '@type/PropsWith';

import styles from './ProgressiveImage.module.scss';
import { ProgressiveImageProps } from './ProgressiveImage.props';

const ProgressiveImage: FC<
  PropsWith<'className' | 'style', ProgressiveImageProps>
> = ({ src, alt, className, style, loaderColorScheme, onClick }) => {
  const getInlineVariables = (): CSSProperties => {
    const { backgroundColor } = loaderColorScheme;

    return {
      '--loader-background': backgroundColor
    } as CSSProperties;
  };

  // prettier-ignore
  const [element, setElement] = useState<ReactElement>(
    <div style={getInlineVariables()} className={cn(styles.loader)}>
			<Loader type={loaderColorScheme?.type ? loaderColorScheme?.type : 'circle'} mainColor={loaderColorScheme.loaderColor} />
    </div>
  );

  useEffect(() => {
    const img = new Image();
    img.src = src ? src : '';
    img.onload = () => {
      setElement(
        <img
          className={cn(className)}
          src={src}
          alt={alt}
          style={style}
          onClick={onClick}
        />
      );
    };
  }, [src]);

  return element;
};

export default ProgressiveImage;
