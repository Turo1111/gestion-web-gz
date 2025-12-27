import { Types } from 'mongoose';

/**
 * Enums del backend
 */
export enum ExpenseType {
  OPERATIVO = 'operativo',
  PERSONAL = 'personal',
  OTRO_NEGOCIO = 'otro_negocio',
}

export enum PaymentMethod {
  EFECTIVO = 'efectivo',
  TRANSFERENCIA = 'transferencia',
  TARJETA = 'tarjeta',
  CHEQUE = 'cheque',
  OTRO = 'otro',
}

/**
 * DTO para crear un egreso (payload del POST)
 */
export interface CreateExpenseDTO {
  date: string;              // Formato: YYYY-MM-DD
  amount: number;            // En pesos (se convertirá a centavos en backend)
  category: string;          // String libre (MVP)
  type: ExpenseType;
  paymentMethod: PaymentMethod;
  description?: string;      // Opcional
}

/**
 * Modelo completo de egreso (response del backend)
 */
export interface Expense {
  _id: Types.ObjectId | string;
  date: string;
  amount: number;            // En pesos (convertido desde amountCents)
  amountCents: number;       // Valor interno en centavos (backend)
  category: string;
  type: ExpenseType;
  paymentMethod: PaymentMethod;
  description?: string;
  createdBy: Types.ObjectId | string; // Usuario que creó (backend lo setea)
  createdAt: string;         // ISO timestamp
  updatedAt: string;
  isDeleted: boolean;        // Soft delete flag
}

/**
 * Response del listado paginado
 */
export interface ExpenseListResponse {
  expenses: Expense[];
  total: number;
  skip: number;
  limit: number;
}

/**
 * Estado del formulario (local)
 */
export interface ExpenseFormData {
  date: string;
  amount: string;            // String en formulario para manejo de decimales
  category: string;
  type: ExpenseType | '';
  paymentMethod: PaymentMethod | '';
  description: string;
}

/**
 * Errores de validación
 */
export interface ExpenseFormErrors {
  date?: string;
  amount?: string;
  category?: string;
  type?: string;
  paymentMethod?: string;
  description?: string;
}
