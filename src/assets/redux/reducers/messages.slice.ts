import { createSlice } from '@reduxjs/toolkit';
import { ReactNode } from 'react';

import type { ReduxAction } from '@redux/types';

export type Message = {
  id: string;
  text: string;
  completed: boolean;
  type: 'message' | 'error' | 'warn';
};

export type MessagesState = {
  messages: Message[];
};

const initialState: MessagesState = {
  messages: []
};

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    /** Create message. */
    createNewMessage(state, action: ReduxAction<Message>) {
      state.messages = [...state.messages, action.payload];
    },

    /** Delete message. */
    deleteMessage(state, action: ReduxAction<Message['id']>) {
      state.messages
        .filter(message => message.id == action.payload)
        .forEach(message => (message.completed = true));
    }
  }
});

export default messagesSlice.reducer;
export const { createNewMessage, deleteMessage } = messagesSlice.actions;
export const initialMessagesState = messagesSlice.getInitialState();
