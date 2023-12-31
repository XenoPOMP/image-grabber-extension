import { describe, expect, test } from 'vitest';

import numericGenerator from '@utils/numericGenerator';
import skipTestCondition from '@utils/skipTestCondition';

/**
 * Test numericGenerator function.
 *
 * This function has to return array of defined length.
 */

describe.skipIf(skipTestCondition('FRONTEND'))('Numeric generator', () => {
  test('Function return array', () => {
    expect(numericGenerator(4)).toStrictEqual([0, 1, 2, 3]);
  });

  test('Length = 0', () => {
    expect(numericGenerator(0)).toStrictEqual([]);
  });

  test('Length < 0', () => {
    expect(() => numericGenerator(-1)).toThrowError(/generator/i);
  });
});
