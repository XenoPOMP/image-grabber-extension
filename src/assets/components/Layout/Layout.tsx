import { FC } from 'react';

import MessageManager from '@components/MessageManager/MessageManager';

import GlobalProvider from '@providers/GlobalProvider/GlobalProvider';

import { PropsWith } from '@type/PropsWith';

import { LayoutProps } from './Layout.props';

/**
 * App layout component.
 *
 * @param children
 * @constructor
 */
const Layout: FC<PropsWith<'children', LayoutProps>> = ({ children }) => {
  return (
    <GlobalProvider>
      <MessageManager />

      <main>{children}</main>
    </GlobalProvider>
  );
};

export default Layout;
