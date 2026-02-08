'use client';

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Autocomplete } from '@mui/material';
import { MdClose } from 'react-icons/md';

interface ProductCreateModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (product: NewProduct) => void;
  initialDescription?: string;
}

interface NewProduct {
  descripcion: string;
  categoria?: string;
  marca?: string;
  codigoBarras?: string;
  precioCompra?: number;
  precioVenta?: number;
  stock?: number;
}

// Mock data (en producción se obtendrían de servicios)
const mockCategorias = [
  'Golosinas',
  'Bebidas',
  'Snacks',
  'Lácteos',
  'Panadería',
  'Limpieza',
  'Otros',
];

const mockMarcas = [
  'Arcor',
  'Cadbury',
  'Coca-Cola',
  'Pepsi',
  'Fargo',
  'Terrabusi',
  'La Serenísima',
  'Sancor',
  'Otras',
];

export default function ProductCreateModal({ open, onClose, onCreate, initialDescription }: ProductCreateModalProps) {
  const [formData, setFormData] = useState<NewProduct>({
    descripcion: initialDescription || '',
    categoria: undefined,
    marca: undefined,
    codigoBarras: '',
    precioCompra: undefined,
    precioVenta: undefined,
    stock: 0,
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  useEffect(() => {
    if (open && initialDescription) {
      setFormData(prev => ({ ...prev, descripcion: initialDescription }));
    }
  }, [open, initialDescription]);
  
  const handleChange = (field: keyof NewProduct, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Limpiar error del campo
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };
  
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.descripcion.trim()) {
      newErrors.descripcion = 'La descripción es obligatoria';
    }
    
    if (formData.precioCompra && formData.precioCompra < 0) {
      newErrors.precioCompra = 'El precio no puede ser negativo';
    }
    
    if (formData.precioVenta && formData.precioVenta < 0) {
      newErrors.precioVenta = 'El precio no puede ser negativo';
    }
    
    if (formData.stock && formData.stock < 0) {
      newErrors.stock = 'El stock no puede ser negativo';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = () => {
    if (!validate()) return;
    
    onCreate(formData);
    handleClose();
  };
  
  const handleClose = () => {
    setFormData({
      descripcion: '',
      categoria: undefined,
      marca: undefined,
      codigoBarras: '',
      precioCompra: undefined,
      precioVenta: undefined,
      stock: 0,
    });
    setErrors({});
    onClose();
  };
  
  return (
    <StyledDialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <TitleBar>
          <Title>Crear Nuevo Producto</Title>
          <CloseButton onClick={handleClose}>
            <MdClose size={24} />
          </CloseButton>
        </TitleBar>
      </DialogTitle>
      
      <DialogContent>
        <Form>
          <TextField
            label="Descripción"
            value={formData.descripcion}
            onChange={(e) => handleChange('descripcion', e.target.value)}
            error={!!errors.descripcion}
            helperText={errors.descripcion}
            fullWidth
            required
            autoFocus
          />
          
          <Row>
            <Autocomplete
              options={mockCategorias}
              value={formData.categoria || null}
              onChange={(_, value) => handleChange('categoria', value)}
              renderInput={(params) => (
                <TextField {...params} label="Categoría" />
              )}
              fullWidth
              freeSolo
            />
            
            <Autocomplete
              options={mockMarcas}
              value={formData.marca || null}
              onChange={(_, value) => handleChange('marca', value)}
              renderInput={(params) => (
                <TextField {...params} label="Marca" />
              )}
              fullWidth
              freeSolo
            />
          </Row>
          
          <TextField
            label="Código de Barras"
            value={formData.codigoBarras}
            onChange={(e) => handleChange('codigoBarras', e.target.value)}
            fullWidth
          />
          
          <Row>
            <TextField
              label="Precio de Compra"
              type="number"
              value={formData.precioCompra || ''}
              onChange={(e) => handleChange('precioCompra', parseFloat(e.target.value) || undefined)}
              error={!!errors.precioCompra}
              helperText={errors.precioCompra}
              inputProps={{ step: '0.01', min: '0' }}
              fullWidth
            />
            
            <TextField
              label="Precio de Venta"
              type="number"
              value={formData.precioVenta || ''}
              onChange={(e) => handleChange('precioVenta', parseFloat(e.target.value) || undefined)}
              error={!!errors.precioVenta}
              helperText={errors.precioVenta}
              inputProps={{ step: '0.01', min: '0' }}
              fullWidth
            />
          </Row>
          
          <TextField
            label="Stock Inicial"
            type="number"
            value={formData.stock}
            onChange={(e) => handleChange('stock', parseInt(e.target.value) || 0)}
            error={!!errors.stock}
            helperText={errors.stock}
            inputProps={{ step: '1', min: '0' }}
            fullWidth
          />
        </Form>
      </DialogContent>
      
      <DialogActions>
        <CancelButton onClick={handleClose}>
          Cancelar
        </CancelButton>
        <CreateButton onClick={handleSubmit}>
          Crear Producto
        </CreateButton>
      </DialogActions>
    </StyledDialog>
  );
}

// Styled Components
const StyledDialog = styled(Dialog)`
  .MuiDialog-paper {
    border-radius: 12px;
  }
`;

const TitleBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #666;
  padding: 4px;
  display: flex;
  align-items: center;
  
  &:hover {
    color: #333;
  }
`;

const Form = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 16px 0;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const CancelButton = styled.button`
  background: none;
  border: 1px solid #ccc;
  color: #666;
  border-radius: 8px;
  padding: 10px 24px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  
  &:hover {
    background: #f5f5f5;
  }
`;

const CreateButton = styled.button`
  background: #2196F3;
  border: none;
  color: white;
  border-radius: 8px;
  padding: 10px 24px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  
  &:hover {
    background: #1976D2;
  }
`;
