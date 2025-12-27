import apiClient from '@/utils/client';
import { CreateExpenseDTO, Expense, ExpenseListResponse } from '@/interfaces/expense.interface';

const EXPENSE_BASE_URL = '/expense';

export const expenseService = {
  /**
   * Crear un nuevo egreso
   */
  create: async (data: CreateExpenseDTO): Promise<Expense> => {
    const response = await apiClient.post<Expense>(EXPENSE_BASE_URL, data);
    return response.data;
  },

  /**
   * Obtener listado de egresos con paginación y filtros
   */
  getAll: async (params?: { skip?: number; limit?: number; filters?: any }): Promise<ExpenseListResponse> => {
    const response = await apiClient.get<ExpenseListResponse>(EXPENSE_BASE_URL, { params });
    return response.data;
  },

  /**
   * Obtener egreso por ID
   */
  getById: async (id: string): Promise<Expense> => {
    const response = await apiClient.get<Expense>(`${EXPENSE_BASE_URL}/${id}`);
    return response.data;
  },

  /**
   * Actualizar egreso (futuro)
   */
  update: async (id: string, data: Partial<CreateExpenseDTO>): Promise<Expense> => {
    const response = await apiClient.patch<Expense>(`${EXPENSE_BASE_URL}/${id}`, data);
    return response.data;
  },

  /**
   * Eliminar egreso (soft delete)
   */
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`${EXPENSE_BASE_URL}/${id}`);
  },
};
