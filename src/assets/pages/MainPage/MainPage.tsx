import { Slider } from '@mui/material';
import chunk from 'chunk';
import cn from 'classnames';
import { ComponentProps, useState } from 'react';

import ImageView from '@components/ImageView/ImageView';
import Page from '@components/Page/Page';

import Button from '@ui/Button/Button';
import Loader from '@ui/Loader/Loader';
import Overlay from '@ui/Overlay/Overlay';
import Block from '@ui/masonry/Block/Block';
import Column from '@ui/masonry/Column/Column';
import Masonry from '@ui/masonry/Masonry/Masonry';

import useBoolean from '@hooks/useBoolean';
import { useLocalization } from '@hooks/useLocalization';
import { useMessageManager } from '@hooks/useMessageManager';

import { Defined } from '@type/Defined';
import { ImageSearchResult } from '@type/ImageSearchResult';

import { isUndefined } from '@utils/type-checks';

import styles from './MainPage.module.scss';

const MainPage = () => {
  /** This hook provides locale strings. Type-safe. */
  const loc = useLocalization();

  /** This hook allows to create messages to user. */
  const { createMessage } = useMessageManager();

  /** Replace WebWorker with states and async. */
  const [result, setResult] = useState<ImageSearchResult>(undefined);
  const [isLoading, toggleIsLoading, setIsLoading] = useBoolean(false);

  /** View settings. */
  const [gridSize, setGridSize] = useState<number>(3);

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

        return [...new Set(images)];
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

  /**
   * This function split results to chunks by
   * certain size, then returns each column as result array.
   */
  const getImageColumns = (): Record<
    'first' | 'second' | 'third',
    typeof result
  > => {
    const chunkedImageArray: typeof result[] =
      result !== null && result !== undefined ? chunk(result, 3) : [];

    const firstColumn: typeof result = chunkedImageArray.map(chunk =>
      !isUndefined(chunk) ? chunk[0] : undefined
    );
    const secondColumn: typeof result = chunkedImageArray.map(chunk =>
      !isUndefined(chunk) ? chunk[1] : undefined
    );
    const thirdColumn: typeof result = chunkedImageArray.map(chunk =>
      !isUndefined(chunk) ? chunk[2] : undefined
    );

    return {
      first: firstColumn,
      second: secondColumn,
      third: thirdColumn
    };
  };

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
          <h2>{loc.grabAllImagesLabel}</h2>

          {!isLoading && (
            <Button
              onClick={() => {
                run();
              }}
              className={'mt-[.5rem]'}
              style={{}}
            >
              {loc.grabButton}
            </Button>
          )}

          <Overlay
            backdrop={{
              blurAmount: 0,
              blurColor: 'rgba(255, 255, 255, 0.5)'
            }}
            className={'flex-col gap-[1.25rem]'}
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
          columns={gridSize}
          className={cn(styles.masonry, 'gap-[.1rem]')}
        >
          <Column>
            {getImageColumns().first?.map((src, index) => {
              const columnIndex = 1;

              return (
                <Block
                  key={`block-${columnIndex}-${index}`}
                  className={cn(styles.block)}
                >
                  <ImageView
                    loaderColorScheme={{
                      backgroundColor: 'transparent',
                      loaderColor: 'black',
                      type: 'wave'
                    }}
                    src={src}
                    alt={`masonry-column-${columnIndex}-row-${index}`}
                  />
                </Block>
              );
            })}
          </Column>

          <Column>
            {getImageColumns().second?.map((src, index) => {
              const columnIndex = 2;

              return (
                <Block
                  key={`block-${columnIndex}-${index}`}
                  className={cn(styles.block)}
                >
                  <ImageView
                    loaderColorScheme={{
                      backgroundColor: 'transparent',
                      loaderColor: 'black',
                      type: 'wave'
                    }}
                    src={src}
                    alt={`masonry-column-${columnIndex}-row-${index}`}
                  />
                </Block>
              );
            })}
          </Column>

          <Column>
            {getImageColumns().third?.map((src, index) => {
              const columnIndex = 3;

              return (
                <Block
                  key={`block-${columnIndex}-${index}`}
                  className={cn(styles.block)}
                >
                  <ImageView
                    loaderColorScheme={{
                      backgroundColor: 'transparent',
                      loaderColor: 'black',
                      type: 'wave'
                    }}
                    src={src}
                    alt={`masonry-column-${columnIndex}-row-${index}`}
                  />
                </Block>
              );
            })}
          </Column>
        </Masonry>

        {((!isUndefined(result) && result.length > 0) || true) && (
          <footer className={cn(styles.controlsBlock)}>
            {gridSize}

            <Slider
              defaultValue={3}
              marks
              step={1}
              min={1}
              max={5}
              value={gridSize}
              valueLabelDisplay={'off'}
              onChange={ev => {
                // @ts-ignore
                setGridSize(ev.target.value);
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
