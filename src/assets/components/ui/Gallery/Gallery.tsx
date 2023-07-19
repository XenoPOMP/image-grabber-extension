import cn from 'classnames';
import { FC, useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';

import Overlay from '@ui/Overlay/Overlay';
import ProgressiveImage from '@ui/ProgressiveImage/ProgressiveImage';

import useBoolean from '@hooks/useBoolean';

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

  useEffect(() => {
    console.log(slides);
  }, [slides]);

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
          blurColor: 'rgba(0 0 0 / .8)'
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

          <aside className={cn(styles.hoverable)}></aside>

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

          <aside className={cn(styles.hoverable)}></aside>

          <footer></footer>
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
