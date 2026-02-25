import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  pendingList: [], // Array of objects: { id, type: 'Goal' | 'Leave', requesterName, details }
  history: [],     // Keep track of what was approved/rejected this session
  loading: false,
  error: null,
};

const approvalSlice = createSlice({
  name: 'approvals',
  initialState,
  reducers: {
    setPendingApprovals: (state, action) => {
      state.pendingList = action.payload;
    },
    // Handles both Approve and Reject
    processRequest: (state, action) => {
      const { id, status, comments } = action.payload; // status: 'Approved' | 'Rejected'
      
      // 1. Find the request
      const requestIndex = state.pendingList.findIndex(req => req.id === id);
      
      if (requestIndex !== -1) {
        // 2. Move it to history
        const processedItem = { 
          ...state.pendingList[requestIndex], 
          status, 
          comments,
          processedAt: new Date().toISOString()
        };
        state.history.unshift(processedItem);
        
        // 3. Remove from pending
        state.pendingList.splice(requestIndex, 1);
      }
    }
  }
});

export const { setPendingApprovals, processRequest } = approvalSlice.actions;

export default approvalSlice.reducer;