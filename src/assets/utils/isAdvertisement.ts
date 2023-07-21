import { isUndefined } from '@utils/type-checks';

/**
 * Check if provided URL is ad source.
 *
 * @param str
 */
export const isAdvertisement = (str?: string): boolean => {
  const pattern: string = [
    'https://adservice.google.com',
    'https://ae04.alicdn.com',
    'https://insight.adsrvr.org',
    'buysellads.net'
  ]
    .map(pattern => `(${pattern})`)
    .join('|');

  return !isUndefined(str) && new RegExp(pattern, 'gi').test(str);
};
