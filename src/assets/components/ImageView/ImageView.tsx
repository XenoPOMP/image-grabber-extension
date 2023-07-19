import cn from 'classnames';
import { FC } from 'react';

import styles from '@pages/MainPage/MainPage.module.scss';

import ProgressiveImage from '@ui/ProgressiveImage/ProgressiveImage';

import { useMessageManager } from '@hooks/useMessageManager';

import { isUndefined } from '@utils/type-checks';

import type { ImageViewProps } from './ImageView.props';

const ImageView: FC<ImageViewProps> = ({
  src,
  alt,
  className,
  style,
  loaderColorScheme,
  onClick
}) => {
  const { createMessage } = useMessageManager();

  return (
    <div>
      <ProgressiveImage
        src={src}
        alt={alt}
        className={cn('w-full', className)}
        style={style}
        loaderColorScheme={loaderColorScheme}
        onClick={() => {
          if (!isUndefined(onClick)) {
            onClick();
          }
        }}
      />

      <div className={cn(styles.overlayControls)}>
        <div className={cn(styles.group)}></div>

        <div className={cn(styles.group)}>
          <svg
            viewBox='0 0 24 24'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
            className={cn(styles.download)}
            onClick={() => {
              if (isUndefined(chrome.downloads)) {
                createMessage({
                  text: 'Image download failed',
                  type: 'error'
                });

                return;
              }

              chrome.downloads
                .download({
                  url: src ? src : ''
                })
                .catch(err => {
                  createMessage({
                    text: 'Image download failed',
                    type: 'error'
                  });
                });
            }}
          >
            <mask
              id='mask0_10_9'
              style={{
                mask: 'alpha'
              }}
              maskUnits='userSpaceOnUse'
              x='0'
              y='0'
              width='24'
              height='24'
            >
              <rect width='24' height='24' fill='#D9D9D9' />
            </mask>
            <g mask='url(#mask0_10_9)'>
              <path d='M12 16L7 11L8.4 9.55L11 12.15V4H13V12.15L15.6 9.55L17 11L12 16ZM6 20C5.45 20 4.97917 19.8042 4.5875 19.4125C4.19583 19.0208 4 18.55 4 18V15H6V18H18V15H20V18C20 18.55 19.8042 19.0208 19.4125 19.4125C19.0208 19.8042 18.55 20 18 20H6Z' />
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default ImageView;
