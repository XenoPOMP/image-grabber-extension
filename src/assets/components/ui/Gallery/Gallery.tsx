import cn from 'classnames';
import { FC, useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';

import Overlay from '@ui/Overlay/Overlay';
import ProgressiveImage from '@ui/ProgressiveImage/ProgressiveImage';

import useBoolean from '@hooks/useBoolean';
import { useLocalization } from '@hooks/useLocalization';
import { useMessageManager } from '@hooks/useMessageManager';

import { ImageSearchResult } from '@type/ImageSearchResult';
import { PropsWith } from '@type/PropsWith';

import { isUndefined } from '@utils/type-checks';

import styles from './Gallery.module.scss';

export const useGallery = (): {
  isOpen: boolean;
  openGallery: (src?: string) => void;
  closeGallery: () => void;
  Gallery: FC<{}>;
} => {
  const [shown, toggleShown, setShown] = useBoolean(false);
  const [slideIndex, setSlideIndex] = useState<number>(-1);
  const [slides, setSlides] = useState<ImageSearchResult>([]);

  const [displayingImage, setDisplayingImage] = useState<string | undefined>(
    undefined
  );

  const { createMessage } = useMessageManager();
  const loc = useLocalization();

  const Gallery: ReturnType<typeof useGallery>['Gallery'] = ({}) => {
    const Button: FC<
      PropsWith<
        'children',
        Partial<{
          fullHeight: boolean;
          fullWidth: boolean;
          isSquare: boolean;
          onClick: () => void;
        }>
      >
    > = ({ children, fullHeight, fullWidth, isSquare, onClick }) => {
      return (
        <button
          className={cn(
            fullWidth && 'w-full',
            fullHeight && 'h-full',
            isSquare && 'aspect-square',
            styles.hoverable,
            styles.button
          )}
          onClick={() => {
            if (!isUndefined(onClick)) {
              onClick();
            }
          }}
        >
          {children}
        </button>
      );
    };

    return (
      <Overlay
        backdrop={{
          blurAmount: 0,
          blurColor: 'rgba(0 0 0 / .9)'
        }}
        blockScroll
        trigger={shown}
        id={`gallery-${uuid()}`}
        className={cn('z-[var(--gallery-overlay)]', styles.gallery)}
      >
        <section className={cn(styles.grid)}>
          <header>
            <div></div>

            <Button
              fullHeight
              isSquare
              onClick={() => {
                setShown(false);
              }}
            >
              <svg
                width='16'
                height='16'
                viewBox='0 0 16 16'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  fillRule='evenodd'
                  clipRule='evenodd'
                  d='M8 6.81482L1.18519 0L0 1.18519L6.81482 8L0 14.8148L1.18519 16L8 9.18519L14.8148 16L16 14.8148L9.18519 8L16 1.18519L14.8148 2.73043e-06L8 6.81482Z'
                  fill='white'
                />
                <path
                  fillRule='evenodd'
                  clipRule='evenodd'
                  d='M8 6.81482L1.18519 0L0 1.18519L6.81482 8L0 14.8148L1.18519 16L8 9.18519L14.8148 16L16 14.8148L9.18519 8L16 1.18519L14.8148 2.73043e-06L8 6.81482Z'
                  fill='white'
                />
              </svg>
            </Button>
          </header>

          <div className={cn(styles.body)}>
            <ProgressiveImage
              loaderColorScheme={{
                backgroundColor: 'transparent',
                loaderColor: 'white',
                type: 'wave'
              }}
              src={displayingImage}
            />
          </div>

          <footer>
            <Button fullHeight isSquare onClick={() => {}}>
              <svg
                width='24'
                height='24'
                viewBox='0 0 24 24'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <mask
                  id='mask0_21_28'
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
                <g mask='url(#mask0_21_28)'>
                  <path
                    d='M5 22C4.45 22 3.97917 21.8042 3.5875 21.4125C3.19583 21.0208 3 20.55 3 20V6H5V20H16V22H5ZM9 18C8.45 18 7.97917 17.8042 7.5875 17.4125C7.19583 17.0208 7 16.55 7 16V4C7 3.45 7.19583 2.97917 7.5875 2.5875C7.97917 2.19583 8.45 2 9 2H18C18.55 2 19.0208 2.19583 19.4125 2.5875C19.8042 2.97917 20 3.45 20 4V16C20 16.55 19.8042 17.0208 19.4125 17.4125C19.0208 17.8042 18.55 18 18 18H9ZM9 16H18V4H9V16Z'
                    fill='white'
                  />
                </g>
              </svg>
            </Button>

            <Button
              fullHeight
              isSquare
              onClick={() => {
                if (isUndefined(chrome.downloads)) {
                  createMessage({
                    text: loc.chromeApiNotResponding,
                    type: 'warn'
                  });

                  return;
                }

                chrome.downloads
                  .download({
                    url: displayingImage ? displayingImage : ''
                  })
                  .catch(err => {
                    createMessage({
                      text: loc.failedToDownloadFile,
                      type: 'error'
                    });
                  });
              }}
            >
              <svg
                width='24'
                height='24'
                viewBox='0 0 24 24'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <mask
                  id='mask0_21_18'
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
                <g mask='url(#mask0_21_18)'>
                  <path
                    d='M12 16L7 11L8.4 9.55L11 12.15V4H13V12.15L15.6 9.55L17 11L12 16ZM6 20C5.45 20 4.97917 19.8042 4.5875 19.4125C4.19583 19.0208 4 18.55 4 18V15H6V18H18V15H20V18C20 18.55 19.8042 19.0208 19.4125 19.4125C19.0208 19.8042 18.55 20 18 20H6Z'
                    fill='white'
                  />
                </g>
              </svg>
            </Button>
          </footer>
        </section>
      </Overlay>
    );
  };

  return {
    openGallery: src => {
      setDisplayingImage(src);
      setShown(true);
    },

    closeGallery: () => {
      setShown(false);
    },

    isOpen: shown,

    Gallery
  };
};

export default useGallery;
