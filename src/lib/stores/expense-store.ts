import { create } from "zustand";
import { Expense } from "../types";
import { mockExpenses } from "../mock-data";

interface ExpenseState {
  expenses: Expense[];
  setExpenses: (expenses: Expense[]) => void;
  addExpense: (expense: Expense) => void;
}

export const useExpenseStore = create<ExpenseState>((set) => ({
  expenses: [...mockExpenses],
  setExpenses: (expenses) => set({ expenses }),
  addExpense: (expense) =>
    set((state) => ({
      expenses: [expense, ...state.expenses],
    })),
}));
