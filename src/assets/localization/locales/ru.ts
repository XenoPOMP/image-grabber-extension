import type { I18Locales } from '../I18Locales';

export const ru: I18Locales = {
  grabAllImagesLabel: {
    message: 'Захватите все изображения',
    description: `Заголовок на главной странице. Замените {SITE_NAME} на текущее название сайта.`
  },

  grabButton: {
    message: 'Захватить',
    description: 'Текст кнопки, отвечающей за захват изображений.'
  },

  cancelGrabbing: {
    message: 'Отменить',
    description: 'Текст кнопки, отвечающей за отмену захвата изображений.'
  },

  chromeApiNotResponding: {
    message: 'API Chrome не отвечает',
    description:
      'Сообщение о том, что приложение не смогло связаться с API Chrome.'
  },

  noActiveTab: {
    message: 'Не выбрана ни одна из страниц!',
    description:
      'Сообщение о том, что пользователь не выбрал ни одну из страниц.'
  },

  failedToDownloadFile: {
    message: 'Не удалось скачать файл',
    description:
      'Сообщение об ошибке, которое появляется тогда, когда не удалось скачать файл.'
  },

  imageCopied: {
    message: 'Скопировано',
    description: 'Сообщение о том, что изображение было скопировано.'
  },

  failedImageCopy: {
    message: 'Ошибка при копировании',
    description:
      'Сообщение о том, произошла ошибка при копировании изображения.'
  }
};
