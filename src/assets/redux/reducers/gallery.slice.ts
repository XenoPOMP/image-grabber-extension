import { createSlice } from '@reduxjs/toolkit';

import type { ReduxAction } from '@redux/types';

import { ImageSearchResult } from '@type/ImageSearchResult';

import numericGenerator from '@utils/numericGenerator';
import { isUndefined } from '@utils/type-checks';

export type GalleryState = {
  slides: ImageSearchResult;
  currentSlide: number;
};

const initialState: GalleryState = {
  slides: undefined,
  currentSlide: -1
};

const gallerySlice = createSlice({
  name: 'gallery',
  initialState,
  reducers: {
    openSlide(state, action: ReduxAction<GalleryState['currentSlide']>) {
      /** Check if gallery slides exist and index is correct. */
      if (
        !isUndefined(state.slides) &&
        state.slides.length > 0 &&
        numericGenerator(state.slides.length).includes(action.payload)
      ) {
      }
    }
  }
});

export default gallerySlice.reducer;
export const { openSlide } = gallerySlice.actions;
export const initialGalleryState = gallerySlice.getInitialState();
