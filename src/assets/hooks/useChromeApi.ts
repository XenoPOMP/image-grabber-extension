import { useLocalization } from '@hooks/useLocalization';
import { useMessageManager } from '@hooks/useMessageManager';

import { isUndefined } from '@utils/type-checks';

export const useChromeApi = (): typeof chrome | undefined => {
  const loc = useLocalization();
  const { createMessage } = useMessageManager();

  if (isUndefined(chrome)) {
    createMessage({
      text: loc.chromeApiNotResponding,
      type: 'warn'
    });

    return undefined;
  }

  return chrome;
};
