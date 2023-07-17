import chunk from 'chunk';
import cn from 'classnames';
import { useEffect, useState } from 'react';
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

import { useLocalization } from '@hooks/useLocalization';
import { useWebWorker } from '@hooks/useWebWorker';

import { isUndefined } from '@utils/type-checks';

import styles from './MainPage.module.scss';

import Tab = chrome.tabs.Tab;

const MainPage = () => {
  const loc = useLocalization();

  const [siteName, setSiteName] = useState<string | undefined>(undefined);

  chrome.tabs.getCurrent(tab => {
    setSiteName(tab?.url);
  });

  const { result, isLoading, run, terminate } = useWebWorker<string[] | null>(
    () => {
      const imageList: string[] = [
        [
          'https://i.pinimg.com/originals/5d/0d/29/5d0d2976ed9271ec37cccf43865465d7.jpg',
          'https://w.forfun.com/fetch/fd/fdae64af844de682575ce06074f0be89.jpeg',
          'https://image.winudf.com/v2/image/Y29tLkNoaWVmV2FsbHBhcGVycy5MYWIxMDhfc2NyZWVuc2hvdHNfMF8xMjgwYWM4MA/screen-0.jpg?fakeurl=1&type=.jpg'
        ],
        ['src4', 'src5', 'src6']
      ].flat();

      const queryImages: string[] = (() => {
        const images: string[] = [];

        // scrapSite(siteName, 'html').then(selector => {
        //   const $ = selector.loader;
        //   const root = selector.root;
        //
        //   $(root)
        //     .find('img')
        //     .each((i, elem) => {
        //       console.log({
        //         i,
        //         elem
        //       });
        //     });
        // });

        return images;
      })();

      return imageList;
    }
  );

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
      <div className={cn(styles.mainPage)}>
        <div className={cn(styles.label)}>
          <div>
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
          </div>

          {isUndefined(result) && (
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

            <Button onClick={terminate} variant={'cancel'}>
              {loc.cancelGrabbing}
            </Button>
          </Overlay>
        </div>

        <div className={cn(styles.masonry)}>
          <Masonry className={cn('gap-[.1rem]')}>
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
        </div>
      </div>
    </Page>
  );
};

export default MainPage;
