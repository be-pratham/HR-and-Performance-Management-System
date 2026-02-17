import { createSlice } from '@reduxjs/toolkit';

const STORAGE_KEY = 'navajna_hrms_employees';

const loadFromStorage = (defaultList) => {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : defaultList;
};

const saveToStorage = (list) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
};

const mockData = [
  { id: 1, name: 'Alice Johnson', role: 'Employee', dept: 'Engineering', email: 'alice@company.com',   status: 'Active'        },
  { id: 2, name: 'Bob Smith',     role: 'Manager',  dept: 'Marketing',   email: 'bob@company.com',     status: 'Active'        },
  { id: 3, name: 'Charlie Davis', role: 'Employee', dept: 'Marketing',   email: 'charlie@company.com', status: 'On Leave'      },
  { id: 4, name: 'Davie Jones',   role: 'Manager',  dept: 'Engineering', email: 'davie@company.com',   status: 'Active'        },
  { id: 5, name: 'Eliza Manson',  role: 'Employee', dept: 'Marketing',   email: 'eliza@company.com',   status: 'Active'        },
  { id: 6, name: 'Fiola Jackson', role: 'Admin',    dept: 'HR',          email: 'fiola@company.com',   status: 'Active'        },
  { id: 7, name: 'Garmin Bing',   role: 'Employee', dept: 'HR',          email: 'garmin@company.com',  status: 'Medical Leave' },
];

const initialState = {
  list: loadFromStorage(mockData), 
  selectedEmployee: null,
  searchTerm: '',
};

const employeeSlice = createSlice({
  name: 'employees',
  initialState,
  reducers: {
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    addEmployee: (state, action) => {
      const newEmp = {
        ...action.payload,
        id: action.payload.id || `EMP${Date.now()}`,
        status: action.payload.status || 'Active'
      };
      state.list.unshift(newEmp);
      saveToStorage(state.list); 
    },
    updateEmployee: (state, action) => {
      const index = state.list.findIndex(emp => emp.id === action.payload.id);
      if (index !== -1) {
        state.list[index] = { ...state.list[index], ...action.payload };
        saveToStorage(state.list); 
      }
    },
    deleteEmployee: (state, action) => {
      state.list = state.list.filter(emp => emp.id !== action.payload);
      saveToStorage(state.list); 
    },
    selectEmployee: (state, action) => {
      state.selectedEmployee = state.list.find(emp => emp.id === action.payload) || null;
    }
  }
});

// --- Exports ---
export const { 
  setSearchTerm, addEmployee, updateEmployee, deleteEmployee, selectEmployee 
} = employeeSlice.actions;

// --- Selectors ---
export const selectFilteredEmployees = (state) => {
  const { list, searchTerm } = state.employees;
  
  if (!searchTerm) return list;
  
  const lowerSearch = searchTerm.toLowerCase();
  
  return list.filter(emp => 
    emp.name.toLowerCase().includes(lowerSearch) ||
    emp.dept.toLowerCase().includes(lowerSearch) ||
    emp.role.toLowerCase().includes(lowerSearch) ||
    emp.email.toLowerCase().includes(lowerSearch)
  );
};

export default employeeSlice.reducer;