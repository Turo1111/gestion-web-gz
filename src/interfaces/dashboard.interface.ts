/**
 * Interfaces para Dashboard y KPIs
 */

export interface ResultKPIData {
  ventas: number;
  compras: number;
  resultado: number;
  gastosPersonales: number;
}

export interface ResultKPIProps {
  period: {
    from: string; // YYYY-MM-DD
    to: string;   // YYYY-MM-DD
  };
  interval?: string; // 'DIARIO' | 'SEMANAL' | 'MENSUAL' | 'ANUAL' | 'CUSTOM'
}
