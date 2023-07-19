import { createSlice } from '@reduxjs/toolkit';

import type { ReduxAction } from '@redux/types';

export type AppSettings = {
  appVersion: string;
  appName: string;
  language: 'en' | 'ru';
  gridSize: 1 | 2 | 3 | 4 | 5;
};

const initialState: AppSettings = {
  appVersion: '1.0.0',
  appName: 'React Vite Application',
  language: 'en',
  gridSize: 3
};

const appSettingsSlice = createSlice({
  name: 'appSettings',
  initialState,
  reducers: {
    /** Change language with action. */
    changeLang(state, action: ReduxAction<AppSettings['language']>) {
      state.language = action.payload;
    },

    /** Change size of grid. */
    changeGridSize(state, action: ReduxAction<AppSettings['gridSize']>) {
      state.gridSize = action.payload;
    }
  }
});

export default appSettingsSlice.reducer;
export const { changeLang, changeGridSize } = appSettingsSlice.actions;
export const initialAppSettings = appSettingsSlice.getInitialState();
