import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UiState {
  isChatOpen: boolean;
  unreadChatMessages: number;
}

const initialState: UiState = {
  isChatOpen: false,
  unreadChatMessages: 0,
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleChat: (state) => {
      state.isChatOpen = !state.isChatOpen;
    },
    setChatOpen: (state, action: PayloadAction<boolean>) => {
      state.isChatOpen = action.payload;
    },
    incrementUnreadMessages: (state) => {
      if (!state.isChatOpen) {
        state.unreadChatMessages += 1;
      }
    },
    clearUnreadMessages: (state) => {
      state.unreadChatMessages = 0;
    },
  },
});

export const { toggleChat, setChatOpen, incrementUnreadMessages, clearUnreadMessages } = uiSlice.actions;
export default uiSlice.reducer;
