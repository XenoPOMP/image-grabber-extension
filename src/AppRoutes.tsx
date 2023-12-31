import { AnimatePresence } from 'framer-motion';
import React, { FC } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import HelpPage from '@pages/HelpPage/HelpPage';
import MainPage from '@pages/MainPage/MainPage';
import NotFound from '@pages/NotFound/NotFound';

/**
 * Root component of application routes.
 *
 * @param {boolean} pageTransitions      determines whether animated page
 *                                       transitions will be enabled.
 * @constructor
 */
const AppRoutes: FC<{
  pageTransitions?: boolean;
}> = ({ pageTransitions }) => {
  const location = useLocation();

  /**
   * This component contains all application routes.
   *
   * Add new routes here.
   *
   * @constructor
   */
  const RoutesNode: FC<unknown> = () => {
    return (
      <Routes location={location} key={location.pathname}>
        <Route path={'*'} element={<NotFound />} />

        <Route path={'/index.html'} element={<MainPage />} index />

        <Route path={'/help'} element={<HelpPage />} />
      </Routes>
    );
  };

  return pageTransitions ? (
    <AnimatePresence>
      <RoutesNode key={location.pathname} />
    </AnimatePresence>
  ) : (
    <RoutesNode />
  );
};

export default AppRoutes;
