import { describe, expect, test } from 'vitest';

import appSettingsSlice, {
  AppSettings,
  changeLang
} from '@redux/reducers/appSettingsSlice';
import { ReduxAction } from '@redux/types';

import skipTestCondition from '@utils/skipTestCondition';

describe.skipIf(skipTestCondition('FRONTEND'))('Redux => AppSettings', () => {
  test('change language with "changeLang" action', () => {
    const action: ReduxAction<AppSettings['language']> = {
      type: changeLang.type,
      payload: 'ru'
    };

    const result = appSettingsSlice(undefined, action);

    expect(result.language).toBe('ru');
  });
});
