import { Expense } from '@/interfaces/expense.interface';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ExpenseState {
  expenses: Expense[];
  selectedExpense: Expense | null;
  total: number;
}

const initialState: ExpenseState = {
  expenses: [],
  selectedExpense: null,
  total: 0,
};

const expenseSlice = createSlice({
  name: 'expense',
  initialState,
  reducers: {
    setExpenses: (state, action: PayloadAction<{ expenses: Expense[]; total: number }>) => {
      state.expenses = action.payload.expenses;
      state.total = action.payload.total;
    },
    addExpense: (state, action: PayloadAction<Expense>) => {
      state.expenses.unshift(action.payload);
      state.total += 1;
    },
    updateExpense: (state, action: PayloadAction<Expense>) => {
      const index = state.expenses.findIndex(exp => exp._id === action.payload._id);
      if (index !== -1) {
        state.expenses[index] = action.payload;
      }
    },
    removeExpense: (state, action: PayloadAction<string>) => {
      state.expenses = state.expenses.filter(exp => exp._id !== action.payload);
      state.total -= 1;
    },
    setSelectedExpense: (state, action: PayloadAction<Expense | null>) => {
      state.selectedExpense = action.payload;
    },
    clearExpenses: (state) => {
      state.expenses = [];
      state.selectedExpense = null;
      state.total = 0;
    },
  },
});

export const getExpenses = (state: { expense: ExpenseState }) => state.expense.expenses;
export const getSelectedExpense = (state: { expense: ExpenseState }) => state.expense.selectedExpense;
export const getTotalExpenses = (state: { expense: ExpenseState }) => state.expense.total;

export const { 
  setExpenses, 
  addExpense, 
  updateExpense, 
  removeExpense, 
  setSelectedExpense, 
  clearExpenses 
} = expenseSlice.actions;

export default expenseSlice.reducer;
