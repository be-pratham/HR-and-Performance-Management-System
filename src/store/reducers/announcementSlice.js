import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  list: [],
  unreadCount: 0,
};

const announcementSlice = createSlice({
  name: 'announcements',
  initialState,
  reducers: {
    setAnnouncements: (state, action) => {
      state.list = action.payload;
      state.unreadCount = action.payload.filter(a => !a.read).length;
    },
    addAnnouncement: (state, action) => {
      // payload: { title, content, targetRole, scheduleDate, etc }
      state.list.unshift({ 
        ...action.payload, 
        id: Date.now(), 
        read: false,
        date: new Date().toISOString().split('T')[0] 
      });
      state.unreadCount += 1;
    },
    deleteAnnouncement: (state, action) => {
      state.list = state.list.filter(a => a.id !== action.payload);
    }
  }
});

export const { setAnnouncements, addAnnouncement, deleteAnnouncement } = announcementSlice.actions;
export default announcementSlice.reducer;