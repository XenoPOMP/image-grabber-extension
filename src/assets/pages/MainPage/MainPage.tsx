import { Slider } from '@mui/material';
import cn from 'classnames';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { tw } from 'tailwindcss-typescript';

import ImageView from '@components/ImageView/ImageView';
import Page from '@components/Page/Page';

import Button from '@ui/Button/Button';
import useGallery from '@ui/Gallery/Gallery';
import Loader from '@ui/Loader/Loader';
import Overlay from '@ui/Overlay/Overlay';
import ProgressiveImage from '@ui/ProgressiveImage/ProgressiveImage';
import Block from '@ui/masonry/Block/Block';
import Column from '@ui/masonry/Column/Column';
import Masonry from '@ui/masonry/Masonry/Masonry';

import useAppSettings from '@hooks/useAppSettings';
import useBoolean from '@hooks/useBoolean';
import { useLocalization } from '@hooks/useLocalization';
import { useMessageManager } from '@hooks/useMessageManager';

import { ArrayType } from '@type/ArrayType';
import { Defined } from '@type/Defined';
import { ImageSearchResult } from '@type/ImageSearchResult';

import { getImageColumns } from '@utils/getImageColumns';
import { isUndefined } from '@utils/type-checks';

import noResultIcon from '@media/icons/no-results 1.png';

import styles from './MainPage.module.scss';

