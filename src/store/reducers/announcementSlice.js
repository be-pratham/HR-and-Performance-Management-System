import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  list: [],
  unreadCount: 0,
  loading: false,
  error: null,
};

const announcementSlice = createSlice({
  name: 'announcements',
  initialState,
  reducers: {
    // Used when fetching announcements from your API
    setAnnouncements: (state, action) => {
      state.list = action.payload;
      state.unreadCount = action.payload.filter(a => !a.read).length;
    },
    addAnnouncement: (state, action) => {
      state.list.unshift(action.payload); // Add to the top of the list
      state.unreadCount += 1;
    },
    markAsRead: (state, action) => {
      const announcement = state.list.find(a => a.id === action.payload);
      if (announcement && !announcement.read) {
        announcement.read = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    deleteAnnouncement: (state, action) => {
      state.list = state.list.filter(a => a.id !== action.payload);
    }
  }
});

export const { 
  setAnnouncements, addAnnouncement, markAsRead, deleteAnnouncement 
} = announcementSlice.actions;

export default announcementSlice.reducer;