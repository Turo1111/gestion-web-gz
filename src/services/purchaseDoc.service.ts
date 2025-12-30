import apiClient from '@/utils/client';
import {
  UploadResponse,
  DraftStatusResponse,
  ConfirmRequest,
  ConfirmResponse,
  UploadMetadata,
} from '@/interfaces/purchaseDoc.interface';

/**
 * Servicio para carga inteligente de comprobantes de compra
 * Integrado con backend gzapi (Opción A - Análisis automático)
 */
export const purchaseDocService = {
  /**
   * POST /purchaseDoc/upload
   * Sube archivo, backend crea draft y orquesta análisis con Document AI automáticamente
   * Respuesta inmediata con draft en estado PROCESSING
   * 
   * @param file - Archivo PDF/JPG/PNG del comprobante
   * @param metadata - Metadata con providerId y sourceType
   * @returns DraftId y status PROCESSING
   */
  async upload(file: File, metadata: UploadMetadata): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('providerId', metadata.providerId);
    formData.append('sourceType', metadata.sourceType);
    
    const response = await apiClient.post(
      '/purchaseDoc/upload',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    
    // Backend responde con { success: true, data: { draftId, status, ... } }
    return response.data.data;
  },
  
  /**
   * GET /purchaseDoc/:draftId
   * Consulta estado del draft y obtiene análisis cuando esté READY
   * Usar para polling después del upload
   * 
   * @param draftId - ID del draft
   * @returns Draft con analysis si status=READY, error si status=FAILED
   */
  async getDraft(draftId: string): Promise<DraftStatusResponse> {
    const response = await apiClient.get(
      `/purchaseDoc/${draftId}`
    );
    
    return response.data.data;
  },
  
  /**
   * POST /purchaseDoc/:draftId/confirm
   * Confirma compra con items vinculados, crea Buy + ItemBuy
   * 
   * @param draftId - ID del draft creado en upload
   * @param data - Items vinculados + ediciones de header + decisión de duplicados
   * @returns Confirmación con buyId
   */
  async confirm(draftId: string, data: ConfirmRequest): Promise<ConfirmResponse> {
    const response = await apiClient.post(
      `/purchaseDoc/${draftId}/confirm`,
      data
    );
    
    return response.data.data;
  },
};
