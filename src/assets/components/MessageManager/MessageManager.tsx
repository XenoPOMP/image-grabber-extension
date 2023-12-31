import cn from 'classnames';
import { FC, useEffect, useState } from 'react';
import TextOverflow from 'react-text-overflow';

import { useAppSelector } from '@redux/hooks';
import { Message, MessagesState } from '@redux/reducers/messages.slice';

import useBoolean from '@hooks/useBoolean';
import { useMessageManager } from '@hooks/useMessageManager';

import styles from './MessageManager.module.scss';
import type { MessageManagerProps } from './MessageManager.props';

const MessageManager: FC<MessageManagerProps> = ({}) => {
  const { messages }: MessagesState = useAppSelector(state => state.messages);
  const { deleteMessage } = useMessageManager();

  const [incompleteMessages, setIncompleteMessages] =
    useState<MessagesState['messages']>(messages);

  const latestMessage: Message = incompleteMessages.reverse()[0];

  const [shown, toggleShown, setShown] = useBoolean(false);

  useEffect(() => {
    setIncompleteMessages(messages.filter(message => !message.completed));
    setShown(messages.map(message => message.completed).includes(false));
  }, [messages]);

  const getInlineClasses = (): string => {
    const shownClass = shown ? styles.shown : '';
    let typeClass = '';

    switch (latestMessage?.type) {
      case 'error': {
        typeClass = styles.error;
        break;
      }

      case 'warn': {
        typeClass = styles.warn;
        break;
      }
    }

    return cn(shownClass, typeClass);
  };

  return (
    <div className={cn(styles.manager)}>
      <div className={cn(styles.messageBody, getInlineClasses())}>
        <TextOverflow text={latestMessage?.text} />

        <svg
          height={16}
          width={16}
          viewBox='0 0 16 16'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
          onClick={() => {
            deleteMessage(latestMessage?.id);
          }}
        >
          <path
            fillRule='evenodd'
            clipRule='evenodd'
            d='M8 6.81482L1.18519 0L0 1.18519L6.81482 8L0 14.8148L1.18519 16L8 9.18519L14.8148 16L16 14.8148L9.18519 8L16 1.18519L14.8148 2.73043e-06L8 6.81482Z'
            fill='white'
          />
          <path
            fillRule='evenodd'
            clipRule='evenodd'
            d='M8 6.81482L1.18519 0L0 1.18519L6.81482 8L0 14.8148L1.18519 16L8 9.18519L14.8148 16L16 14.8148L9.18519 8L16 1.18519L14.8148 2.73043e-06L8 6.81482Z'
            fill='white'
          />
        </svg>
      </div>
    </div>
  );
};

export default MessageManager;
