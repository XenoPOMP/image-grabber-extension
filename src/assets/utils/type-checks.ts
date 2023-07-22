/**
 * Checks if value is undefined;
 *
 * @param value
 *
 * @example
 * let value;
 *
 * // true
 * isUndefined(value);
 *
 * // false
 * isUndefined('Surely not undefined thing');
 */
export const isUndefined = (value: any): value is undefined => {
  return value === undefined;
};

/**
 * Checks if value is null.
 *
 * @param value
 */
export const isNull = (value: any): value is null => {
  return value === null;
};
