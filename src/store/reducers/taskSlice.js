import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  dailyTasks: [],
  loading: false,
  error: null,
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setTasks: (state, action) => {
      state.dailyTasks = action.payload;
    },
    addTask: (state, action) => {
      // Assuming action.payload is { text, time, reviewer, description }
      const newTask = {
        id: Date.now(), // Generate a temporary ID until synced with DB
        ...action.payload,
        completed: false,
      };
      state.dailyTasks.push(newTask);
    },
    toggleTaskCompletion: (state, action) => {
      const task = state.dailyTasks.find(t => t.id === action.payload);
      if (task) {
        task.completed = !task.completed;
      }
    },
    removeTask: (state, action) => {
      state.dailyTasks = state.dailyTasks.filter(t => t.id !== action.payload);
    }
  }
});

export const { 
  setTasks, addTask, toggleTaskCompletion, removeTask 
} = taskSlice.actions;

export default taskSlice.reducer;