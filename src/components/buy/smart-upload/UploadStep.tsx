'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { useAppDispatch } from '@/redux/hook';
import {
  setFile,
  setProviderId,
  setSourceType,
  startUpload,
  uploadSuccess,
  uploadFailure,
  getPurchaseDocState,
} from '@/redux/purchaseDocSlice';
import { SourceType, Provider, Analysis } from '@/interfaces/purchaseDoc.interface';
import { providerService } from '@/services/provider.service';
import { purchaseDocService } from '@/services/purchaseDoc.service';
import { setAlert } from '@/redux/alertSlice';
import { Autocomplete, TextField, FormControl, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import { MdUploadFile, MdCheck } from 'react-icons/md';
import Loading from '@/components/Loading';

export default function UploadStep() {
  const dispatch = useAppDispatch();
  const { uploadForm, uploadLoading, uploadError } = useSelector(getPurchaseDocState);
  
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loadingProviders, setLoadingProviders] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [dragActive, setDragActive] = useState(false);  const [pollingDraftId, setPollingDraftId] = useState<string | null>(null);
  const [pollingMessage, setPollingMessage] = useState('Analizando comprobante...');  
  // Cargar proveedores al montar
  useEffect(() => {
    loadProviders();
  }, []);
  
  const loadProviders = async () => {
    setLoadingProviders(true);
    try {
      const data = await providerService.getProviders();
      
      // Asegurarse de que data es un array antes de filtrar
      if (Array.isArray(data)) {
        setProviders(data.filter(p => p.isActive));
      } else {
        console.error('getProviders no devolvió un array:', data);
        setProviders([]);
        dispatch(setAlert({
          message: 'Formato de datos de proveedores inválido',
          type: 'error',
        }));
      }
    } catch (error: any) {
      console.error('Error al cargar proveedores:', error);
      setProviders([]);
      dispatch(setAlert({
        message: 'Error al cargar proveedores: ' + (error.response?.data?.message || error.message || 'Error desconocido'),
        type: 'error',
      }));
    } finally {
      setLoadingProviders(false);
    }
  };
  
  const handleFileChange = (file: File | null) => {
    if (!file) {
      dispatch(setFile(null));
      return;
    }
    
    // Validar tipo
    const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      dispatch(setAlert({
        message: 'Tipo de archivo no válido. Solo se permiten PDF, JPG o PNG.',
        type: 'error',
      }));
      return;
    }
    
    // Validar tamaño (10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      dispatch(setAlert({
        message: 'El archivo es demasiado grande. Máximo 10MB.',
        type: 'error',
      }));
      return;
    }
    
    dispatch(setFile(file));
  };
  
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);
  
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  }, []);
  
  const handleProviderChange = (provider: Provider | null) => {
    setSelectedProvider(provider);
    if (provider) {
      dispatch(setProviderId(provider._id));
    }
  };
  
  const handleSourceTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSourceType(event.target.value as SourceType));
  };
  
  const canSubmit = uploadForm.file && uploadForm.providerId && uploadForm.sourceType;
  
  // Polling para consultar estado del draft
  useEffect(() => {
    if (!pollingDraftId) return;
    
    let attempts = 0;
    const maxAttempts = 60; // 60 intentos = 2 minutos máximo
    const pollInterval = 2000; // 2 segundos
    
    const poll = async () => {
      try {
        attempts++;
        setPollingMessage(`Analizando... (${attempts}/${maxAttempts})`);
        
        const draft = await purchaseDocService.getDraft(pollingDraftId);
        
        if (draft.status === 'READY' && draft.analysis) {
          // Análisis completo, convertir a formato esperado por Redux
          const analysis: Analysis = {
            header: {
              provider: {
                id: draft.analysis.header.providerId,
                name: draft.analysis.header.providerName,
              },
              date: draft.analysis.header.documentDate,
              documentNumber: draft.analysis.header.documentNumber,
              total: draft.analysis.header.total,
              dateConfidence: draft.analysis.header.confidence,
              documentNumberConfidence: draft.analysis.header.confidence,
              totalConfidence: draft.analysis.header.confidence,
            },
            items: draft.analysis.items.map(item => ({
              lineId: item.itemId,
              rawDescription: item.description,
              description: item.description,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              subtotal: item.subtotal,
              catalogLink: {
                suggestions: item.catalogMatch?.candidates?.map(c => ({
                  _id: c.productId,
                  productId: c.productId,
                  name: c.description,
                  descripcion: c.description,
                  score: c.score,
                  method: item.catalogMatch?.method || 'fuzzyMatch',
                  barcode: c.codigoBarra,
                  brand: c.marca,
                  category: c.categoria,
                })) || [],
                actionRequired: (!item.catalogMatch || !item.catalogMatch.candidates || item.catalogMatch.candidates.length === 0) ? 'CREATE_PRODUCT' as const : undefined,
              },
            })),
            possibleDuplicate: draft.possibleDuplicate ? {
              isDuplicate: draft.possibleDuplicate.status === 'SUSPECTED_DUPLICATE',
              checkId: draft.possibleDuplicate.checkId,
              candidates: draft.possibleDuplicate.duplicates,
              confidence: 0.85,
            } : {
              isDuplicate: false,
              candidates: [],
            },
            warnings: [],
            confidenceGlobal: draft.analysis.meta.avgConfidence,
          };
          
          dispatch(uploadSuccess({
            draftId: pollingDraftId,
            analysis,
          }));
          
          dispatch(setAlert({
            message: 'Comprobante analizado exitosamente',
            type: 'success',
          }));
          
          setPollingDraftId(null);
          return;
        }
        
        if (draft.status === 'FAILED') {
          const errorMsg = draft.error?.message || 'Error al analizar el comprobante';
          dispatch(uploadFailure(errorMsg));
          dispatch(setAlert({
            message: errorMsg,
            type: 'error',
          }));
          setPollingDraftId(null);
          return;
        }
        
        // Aún en PROCESSING, continuar polling
        if (attempts < maxAttempts) {
          setTimeout(poll, pollInterval);
        } else {
          // Timeout
          dispatch(uploadFailure('El análisis está tardando demasiado. Por favor, intenta nuevamente.'));
          dispatch(setAlert({
            message: 'Timeout: El análisis no se completó en el tiempo esperado',
            type: 'error',
          }));
          setPollingDraftId(null);
        }
      } catch (error: any) {
        console.error('Error en polling:', error);
        const errorMsg = error.response?.data?.message || error.message || 'Error al consultar el estado';
        dispatch(uploadFailure(errorMsg));
        dispatch(setAlert({
          message: errorMsg,
          type: 'error',
        }));
        setPollingDraftId(null);
      }
    };
    
    // Iniciar polling después de 1 segundo (dar tiempo al backend)
    const timeout = setTimeout(poll, 1000);
    
    return () => clearTimeout(timeout);
  }, [pollingDraftId, dispatch]);
  
  const handleSubmit = async () => {
    if (!canSubmit) return;
    
    dispatch(startUpload());
    
    try {
      // Upload devuelve draftId inmediatamente con status PROCESSING
      const result = await purchaseDocService.upload(uploadForm.file!, {
        providerId: uploadForm.providerId!,
        sourceType: uploadForm.sourceType,
      });
      
      // Iniciar polling para obtener el análisis
      setPollingDraftId(result.draftId);
      setPollingMessage('Analizando comprobante...');
      
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Error al procesar el comprobante';
      dispatch(uploadFailure(errorMessage));
      dispatch(setAlert({
        message: errorMessage,
        type: 'error',
      }));
    }
  };
  
  if (uploadLoading || pollingDraftId) {
    return (
      <LoadingContainer>
        <Loading />
        <LoadingText>{pollingMessage}</LoadingText>
        <LoadingSubtext>Esto puede tardar hasta 2 minutos</LoadingSubtext>
      </LoadingContainer>
    );
  }
  
  return (
    <Card>
      <Section>
        <SectionTitle>1. Seleccionar Proveedor</SectionTitle>
        <Autocomplete
          options={providers}
          getOptionLabel={(option) => option.name}
          value={selectedProvider}
          onChange={(_, value) => handleProviderChange(value)}
          loading={loadingProviders}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Proveedor"
              placeholder="Buscar proveedor..."
              required
            />
          )}
          fullWidth
        />
      </Section>
      
      <Section>
        <SectionTitle>2. Tipo de Comprobante</SectionTitle>
        <FormControl component="fieldset">
          <RadioGroup
            row
            value={uploadForm.sourceType}
            onChange={handleSourceTypeChange}
          >
            <FormControlLabel value={SourceType.INVOICE} control={<Radio />} label="Factura" />
            <FormControlLabel value={SourceType.RECEIPT} control={<Radio />} label="Remito" />
            <FormControlLabel value={SourceType.BUDGET} control={<Radio />} label="Presupuesto" />
          </RadioGroup>
        </FormControl>
      </Section>
      
      <Section>
        <SectionTitle>3. Subir Archivo</SectionTitle>
        <DropZone
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          active={dragActive}
        >
          <input
            type="file"
            id="file-upload"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
            style={{ display: 'none' }}
          />
          
          {uploadForm.file ? (
            <FileSelected>
              <MdCheck size={48} color="#4CAF50" />
              <FileName>{uploadForm.file.name}</FileName>
              <FileSize>{(uploadForm.file.size / 1024 / 1024).toFixed(2)} MB</FileSize>
              <ChangeFileButton as="label" htmlFor="file-upload">
                Cambiar archivo
              </ChangeFileButton>
            </FileSelected>
          ) : (
            <DropZoneContent>
              <MdUploadFile size={64} color="#999" />
              <DropZoneText>Arrastra tu archivo aquí o</DropZoneText>
              <UploadButton as="label" htmlFor="file-upload">
                Seleccionar archivo
              </UploadButton>
              <DropZoneHint>PDF, JPG o PNG - Máximo 10MB</DropZoneHint>
            </DropZoneContent>
          )}
        </DropZone>
      </Section>
      
      {uploadError && (
        <ErrorMessage>{uploadError}</ErrorMessage>
      )}
      
      <Actions>
        <AnalyzeButton onClick={handleSubmit} disabled={!canSubmit}>
          Analizar Comprobante
        </AnalyzeButton>
      </Actions>
    </Card>
  );
}

