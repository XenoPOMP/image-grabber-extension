import type { I18Locales } from '../I18Locales';

export const en: I18Locales = {
  grabAllImagesLabel: {
    message: 'Grab all images',
    description: `Label in main page. Replace {SITE_NAME} with current site name.`
  },

  grabButton: {
    message: 'Grab',
    description: 'Grab button text.'
  },

  cancelGrabbing: {
    message: 'Cancel',
    description: 'Grab cancel button text.'
  },

  chromeApiNotResponding: {
    message: 'Chrome API is not responding',
    description: 'Chrome API not responding message.'
  },

  noActiveTab: {
    message: 'No one page is selected!',
    description: 'Warn message that is displaying if no one page is active now.'
  },

  failedToDownloadFile: {
    message: 'File download failed',
    description: 'File downloading error message.'
  },

  imageCopied: {
    message: 'Copied',
    description: 'Image copy success message.'
  },

  failedImageCopy: {
    message: 'Failed to copy image',
    description: 'Image copy fail message.'
  },

  infoFilename: {
    message: 'File name',
    description: 'File name label in info.'
  },

  infoExtension: {
    message: 'Extension',
    description: 'Extension label in info.'
  },

  infoFileSize: {
    message: 'File size',
    description: 'File size label in info.'
  },

  infoSource: {
    message: 'Source',
    description: 'Source label in info.'
  },

  infoFetchError: {
    message: 'There is no information about this file',
    description:
      'This error comes out when the user wanted to view information about the file, but it was not found.'
  },

  noResults: {
    message: 'We dont seem to have found anything',
    description:
      'This inscription appears when no photos were found on the page.'
  }
};
