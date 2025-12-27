/**
 * Envía evento de creación de egreso a sistema de analytics
 * (Google Analytics, Mixpanel, Segment, etc.)
 */
export const trackExpenseCreated = (expense: {
  type: string;
  category: string;
  paymentMethod: string;
  amount: number;
  date: string;
  user: string;
}) => {
  // Ejemplo con Google Analytics 4 (gtag)
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'expense_created', {
      event_category: 'Expenses',
      event_label: expense.category,
      expense_type: expense.type,
      payment_method: expense.paymentMethod,
      amount: expense.amount,
      date: expense.date,
      user: expense.user,
      timestamp: new Date().toISOString(),
    });
  }

  // Log para debugging (remover en producción si es necesario)
  console.log('Analytics: expense_created', {
    type: expense.type,
    category: expense.category,
    payment_method: expense.paymentMethod,
    amount: expense.amount,
    date: expense.date,
    user: expense.user,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Envía evento de actualización de egreso a sistema de analytics
 */
export const trackExpenseUpdated = (data: {
  usuario: string;
  timestamp: number;
  id_egreso: string;
  campos_modificados: string[];
  tipo_egreso: string;
  categoria: string;
  monto: number;
}) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'expense_updated', {
      event_category: 'Expenses',
      event_label: data.categoria,
      expense_id: data.id_egreso,
      expense_type: data.tipo_egreso,
      modified_fields: data.campos_modificados.join(','),
      amount: data.monto,
      user: data.usuario,
      timestamp: new Date(data.timestamp).toISOString(),
    });
  }

  console.log('Analytics: expense_updated', {
    usuario: data.usuario,
    timestamp: new Date(data.timestamp).toISOString(),
    id_egreso: data.id_egreso,
    campos_modificados: data.campos_modificados,
    tipo_egreso: data.tipo_egreso,
    categoria: data.categoria,
    monto: data.monto,
  });
};

/**
 * Evento de error al crear egreso
 */
export const trackExpenseCreationError = (error: {
  errorType: string;
  errorMessage: string;
  user: string;
}) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'expense_creation_error', {
      event_category: 'Errors',
      error_type: error.errorType,
      error_message: error.errorMessage,
      user: error.user,
      timestamp: new Date().toISOString(),
    });
  }

  console.error('Analytics: expense_creation_error', error);
};
