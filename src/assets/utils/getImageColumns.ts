import chunk from 'chunk';

import useAppSettings from '@hooks/useAppSettings';

import { Defined } from '@type/Defined';
import { ImageSearchResult } from '@type/ImageSearchResult';

import { isUndefined } from '@utils/type-checks';

/**
 * This function split results to chunks by
 * certain size, then returns each column as result array.
 */
export const getImageColumns = (
  result: ImageSearchResult
): ImageSearchResult[] => {
  const { gridSize } = useAppSettings();

  const chunkedArray =
    result !== null && result !== undefined
      ? chunk(result, gridSize.get())
      : [];

  let output: Defined<typeof result>[] = [];

  chunkedArray.forEach((group, groupIndex) => {
    group.forEach((src, blockIndex) => {
      if (isUndefined(output[blockIndex])) {
        output[blockIndex] = [];
      }

      if (isUndefined(output[blockIndex][groupIndex])) {
        output[blockIndex][groupIndex] = '';
      }

      output[blockIndex][groupIndex] = src;
    });
  });

  return output;
};
