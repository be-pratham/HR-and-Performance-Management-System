import { createSlice } from '@reduxjs/toolkit';

const SALARY_TIERS = {
  employee: 5000,
  admin: 6000,
  manager: 8000
};

const payrollSlice = createSlice({
  name: 'payroll',
  initialState: {
    bonusHistory: JSON.parse(localStorage.getItem('hrms_bonuses')) || [],
  },
  reducers: {
    issueWeightedBonus: (state, action) => {
      const { empId, empName, role, scores } = action.payload;
      
      const weightedAvg = (scores.manager * 0.5) + (scores.peer * 0.3) + (scores.self * 0.2);
      
      const baseSalary = SALARY_TIERS[role.toLowerCase()] || 5000;
      const bonusPct = 3 * weightedAvg;
      const amount = (baseSalary * (bonusPct / 100)).toFixed(2);

      state.bonusHistory.unshift({
        id: Date.now(),
        empName,
        weightedAvg: weightedAvg.toFixed(2),
        amount,
        date: new Date().toLocaleDateString()
      });
      
      localStorage.setItem('hrms_bonuses', JSON.stringify(state.bonusHistory));
    }
  }
});

export const { issueWeightedBonus } = payrollSlice.actions;
export default payrollSlice.reducer;