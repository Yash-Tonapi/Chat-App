import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  unreadMessages: {}, // Track unread messages for each user { userId: count }

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },
  
  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
      set({ messages: [...messages, res.data] });
      
      // Move the receiver to the top of the sidebar for the sender
      get().moveUserToTop(selectedUser._id);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  subscribeToMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    socket.on("newMessage", (newMessage) => {
      // Always move the sender to the top of the sidebar
      get().moveUserToTop(newMessage.senderId);
      
      const { selectedUser, unreadMessages } = get();
      
      // Only update messages if it's from the selected user
      if (selectedUser && newMessage.senderId === selectedUser._id) {
        set({
          messages: [...get().messages, newMessage],
        });
      } else {
        // If it's not from the selected user, mark it as unread
        const currentUnread = unreadMessages[newMessage.senderId] || 0;
        set({
          unreadMessages: {
            ...unreadMessages,
            [newMessage.senderId]: currentUnread + 1
          }
        });
      }
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },

  // Move user to top of the sidebar when they send/receive a message
  moveUserToTop: (userId) => {
    const { users } = get();
    const userIndex = users.findIndex(user => user._id === userId);
    
    if (userIndex > 0) { // Only move if user is not already at the top
      const userToMove = users[userIndex];
      const newUsers = [userToMove, ...users.slice(0, userIndex), ...users.slice(userIndex + 1)];
      set({ users: newUsers });
    }
  },

  setSelectedUser: (selectedUser) => {
    // Clear unread messages for the selected user
    const { unreadMessages } = get();
    const newUnreadMessages = { ...unreadMessages };
    if (selectedUser && newUnreadMessages[selectedUser._id]) {
      delete newUnreadMessages[selectedUser._id];
    }
    
    set({ 
      selectedUser,
      unreadMessages: newUnreadMessages
    });
  },

  // Clear unread messages for a specific user
  clearUnreadMessages: (userId) => {
    const { unreadMessages } = get();
    const newUnreadMessages = { ...unreadMessages };
    delete newUnreadMessages[userId];
    set({ unreadMessages: newUnreadMessages });
  },
}));