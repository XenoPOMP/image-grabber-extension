import { Localization, getChromeLocale } from '@localization/I18Locales';

export const useLocalization = (): Localization => {
  return {
    grabAllImagesLabel: getChromeLocale('grabAllImagesLabel'),
    grabButton: getChromeLocale('grabButton'),
    cancelGrabbing: getChromeLocale('cancelGrabbing'),
    chromeApiNotResponding: getChromeLocale('chromeApiNotResponding'),
    noActiveTab: getChromeLocale('noActiveTab'),
    failedToDownloadFile: getChromeLocale('failedToDownloadFile')
  };
};
