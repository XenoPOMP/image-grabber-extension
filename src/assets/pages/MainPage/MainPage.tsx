import chunk from 'chunk';
import cn from 'classnames';
import { useState } from 'react';
import TextOverflow from 'react-text-overflow';
import scrapSite from 'ts-website-scrapper';

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

import { isUndefined } from '@utils/type-checks';

import styles from './MainPage.module.scss';

const MainPage = () => {
  const loc = useLocalization();

  const { createMessage } = useMessageManager();

  const [siteName, setSiteName] = useState<string | undefined>(undefined);
  /** Replace WebWorker with states and async. */
  const [result, setResult] = useState<string[] | undefined>(undefined);
  const [isLoading, toggleIsLoading, setIsLoading] = useBoolean(false);

  const run = async () => {
    setIsLoading(true);

    if (isUndefined(chrome?.tabs)) {
      createMessage({
        text: loc.chromeApiNotResponding,
        type: 'warn'
      });

      setIsLoading(false);
      return;
    }

    chrome?.tabs?.query({ active: true }, tabs => {
      const activeTab = tabs[0];

      const mockUrl = 'https://9to5answer.com/chrome-can-39-t-load-web-worker';

      scrapSite(
        activeTab.url,
        {
          headers: {
            'Access-Control-Allow-Origin': '*'
          }
        },
        'html'
      )
        .then(selector => {
          const $ = selector.loader;
          const root = selector.root;

          const preResult: typeof result = [];

          $(root)
            .find('img')
            .each((i, elem) => {
              const source = $(elem).attr('src')
                ? ($(elem).attr('src') as string)
                : '';

              preResult.push(
                /^https:\/\/.*/gi.test(source)
                  ? source // Path is absolute
                  : new URL(source, activeTab.url).toString() // Path is relative
              );
            });

          setResult(Array.from(new Set(preResult)));
        })
        .catch(err => {
          createMessage({
            text: 'Failed to fetch images',
            type: 'error'
          });
        })
        .finally(() => {
          setIsLoading(false);
        });
    });
  };

  const getImageColumns = (): Record<
    'first' | 'second' | 'third',
    string[]
  > => {
    const chunkedImageArray: string[][] =
      result !== null && result !== undefined ? chunk(result, 3) : [];

    const firstColumn: string[] = chunkedImageArray.map(chunk => chunk[0]);
    const secondColumn: string[] = chunkedImageArray.map(chunk => chunk[1]);
    const thirdColumn: string[] = chunkedImageArray.map(chunk => chunk[2]);

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
          <h2>
            {loc.grabAllImagesLabel
              .split(/(\{SITE_NAME})/gi)
              .filter(word => {
                return word !== '';
              })
              .map(word => {
                if (/\{SITE_NAME}/gi.test(word)) {
                  return (
                    <span
                      className={cn(styles.siteName)}
                      style={{
                        maxWidth: '10rem'
                      }}
                    >
                      <TextOverflow text={siteName ? siteName : ''} />
                    </span>
                  );
                }

                return <span>{word}</span>;
              })}
          </h2>

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

        <Masonry className={cn(styles.masonry, 'gap-[.1rem]')}>
          <Column>
            {getImageColumns().first.map((src, index) => {
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
            {getImageColumns().second.map((src, index) => {
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
            {getImageColumns().third.map((src, index) => {
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
      </section>
    </Page>
  );
};

export default MainPage;
