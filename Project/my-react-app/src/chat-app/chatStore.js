import { create } from 'zustand';
import localStorageService from './localStorageService'

const useChatStore = create((set, get) => ({
  messages: localStorageService.getMessages(),

  addMessage: (user, text) => {
    const newMessage = {
      id: Date.now(),
      user,
      text,
    };
    localStorageService.saveMessage(newMessage);
    set({ messages: [...get().messages, newMessage] });
  },

  deleteMessage: (id) => {
    const updated = get().messages.filter((m) => m.id !== id);
    localStorageService.saveMessages(updated);
    set({ messages: updated });
  },

  clearAll: () => {
    localStorageService.clearMessages();
    set({ messages: [] });
  },
}));

export default useChatStore;
