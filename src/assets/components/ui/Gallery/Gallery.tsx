import cn from 'classnames';
import { copyImageToClipboard } from 'copy-image-clipboard';
import { FC, useCallback, useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import TextOverflow from 'react-text-overflow';
import { v4 as uuid } from 'uuid';

import Loader from '@ui/Loader/Loader';
import Overlay from '@ui/Overlay/Overlay';
import ProgressiveImage from '@ui/ProgressiveImage/ProgressiveImage';

import useBoolean from '@hooks/useBoolean';
import { useLocalization } from '@hooks/useLocalization';
import { useMessageManager } from '@hooks/useMessageManager';

import { ArrayType } from '@type/ArrayType';
import { ImageSearchResult } from '@type/ImageSearchResult';
import { PropsWith } from '@type/PropsWith';

import { isUndefined } from '@utils/type-checks';

import { FilesizeService } from '../../../api/services/Filesize.service';

import styles from './Gallery.module.scss';

export const useGallery = (): {
  isOpen: boolean;
  openGallery: (src?: string) => void;
  closeGallery: () => void;
  Gallery: FC<{}>;
} => {
  const [shown, toggleShown, setShown] = useBoolean(false);
  const [displayingImage, setDisplayingImage] =
    useState<ArrayType<ImageSearchResult>>(undefined);

  const [isInfoShown, toggleIsInfoShown, setIsInfoShown] = useBoolean(false);

  useEffect(() => {
    setIsInfoShown(false);
  }, [shown]);

  const { createMessage } = useMessageManager();
  const loc = useLocalization();

  const getFileName = useCallback<
    () => {
      name?: string;
      extension?: string;
    }
  >(() => {
    const fullFileName = /.*\/\w+\.\w+$/gi.test(
      displayingImage ? displayingImage : ''
    )
      ? displayingImage
          ?.split(/\/{1,2}/gi)
          ?.at(-1)
          ?.split(/\./g)
      : '';

    const name = fullFileName?.at(0);
    const extension = fullFileName?.at(1);

    return {
      name,
      extension
    };
  }, [displayingImage]);

  const isFilenameCorrect = (): boolean => {
    const { name, extension } = getFileName();

    return !isUndefined(name) && !isUndefined(extension);
  };

  // const { data, isLoading, isError } = useQuery(
  //   'get-file-size',
  //   () =>
  //     FilesizeService.getFileSize(
  //       `${getFileName().name}.${getFileName().extension}`
  //     ),
  //   {
  //     enabled: isInfoShown
  //   }
  // );

  const Gallery: ReturnType<typeof useGallery>['Gallery'] = ({}) => {
    const Button: FC<
      PropsWith<
        'children',
        Partial<{
          fullHeight: boolean;
          fullWidth: boolean;
          isSquare: boolean;
          blocked: boolean;
          onClick: () => void;
        }>
      >
    > = ({ children, fullHeight, fullWidth, isSquare, onClick, blocked }) => {
      return (
        <button
          className={cn(
            fullWidth && 'w-full',
            fullHeight && 'h-full',
            isSquare && 'aspect-square',
            styles.hoverable,
            styles.button,
            blocked && styles.blocked
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

          <article className={cn(styles.body)}>
            {isInfoShown ? (
              <div className={cn(styles.infoBlock)}>
                {isFilenameCorrect() ? (
                  <div className={cn(styles.content)}>
                    <b className={cn(styles.label)}>
                      <TextOverflow text={loc.infoFilename} />
                    </b>
                    <div className={cn(styles.text)}>
                      <TextOverflow
                        text={
                          !isUndefined(getFileName().name)
                            ? (getFileName().name as string)
                            : '...'
                        }
                      />
                    </div>

                    <b className={cn(styles.label)}>
                      <TextOverflow text={loc.infoExtension} />
                    </b>
                    <div className={cn(styles.text)}>
                      <TextOverflow
                        text={
                          !isUndefined(getFileName().extension)
                            ? (getFileName().extension as string)
                            : '...'
                        }
                      />
                    </div>

                    {/*<b className={cn(styles.label)}>*/}
                    {/*  <TextOverflow text={loc.infoFileSize} />*/}
                    {/*</b>*/}
                    {/*<div className={cn(styles.text)}>*/}
                    {/*  {isLoading ? (*/}
                    {/*    <Loader type={'circle'} mainColor={'white'} />*/}
                    {/*  ) : isError ? (*/}
                    {/*    <div>Error</div>*/}
                    {/*  ) : (*/}
                    {/*    <div>{data}</div>*/}
                    {/*  )}*/}
                    {/*</div>*/}
                  </div>
                ) : (
                  <div className={cn(styles.errorMessage)}>
                    <svg
                      width='60'
                      height='65'
                      viewBox='0 0 60 65'
                      fill='none'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path
                        d='M53.9675 12.8597L34.9978 1.90586C31.9001 0.117479 28.0679 0.117479 24.9382 1.90586L6.00055 12.8597C2.90282 14.6481 0.986694 17.9694 0.986694 21.5781V43.4219C0.986694 46.9987 2.90282 50.3199 6.00055 52.1403L24.9701 63.0941C28.0679 64.8825 31.9001 64.8825 35.0298 63.0941L53.9994 52.1403C57.0971 50.3519 59.0133 47.0306 59.0133 43.4219V21.5781C58.9813 17.9694 57.0652 14.68 53.9675 12.8597ZM27.5888 18.9274C27.5888 17.6181 28.6746 16.5323 29.984 16.5323C31.2933 16.5323 32.3791 17.6181 32.3791 18.9274V35.6935C32.3791 37.0029 31.2933 38.0887 29.984 38.0887C28.6746 38.0887 27.5888 37.0029 27.5888 35.6935V18.9274ZM32.922 47.2861C32.7624 47.6693 32.5388 48.0206 32.2514 48.3399C31.6446 48.9467 30.8462 49.2661 29.984 49.2661C29.5688 49.2661 29.1537 49.1703 28.7704 49.0106C28.3553 48.8509 28.0359 48.6274 27.7166 48.3399C27.4291 48.0206 27.2056 47.6693 27.014 47.2861C26.8543 46.9029 26.7904 46.4877 26.7904 46.0725C26.7904 45.2422 27.1098 44.4119 27.7166 43.8051C28.0359 43.5177 28.3553 43.2942 28.7704 43.1345C29.952 42.6235 31.3572 42.9109 32.2514 43.8051C32.5388 44.1245 32.7624 44.4438 32.922 44.859C33.0817 45.2422 33.1775 45.6574 33.1775 46.0725C33.1775 46.4877 33.0817 46.9029 32.922 47.2861Z'
                        fill='white'
                      />
                    </svg>

                    <p>{loc.infoFetchError}</p>
                  </div>
                )}
              </div>
            ) : (
              <ProgressiveImage
                loaderColorScheme={{
                  backgroundColor: 'transparent',
                  loaderColor: 'white',
                  type: 'wave'
                }}
                src={displayingImage}
              />
            )}
          </article>

          <footer>
            <section>
              <Button
                fullHeight
                isSquare
                onClick={() => {
                  toggleIsInfoShown();
                }}
              >
                {!isInfoShown ? (
                  <svg
                    width='24'
                    height='24'
                    viewBox='0 0 24 24'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <mask
                      id='mask0_28_62'
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
                    <g mask='url(#mask0_28_62)'>
                      <path
                        d='M11.95 18C12.3 18 12.5958 17.8792 12.8375 17.6375C13.0792 17.3958 13.2 17.1 13.2 16.75C13.2 16.4 13.0792 16.1042 12.8375 15.8625C12.5958 15.6208 12.3 15.5 11.95 15.5C11.6 15.5 11.3042 15.6208 11.0625 15.8625C10.8208 16.1042 10.7 16.4 10.7 16.75C10.7 17.1 10.8208 17.3958 11.0625 17.6375C11.3042 17.8792 11.6 18 11.95 18ZM11.05 14.15H12.9C12.9 13.6 12.9625 13.1667 13.0875 12.85C13.2125 12.5333 13.5667 12.1 14.15 11.55C14.5833 11.1167 14.925 10.7042 15.175 10.3125C15.425 9.92083 15.55 9.45 15.55 8.9C15.55 7.96667 15.2083 7.25 14.525 6.75C13.8417 6.25 13.0333 6 12.1 6C11.15 6 10.3792 6.25 9.7875 6.75C9.19583 7.25 8.78333 7.85 8.55 8.55L10.2 9.2C10.2833 8.9 10.4708 8.575 10.7625 8.225C11.0542 7.875 11.5 7.7 12.1 7.7C12.6333 7.7 13.0333 7.84583 13.3 8.1375C13.5667 8.42917 13.7 8.75 13.7 9.1C13.7 9.43333 13.6 9.74583 13.4 10.0375C13.2 10.3292 12.95 10.6 12.65 10.85C11.9167 11.5 11.4667 11.9917 11.3 12.325C11.1333 12.6583 11.05 13.2667 11.05 14.15ZM12 22C10.6167 22 9.31667 21.7375 8.1 21.2125C6.88333 20.6875 5.825 19.975 4.925 19.075C4.025 18.175 3.3125 17.1167 2.7875 15.9C2.2625 14.6833 2 13.3833 2 12C2 10.6167 2.2625 9.31667 2.7875 8.1C3.3125 6.88333 4.025 5.825 4.925 4.925C5.825 4.025 6.88333 3.3125 8.1 2.7875C9.31667 2.2625 10.6167 2 12 2C13.3833 2 14.6833 2.2625 15.9 2.7875C17.1167 3.3125 18.175 4.025 19.075 4.925C19.975 5.825 20.6875 6.88333 21.2125 8.1C21.7375 9.31667 22 10.6167 22 12C22 13.3833 21.7375 14.6833 21.2125 15.9C20.6875 17.1167 19.975 18.175 19.075 19.075C18.175 19.975 17.1167 20.6875 15.9 21.2125C14.6833 21.7375 13.3833 22 12 22ZM12 20C14.2333 20 16.125 19.225 17.675 17.675C19.225 16.125 20 14.2333 20 12C20 9.76667 19.225 7.875 17.675 6.325C16.125 4.775 14.2333 4 12 4C9.76667 4 7.875 4.775 6.325 6.325C4.775 7.875 4 9.76667 4 12C4 14.2333 4.775 16.125 6.325 17.675C7.875 19.225 9.76667 20 12 20Z'
                        fill='white'
                      />
                    </g>
                  </svg>
                ) : (
                  <svg
                    width='24'
                    height='24'
                    viewBox='0 0 24 24'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <mask
                      id='mask0_22_50'
                      style={{
                        mask: 'alpha'
                      }}
                      maskUnits='userSpaceOnUse'
                      x='0'
                      y='0'
                      width='24'
                      height='24'
                    >
                      <rect
                        width='24'
                        height='24'
                        transform='matrix(-1 0 0 1 24 0)'
                        fill='#D9D9D9'
                      />
                    </mask>
                    <g mask='url(#mask0_22_50)'>
                      <path
                        d='M10 18L11.4 16.55L7.85 13H20V11H7.85L11.4 7.45L10 6L4 12L10 18Z'
                        fill='white'
                      />
                    </g>
                  </svg>
                )}
              </Button>
            </section>

            <section>
              <Button
                fullHeight
                isSquare
                onClick={() => {
                  copyImageToClipboard(
                    !isUndefined(displayingImage) ? displayingImage : ''
                  )
                    .then(() => {
                      createMessage({
                        text: loc.imageCopied,
                        type: 'message'
                      });
                    })
                    .catch(err => {
                      console.error(err);

                      createMessage({
                        text: loc.failedImageCopy,
                        type: 'error'
                      });
                    });
                }}
                blocked={
                  !/.*\.((jpg)|(png))$/gi.test(
                    !isUndefined(displayingImage) ? displayingImage : ''
                  )
                }
              >
                <svg
                  width='24'
                  height='24'
                  viewBox='0 0 24 24'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <mask
                    id='mask0_29_68'
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
                  <g mask='url(#mask0_29_68)'>
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
            </section>
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
