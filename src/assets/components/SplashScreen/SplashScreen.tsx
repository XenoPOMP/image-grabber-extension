import cn from 'classnames';
import { motion } from 'framer-motion';
import { FC } from 'react';

import Loader from '@ui/Loader/Loader';

import styles from './SplashScreen.module.scss';
import type { SplashScreenProps } from './SplashScreen.props';

const SplashScreen: FC<SplashScreenProps> = ({}) => {
  return (
    <motion.div
      initial={{
        opacity: 0,
        pointerEvents: 'none'
      }}
      animate={{
        opacity: 1,
        pointerEvents: 'all'
      }}
      exit={{
        opacity: 0,
        pointerEvents: 'none'
      }}
      className={cn(styles.splashScreen)}
    >
      <Loader type={'circle'} mainColor={'black'} />
    </motion.div>
  );
};

export default SplashScreen;
