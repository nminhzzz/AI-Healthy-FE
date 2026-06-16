import { create } from 'zustand';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatState {
  messages: ChatMessage[];
  isOpen: boolean;
  isLoading: boolean;

  addMessage: (msg: ChatMessage) => void;
  toggleChat: () => void;
  setLoading: (val: boolean) => void;
  clearMessages: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  isOpen: false,
  isLoading: false,

  addMessage: (msg) =>
    set((state) => ({ messages: [...state.messages, msg] })),

  toggleChat: () => set((state) => ({ isOpen: !state.isOpen })),

  setLoading: (val) => set({ isLoading: val }),

  clearMessages: () => set({ messages: [] }),
}));
