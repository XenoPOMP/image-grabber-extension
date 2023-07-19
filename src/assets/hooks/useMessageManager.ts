import { v4 as uuid } from 'uuid';

import { useAppDispatch } from '@redux/hooks';
import {
  MessagesState,
  createNewMessage,
  deleteMessage
} from '@redux/reducers/messages.slice';

import { ArrayType } from '@type/ArrayType';

export const useMessageManager = (): {
  createMessage: (
    message: Omit<ArrayType<MessagesState['messages']>, 'id' | 'completed'>
  ) => void;

  deleteMessage: (id: ArrayType<MessagesState['messages']>['id']) => void;
} => {
  const dispatch = useAppDispatch();

  return {
    createMessage: message => {
      const id: Pick<ArrayType<MessagesState['messages']>, 'id'>['id'] = uuid();

      dispatch(createNewMessage({ ...message, id, completed: false }));
    },

    deleteMessage: id => {
      dispatch(deleteMessage(id));
    }
  };
};
