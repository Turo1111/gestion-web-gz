'use client';

import { useAppSelector } from '@/redux/hook';
import { getUser } from '@/redux/userSlice';
import { Permission } from '@/interfaces/auth.interface';

/**
 * Hook personalizado para verificar permisos del usuario
 * 
 * @returns Objeto con funciones para verificar permisos
 * 
 * @example
 * ```tsx
 * const { hasPermission, canCreateExpense, canEditExpense } = usePermission();
 * 
 * if (canCreateExpense) {
 *   return <button onClick={handleCreate}>Crear Egreso</button>
 * }
 * 
 * if (hasPermission(Permission.DELETE_EXPENSE)) {
 *   return <button onClick={handleDelete}>Eliminar</button>
 * }
 * ```
 */
export const usePermission = () => {
  const user = useAppSelector(getUser);

  /**
   * Verifica si el usuario tiene un permiso específico
   * @param permission - Permiso a verificar (usar enum Permission)
   * @returns true si el usuario tiene el permiso, false en caso contrario
   */
  const hasPermission = (permission: Permission | string): boolean => {
    if (!user || !user.role || !user.role.permissions) {
      return false;
    }

    return user.role.permissions.includes(permission);
  };

  /**
   * Verifica si el usuario tiene al menos uno de los permisos especificados
   * @param permissions - Array de permisos a verificar
   * @returns true si el usuario tiene al menos uno de los permisos
   */
  const hasAnyPermission = (permissions: (Permission | string)[]): boolean => {
    if (!user || !user.role || !user.role.permissions) {
      return false;
    }

    return permissions.some(permission => user.role!.permissions.includes(permission));
  };

  /**
   * Verifica si el usuario tiene todos los permisos especificados
   * @param permissions - Array de permisos a verificar
   * @returns true si el usuario tiene todos los permisos
   */
  const hasAllPermissions = (permissions: (Permission | string)[]): boolean => {
    if (!user || !user.role || !user.role.permissions) {
      return false;
    }

    return permissions.every(permission => user.role!.permissions.includes(permission));
  };

  // Helpers específicos para egresos (shortcuts)
  const canCreateExpense = hasPermission(Permission.CREATE_EXPENSE);
  const canReadExpense = hasPermission(Permission.READ_EXPENSE);
  const canUpdateExpense = hasPermission(Permission.UPDATE_EXPENSE);
  const canDeleteExpense = hasPermission(Permission.DELETE_EXPENSE);

  // Helper para verificar si tiene permisos de escritura completos (crear + actualizar + eliminar)
  const hasFullExpenseAccess = canCreateExpense && canUpdateExpense && canDeleteExpense;

  // Helper para verificar si solo tiene permisos de lectura
  const isReadOnly = canReadExpense && !canCreateExpense && !canUpdateExpense && !canDeleteExpense;

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    canCreateExpense,
    canReadExpense,
    canUpdateExpense,
    canDeleteExpense,
    hasFullExpenseAccess,
    isReadOnly,
  };
};