const MainPage = () => {
  /** This hook provides locale strings. Type-safe. */
  const loc = useLocalization();
  const { gridSize } = useAppSettings();

  /** This hook allows to create messages to user. */
  const { createMessage } = useMessageManager();

  /** Replace WebWorker with states and async. */
  const [result, setResult] = useState<ImageSearchResult>(undefined);
  const [isLoading, toggleIsLoading, setIsLoading] = useBoolean(false);

  /** This function runs image grabbing process. */
  const run = async () => {
    setIsLoading(true);

    /** If app can`t connect to Chrome API, terminate loading. */
    if (isUndefined(chrome?.tabs)) {
      createMessage({
        text: loc.chromeApiNotResponding,
        type: 'warn'
      });

      setIsLoading(false);
      return;
    }

    /** Else use API to get current page`s content. */
    chrome?.tabs?.query({ active: true }, tabs => {
      const activeTab = tabs[0];

      /** Active tab is not found. */
      if (!activeTab) {
        createMessage({
          text: loc.noActiveTab,
          type: 'warn'
        });

        setIsLoading(false);
        return;
      }

      /**
       * This function grabs all images from page and return
       * paths of them.
       */
      const grabImages = (): typeof result => {
        const images: typeof result = Array.from(
          document.querySelectorAll('img')
        ).map(img => img.src);

        const spanImages: typeof result = Array.from(
          document.querySelectorAll('span')
        )
          .map(span => span.style.backgroundImage)
          .map(src => src.replace(/(^url\(")|("\))/g, ''));

        const makeUniqueSources = (
          ...args: Array<ImageSearchResult>
        ): ImageSearchResult => {
          return [...new Set(args.flat())];
        };

        return makeUniqueSources(images, spanImages);
      };

      /**
       * Inject and execute script on the active page.
       */
      chrome.scripting.executeScript(
        {
          target: {
            tabId: activeTab.id as number,
            allFrames: true
          },
          func: grabImages
        },
        results => {
          const preload: typeof result = [];

          results.map(entry => {
            preload.push(...entry.result);
          });

          setResult(preload);
        }
      );

      setIsLoading(false);
    });
  };

  /** Gallery hook. */
  const { closeGallery, openGallery, isOpen, Gallery } = useGallery();

  /** Help overlay state. */
  const [helpShown, toggleHelpShown, setHelpShown] = useBoolean(false);

  return (
    <Page
      meta={{
        title: 'Main',
        description: 'Some description',
        keywords: ''
      }}
    >
      <section className={cn(styles.mainPage)}>
        <header className={cn(styles.label)}>
          <section
            style={{
              opacity: 0,
              pointerEvents: 'none'
            }}
            className={cn(styles.info)}
          >
            <svg
              viewBox='0 0 33 33'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <mask
                id='mask0_38_7'
                style={{
                  mask: 'alpha'
                }}
                maskUnits='userSpaceOnUse'
                x='0'
                y='0'
                width='33'
                height='33'
              >
                <rect width='33' height='33' fill='#D9D9D9' />
              </mask>
              <g mask='url(#mask0_38_7)'>
                <path
                  d='M16.4312 24.75C16.9125 24.75 17.3193 24.5839 17.6516 24.2516C17.9839 23.9193 18.15 23.5125 18.15 23.0312C18.15 22.55 17.9839 22.1432 17.6516 21.8109C17.3193 21.4786 16.9125 21.3125 16.4312 21.3125C15.95 21.3125 15.5432 21.4786 15.2109 21.8109C14.8786 22.1432 14.7125 22.55 14.7125 23.0312C14.7125 23.5125 14.8786 23.9193 15.2109 24.2516C15.5432 24.5839 15.95 24.75 16.4312 24.75ZM15.1938 19.4563H17.7375C17.7375 18.7 17.8234 18.1042 17.9953 17.6688C18.1672 17.2333 18.6542 16.6375 19.4563 15.8813C20.0521 15.2854 20.5219 14.7182 20.8656 14.1797C21.2094 13.6411 21.3813 12.9938 21.3813 12.2375C21.3813 10.9542 20.9115 9.96875 19.9719 9.28125C19.0323 8.59375 17.9208 8.25 16.6375 8.25C15.3313 8.25 14.2714 8.59375 13.4578 9.28125C12.6443 9.96875 12.0771 10.7938 11.7563 11.7563L14.025 12.65C14.1396 12.2375 14.3974 11.7906 14.7984 11.3094C15.1995 10.8281 15.8125 10.5875 16.6375 10.5875C17.3708 10.5875 17.9208 10.788 18.2875 11.1891C18.6542 11.5901 18.8375 12.0312 18.8375 12.5125C18.8375 12.9708 18.7 13.4005 18.425 13.8016C18.15 14.2026 17.8063 14.575 17.3938 14.9188C16.3854 15.8125 15.7667 16.4885 15.5375 16.9469C15.3083 17.4052 15.1938 18.2417 15.1938 19.4563ZM16.5 30.25C14.5979 30.25 12.8104 29.8891 11.1375 29.1672C9.46458 28.4453 8.00937 27.4656 6.77187 26.2281C5.53437 24.9906 4.55469 23.5354 3.83281 21.8625C3.11094 20.1896 2.75 18.4021 2.75 16.5C2.75 14.5979 3.11094 12.8104 3.83281 11.1375C4.55469 9.46458 5.53437 8.00937 6.77187 6.77187C8.00937 5.53437 9.46458 4.55469 11.1375 3.83281C12.8104 3.11094 14.5979 2.75 16.5 2.75C18.4021 2.75 20.1896 3.11094 21.8625 3.83281C23.5354 4.55469 24.9906 5.53437 26.2281 6.77187C27.4656 8.00937 28.4453 9.46458 29.1672 11.1375C29.8891 12.8104 30.25 14.5979 30.25 16.5C30.25 18.4021 29.8891 20.1896 29.1672 21.8625C28.4453 23.5354 27.4656 24.9906 26.2281 26.2281C24.9906 27.4656 23.5354 28.4453 21.8625 29.1672C20.1896 29.8891 18.4021 30.25 16.5 30.25ZM16.5 27.5C19.5708 27.5 22.1719 26.4344 24.3031 24.3031C26.4344 22.1719 27.5 19.5708 27.5 16.5C27.5 13.4292 26.4344 10.8281 24.3031 8.69688C22.1719 6.56563 19.5708 5.5 16.5 5.5C13.4292 5.5 10.8281 6.56563 8.69688 8.69688C6.56563 10.8281 5.5 13.4292 5.5 16.5C5.5 19.5708 6.56563 22.1719 8.69688 24.3031C10.8281 26.4344 13.4292 27.5 16.5 27.5Z'
                  fill='black'
                />
              </g>
            </svg>
          </section>

          <section className={cn(styles.main)}>
            <h2>{loc.grabAllImagesLabel}</h2>

            {!isLoading && (
              <Button
                onClick={() => {
                  run();
                }}
                className={'mt-[.5rem]'}
                style={{}}
                id={'loading-initiator'}
              >
                {loc.grabButton}
              </Button>
            )}
          </section>

          <section className={cn(styles.info)}>
            <Link to={'/help'}>
              <svg
                viewBox='0 0 33 33'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
                onClick={() => {
                  setHelpShown(true);
                }}
              >
                <mask
                  id='mask0_38_7'
                  style={{
                    mask: 'alpha'
                  }}
                  maskUnits='userSpaceOnUse'
                  x='0'
                  y='0'
                  width='33'
                  height='33'
                >
                  <rect width='33' height='33' fill='#D9D9D9' />
                </mask>
                <g mask='url(#mask0_38_7)'>
                  <path
                    d='M16.4312 24.75C16.9125 24.75 17.3193 24.5839 17.6516 24.2516C17.9839 23.9193 18.15 23.5125 18.15 23.0312C18.15 22.55 17.9839 22.1432 17.6516 21.8109C17.3193 21.4786 16.9125 21.3125 16.4312 21.3125C15.95 21.3125 15.5432 21.4786 15.2109 21.8109C14.8786 22.1432 14.7125 22.55 14.7125 23.0312C14.7125 23.5125 14.8786 23.9193 15.2109 24.2516C15.5432 24.5839 15.95 24.75 16.4312 24.75ZM15.1938 19.4563H17.7375C17.7375 18.7 17.8234 18.1042 17.9953 17.6688C18.1672 17.2333 18.6542 16.6375 19.4563 15.8813C20.0521 15.2854 20.5219 14.7182 20.8656 14.1797C21.2094 13.6411 21.3813 12.9938 21.3813 12.2375C21.3813 10.9542 20.9115 9.96875 19.9719 9.28125C19.0323 8.59375 17.9208 8.25 16.6375 8.25C15.3313 8.25 14.2714 8.59375 13.4578 9.28125C12.6443 9.96875 12.0771 10.7938 11.7563 11.7563L14.025 12.65C14.1396 12.2375 14.3974 11.7906 14.7984 11.3094C15.1995 10.8281 15.8125 10.5875 16.6375 10.5875C17.3708 10.5875 17.9208 10.788 18.2875 11.1891C18.6542 11.5901 18.8375 12.0312 18.8375 12.5125C18.8375 12.9708 18.7 13.4005 18.425 13.8016C18.15 14.2026 17.8063 14.575 17.3938 14.9188C16.3854 15.8125 15.7667 16.4885 15.5375 16.9469C15.3083 17.4052 15.1938 18.2417 15.1938 19.4563ZM16.5 30.25C14.5979 30.25 12.8104 29.8891 11.1375 29.1672C9.46458 28.4453 8.00937 27.4656 6.77187 26.2281C5.53437 24.9906 4.55469 23.5354 3.83281 21.8625C3.11094 20.1896 2.75 18.4021 2.75 16.5C2.75 14.5979 3.11094 12.8104 3.83281 11.1375C4.55469 9.46458 5.53437 8.00937 6.77187 6.77187C8.00937 5.53437 9.46458 4.55469 11.1375 3.83281C12.8104 3.11094 14.5979 2.75 16.5 2.75C18.4021 2.75 20.1896 3.11094 21.8625 3.83281C23.5354 4.55469 24.9906 5.53437 26.2281 6.77187C27.4656 8.00937 28.4453 9.46458 29.1672 11.1375C29.8891 12.8104 30.25 14.5979 30.25 16.5C30.25 18.4021 29.8891 20.1896 29.1672 21.8625C28.4453 23.5354 27.4656 24.9906 26.2281 26.2281C24.9906 27.4656 23.5354 28.4453 21.8625 29.1672C20.1896 29.8891 18.4021 30.25 16.5 30.25ZM16.5 27.5C19.5708 27.5 22.1719 26.4344 24.3031 24.3031C26.4344 22.1719 27.5 19.5708 27.5 16.5C27.5 13.4292 26.4344 10.8281 24.3031 8.69688C22.1719 6.56563 19.5708 5.5 16.5 5.5C13.4292 5.5 10.8281 6.56563 8.69688 8.69688C6.56563 10.8281 5.5 13.4292 5.5 16.5C5.5 19.5708 6.56563 22.1719 8.69688 24.3031C10.8281 26.4344 13.4292 27.5 16.5 27.5Z'
                    fill='black'
                  />
                </g>
              </svg>
            </Link>
          </section>

          <Overlay
            backdrop={{
              blurAmount: 0,
              blurColor: 'rgba(255, 255, 255, 0.5)'
            }}
            className={'flex-col gap-[1.25rem] z-[var(--loading-overlay)]'}
            id={'grabbing-images-overlay'}
            trigger={isLoading}
            blockScroll
            flexCenter
          >
            <Loader type={'wave'} mainColor={'black'} />

            {/*<Button onClick={terminate} variant={'cancel'}>*/}
            {/*  {loc.cancelGrabbing}*/}
            {/*</Button>*/}
          </Overlay>
        </header>

        <Masonry
          columns={gridSize.get()}
          className={cn(
            styles.masonry,
            'gap-[.1rem]',
            !isUndefined(result) && result.length === 0 && styles.noGrow
          )}
        >
          {getImageColumns(result).map((col, columnIndex) => {
            return (
              <Column>
                {col?.map((src, rowIndex) => {
                  return (
                    <Block
                      key={`block-${columnIndex}-${rowIndex}`}
                      className={cn(styles.block)}
                    >
                      <ImageView
                        loaderColorScheme={{
                          backgroundColor: 'transparent',
                          loaderColor: 'black',
                          type: 'wave'
                        }}
                        src={src}
                        alt={`masonry-column-${columnIndex}-row-${rowIndex}`}
                        onClick={() => {
                          if (!isOpen) {
                            openGallery(src);
                            return;
                          }
                        }}
                      />
                    </Block>
                  );
                })}
              </Column>
            );
          })}
        </Masonry>

        {!isUndefined(result) && result.length === 0 && (
          <div className={cn(styles.noResults)}>
            <ProgressiveImage
              loaderColorScheme={{
                backgroundColor: 'transparent',
                loaderColor: 'black'
              }}
              src={noResultIcon}
              alt={'No result icon'}
            />
            {loc.noResults}
          </div>
        )}

        <Gallery />

        {!isUndefined(result) && result.length > 0 && (
          <footer className={cn(styles.controlsBlock)}>
            {gridSize.get()}

            <Slider
              defaultValue={3}
              marks
              step={1}
              min={1}
              max={5}
              value={gridSize.get()}
              valueLabelDisplay={'off'}
              onChange={ev => {
                // @ts-ignore
                gridSize.set(ev.target.value);
              }}
              getAriaValueText={(value, index) => {
                return `${index}`;
              }}
            />
          </footer>
        )}
      </section>
    </Page>
  );
};

export default MainPage;
