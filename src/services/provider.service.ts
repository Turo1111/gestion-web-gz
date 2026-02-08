import apiClient from '@/utils/client';
import { Provider } from '@/interfaces/purchaseDoc.interface';

/**
 * Servicio para gestión de proveedores (catálogo)
 */
export const providerService = {
  /**
   * GET /catalog/providers
   * Obtiene lista de proveedores activos
   */
  async getProviders(): Promise<Provider[]> {
    const response = await apiClient.get('/catalog/providers');
    
    // Manejar diferentes formatos de respuesta del backend
    const data = response.data;
    
    // Formato backend actual: { providers: [...], count: N }
    if (data && typeof data === 'object' && 'providers' in data) {
      const providers = data.providers;
      if (Array.isArray(providers)) {
        // Mapear descripcion → name para compatibilidad con interfaz
        return providers.map((p: any) => ({
          _id: p._id || p.providerId,
          name: p.providerName || p.descripcion || p.name || 'Sin nombre',
          cuit: p.cuit,
          email: p.email,
          phone: p.phone,
          address: p.address,
          isActive: p.isActive !== false, // Por defecto true si no viene
        }));
      }
      return [];
    }
    
    // Si la respuesta tiene una propiedad 'data', usar esa
    if (data && typeof data === 'object' && 'data' in data) {
      const providers = data.data;
      if (Array.isArray(providers)) {
        return providers.map((p: any) => ({
          _id: p._id || p.providerId,
          name: p.providerName || p.descripcion || p.name || 'Sin nombre',
          cuit: p.cuit,
          email: p.email,
          phone: p.phone,
          address: p.address,
          isActive: p.isActive !== false,
        }));
      }
      return [];
    }
    
    // Si la respuesta es directamente un array
    if (Array.isArray(data)) {
      return data.map((p: any) => ({
        _id: p._id || p.providerId,
        name: p.providerName || p.descripcion || p.name || 'Sin nombre',
        cuit: p.cuit,
        email: p.email,
        phone: p.phone,
        address: p.address,
        isActive: p.isActive !== false,
      }));
    }
    
    // Si no es ninguno de los formatos esperados, devolver array vacío
    console.warn('Formato de respuesta inesperado en getProviders:', data);
    return [];
  },
};
