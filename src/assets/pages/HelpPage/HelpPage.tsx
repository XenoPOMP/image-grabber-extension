import cn from 'classnames';
import { FC } from 'react';

import Page from '@components/Page/Page';

import styles from './HelpPage.module.scss';
import type { HelpPageProps } from './HelpPage.props';

const HelpPage: FC<HelpPageProps> = ({}) => {
  return (
    <Page meta={{ title: 'Help', description: '', keywords: '' }} noIndex>
      <div className={cn(styles.helpPage)}>Help page</div>
    </Page>
  );
};

export default HelpPage;
