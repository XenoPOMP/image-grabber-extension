import React from 'react';
import { Link } from 'react-router-dom';

import Page from '@components/Page/Page';

import Button from '@ui/Button/Button';

const NotFound = () => {
  return (
    <Page meta={{ title: '404', description: '', keywords: '' }} noIndex>
      <Link to={'/index.html'}>
        <Button>Go to main page</Button>
      </Link>
    </Page>
  );
};

export default NotFound;
