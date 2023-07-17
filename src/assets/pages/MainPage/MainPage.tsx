import cn from 'classnames';
import { useState } from 'react';

import Page from '@components/Page/Page';

import Button from '@ui/Button/Button';

import { useLocalization } from '@hooks/useLocalization';
import { useWebWorker } from '@hooks/useWebWorker';

import numericGenerator from '@utils/numericGenerator';
import { isUndefined } from '@utils/type-checks';

import styles from './MainPage.module.scss';

const MainPage = () => {
  const loc = useLocalization();

  const siteName = 'gogle.sus';

  const { result, isLoading, run, terminate } = useWebWorker<any>(() => {
    return null;
  });

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
                    <span className={cn(styles.siteName)}>{siteName}</span>
                  );
                }

                return <span>{word}</span>;
              })}
          </div>

          {isUndefined(result) && (
            <Button
              onClick={() => {
                console.log('Grab');
              }}
            >
              {loc.grabButton}
            </Button>
          )}
        </div>
      </div>
    </Page>
  );
};

export default MainPage;
