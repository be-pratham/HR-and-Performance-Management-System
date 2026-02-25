import { createSlice } from '@reduxjs/toolkit';

const STORAGE_KEY = 'hrms_360_reviews';

const initialState = {
  // Structure: { "empId": { self: {}, peers: {}, manager: {}, status: 'NOT_STARTED' } }
  reviews: JSON.parse(localStorage.getItem(STORAGE_KEY)) || {},
};

const performanceSlice = createSlice({
  name: 'performance',
  initialState,
  reducers: {
    submitReview: (state, action) => {
      const { targetId, reviewerId, type, scores } = action.payload; 
      // scores: { technical: 1-5, delivery: 1-5, communication: 1-5 }

      if (!state.reviews[targetId]) {
        state.reviews[targetId] = { self: null, peers: {}, manager: null, status: 'IN_PROGRESS' };
      }

      if (type === 'self') {
        state.reviews[targetId].self = scores;
        // If employee submits, but manager hasn't, it's 'PENDING_MANAGER'
        if (state.reviews[targetId].status !== 'COMPLETED') {
           state.reviews[targetId].status = 'AWAITING_MANAGER';
        }
      } else if (type === 'manager') {
        state.reviews[targetId].manager = scores;
        state.reviews[targetId].status = 'COMPLETED'; 
      } else if (type === 'peer') {
        state.reviews[targetId].peers[reviewerId] = scores;
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.reviews));
    },
    resetCycle: (state) => {
      state.reviews = {};
      localStorage.removeItem(STORAGE_KEY);
    }
  }
});

export const { submitReview, resetCycle } = performanceSlice.actions;

// --- UPDATED SELECTOR WITH WEIGHTED AVERAGE ---
export const selectPerformanceData = (state) => {
  const employees = state.employees.list;
  const reviews = state.performance.reviews;
  
  const SALARY_TIERS = { employee: 5000, admin: 6000, manager: 8000 };

  return employees.map(emp => {
    const review = reviews[emp.id] || { self: null, peers: {}, manager: null, status: 'NOT_STARTED' };
    
    // 1. Peer Average Calculation
    const peerEntries = Object.values(review.peers || {});
    const peerAvg = {
      technical: peerEntries.length ? peerEntries.reduce((a, b) => a + b.technical, 0) / peerEntries.length : 0,
      delivery: peerEntries.length ? peerEntries.reduce((a, b) => a + b.delivery, 0) / peerEntries.length : 0,
      communication: peerEntries.length ? peerEntries.reduce((a, b) => a + b.communication, 0) / peerEntries.length : 0,
    };

    // 2. WEIGHTED CATEGORY CALCULATION
    // Formula: (Self * 0.2) + (PeerAvg * 0.3) + (Manager * 0.5)
    const getWeightedScore = (cat) => {
      const s = (review.self?.[cat] || 0) * 0.2;
      const p = (peerAvg[cat] || 0) * 0.3;
      const m = (review.manager?.[cat] || 0) * 0.5;
      return s + p + m;
    };

    const weightedTech = getWeightedScore('technical');
    const weightedDel = getWeightedScore('delivery');
    const weightedComm = getWeightedScore('communication');

    // Total Weighted Average
    const finalAvg = (weightedTech + weightedDel + weightedComm) / 3;

    // 3. Bonus Formula: (3 * finalAvg)% of Tier Salary
    const baseSalary = SALARY_TIERS[emp.role.toLowerCase()] || 5000;
    const bonusPercentage = 3 * finalAvg;
    const bonusAmount = (baseSalary * (bonusPercentage / 100)).toFixed(2);

    return {
      ...emp,
      scores: {
        self: review.self,
        peerAvg: peerAvg,
        manager: review.manager
      },
      weightedBreakdown: {
        technical: weightedTech.toFixed(2),
        delivery: weightedDel.toFixed(2),
        communication: weightedComm.toFixed(2)
      },
      status: review.status,
      finalAvg: finalAvg.toFixed(2),
      bonusAmount: review.status === 'COMPLETED' ? bonusAmount : "0.00" // Only show bonus if manager finished
    };
  });
};

export default performanceSlice.reducer;
