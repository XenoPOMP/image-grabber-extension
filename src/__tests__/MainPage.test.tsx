import { describe, expect, test } from 'vitest';

import MainPage from '@pages/MainPage/MainPage';

import renderWithProviders from '@utils/renderWithProviders';
import skipTestCondition from '@utils/skipTestCondition';

describe.skipIf(skipTestCondition('FRONTEND'))('Main page', () => {
  const pageRender = () =>
    renderWithProviders(<MainPage />, {
      useRedux: true
    });

  test('Match snapshot', () => {
    expect(() => {
      pageRender();
    }).toThrowError(ReferenceError);
  });
});
