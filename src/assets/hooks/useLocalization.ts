import { Localization, getChromeLocale } from '@localization/I18Locales';

export const useLocalization = (): Localization => {
  return {
    grabAllImagesLabel: getChromeLocale('grabAllImagesLabel'),
    grabButton: getChromeLocale('grabButton'),
    cancelGrabbing: getChromeLocale('cancelGrabbing'),
    chromeApiNotResponding: getChromeLocale('chromeApiNotResponding'),
    noActiveTab: getChromeLocale('noActiveTab'),
    failedToDownloadFile: getChromeLocale('failedToDownloadFile'),
    imageCopied: getChromeLocale('imageCopied'),
    failedImageCopy: getChromeLocale('failedImageCopy'),
    infoFilename: getChromeLocale('infoFilename'),
    infoExtension: getChromeLocale('infoExtension'),
    infoFileSize: getChromeLocale('infoFileSize'),
    infoSource: getChromeLocale('infoSource'),
    infoFetchError: getChromeLocale('infoFetchError'),
    noResults: getChromeLocale('noResults'),
    galleryAdWarnHeading: getChromeLocale('galleryAdWarnHeading')
  };
};