// Styled Components
const Card = styled.div`
  background: white;
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
`;

const Section = styled.div`
  margin-bottom: 32px;
`;

const SectionTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
`;

const DropZone = styled.div<{ active: boolean }>`
  border: 2px dashed ${props => props.active ? '#3764A0' : '#ddd'};
  border-radius: 12px;
  padding: 48px 24px;
  text-align: center;
  background: ${props => props.active ? '#f0f7ff' : '#fafafa'};
  transition: all 0.3s;
  cursor: pointer;
  
  &:hover {
    border-color: #3764A0;
    background: #f0f7ff;
  }
`;

const DropZoneContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
`;

const DropZoneText = styled.p`
  font-size: 16px;
  color: #666;
  margin: 0;
`;

const UploadButton = styled.button`
  background: #3764A0;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  
  &:hover {
    background: #2a4d7c;
  }
`;

const DropZoneHint = styled.span`
  font-size: 12px;
  color: #999;
`;

const FileSelected = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
`;

const FileName = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: #333;
`;

const FileSize = styled.span`
  font-size: 14px;
  color: #666;
`;

const ChangeFileButton = styled.button`
  background: none;
  border: 1px solid #3764A0;
  color: #3764A0;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
  
  &:hover {
    background: #f0f7ff;
  }
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  margin-top: 32px;
`;

const AnalyzeButton = styled.button`
  background: #FA9B50;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 14px 32px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  
  &:hover:not(:disabled) {
    background: #e8893e;
  }
  
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  background: #ffebee;
  border: 1px solid #f44336;
  border-radius: 8px;
  padding: 12px 16px;
  color: #c62828;
  font-size: 14px;
  margin-top: 16px;
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  gap: 16px;
`;

const LoadingText = styled.p`
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
`;

const LoadingSubtext = styled.p`
  font-size: 14px;
  color: #666;
  margin: 0;
`;
