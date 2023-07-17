import { CSSProperties, ComponentProps } from 'react';

import Loader from '@ui/Loader/Loader';

export interface ProgressiveImageProps {
  src?: string;
  alt?: string;
  // className?: string;
  // style?: CSSProperties;
  loaderColorScheme: {
    backgroundColor: string;
    loaderColor: string;
    type?: ComponentProps<typeof Loader>['type'];
  };
}
