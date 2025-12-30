'use client';

import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { useAppDispatch } from '@/redux/hook';
import { getItemLinks, selectProduct, clearItemLink, setNewProduct } from '@/redux/purchaseDocSlice';
import { AnalyzedItem, LinkingStatus, ProductSuggestion } from '@/interfaces/purchaseDoc.interface';
import { Autocomplete, TextField, Chip } from '@mui/material';
import { MdAdd, MdClose, MdCheckCircle } from 'react-icons/md';
import ProductCreateModal from './ProductCreateModal';

interface ItemLinkingCellProps {
  lineId: string;
  item: AnalyzedItem;
}

export default function ItemLinkingCell({ lineId, item }: ItemLinkingCellProps) {
  const dispatch = useAppDispatch();
  const itemLinks = useSelector(getItemLinks);
  const link = itemLinks[lineId];
  
  const [createModalOpen, setCreateModalOpen] = useState(false);
  
  if (!link) return <div>Error: no se encontró el link</div>;
  
  const handleSelectProduct = (productId: string | null) => {
    if (productId) {
      dispatch(selectProduct({ lineId, productId }));
    }
  };
  
  const handleClear = () => {
    dispatch(clearItemLink(lineId));
  };
  
  const handleOpenCreateModal = () => {
    setCreateModalOpen(true);
  };
  
  const handleCloseCreateModal = () => {
    setCreateModalOpen(false);
  };
  
  const handleCreateProduct = (newProduct: any) => {
    dispatch(setNewProduct({ lineId, newProduct }));
    setCreateModalOpen(false);
  };
  
  // ESTADO: PENDING - Mostrar sugerencias o botón crear
  if (link.status === LinkingStatus.PENDING) {
    const hasSuggestions = item.suggestions && item.suggestions.length > 0;
    
    if (hasSuggestions) {
      return (
        <Container>
          <Autocomplete
            options={item.suggestions || []}
            getOptionLabel={(option: ProductSuggestion) => option.descripcion}
            onChange={(_, value) => handleSelectProduct(value?._id || null)}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Selecciona un producto..."
                size="small"
              />
            )}
            renderOption={(props: any, option: ProductSuggestion) => (
              <OptionItem {...props} key={option._id}>
                <OptionName>{option.descripcion}</OptionName>
                <OptionScore>Score: {(option.score * 100).toFixed(0)}%</OptionScore>
              </OptionItem>
            )}
            fullWidth
          />
          
          <CreateButton onClick={handleOpenCreateModal}>
            <MdAdd size={16} />
            Crear Producto
          </CreateButton>
          
          <ProductCreateModal
            open={createModalOpen}
            onClose={handleCloseCreateModal}
            onCreate={handleCreateProduct}
            initialDescription={item.description || item.rawDescription}
          />
        </Container>
      );
    } else {
      return (
        <Container>
          <NoSuggestions>No hay sugerencias</NoSuggestions>
          <CreateButton onClick={handleOpenCreateModal} primary>
            <MdAdd size={16} />
            Crear Producto
          </CreateButton>
          
          <ProductCreateModal
            open={createModalOpen}
            onClose={handleCloseCreateModal}
            onCreate={handleCreateProduct}
            initialDescription={item.description || item.rawDescription}
          />
        </Container>
      );
    }
  }
  
  // ESTADO: LINKED - Mostrar el producto seleccionado
  if (link.status === LinkingStatus.LINKED && link.chosenProductId) {
    const selectedProduct = item.suggestions?.find((s: ProductSuggestion) => s._id === link.chosenProductId);
    
    return (
      <Container>
        <Chip
          icon={<MdCheckCircle />}
          label={selectedProduct?.descripcion || 'Producto seleccionado'}
          onDelete={handleClear}
          color="success"
          deleteIcon={<MdClose />}
        />
      </Container>
    );
  }
  
  // ESTADO: NEW_PRODUCT - Mostrar que se creará un producto nuevo
  if (link.status === LinkingStatus.NEW_PRODUCT && link.newProduct) {
    return (
      <Container>
        <Chip
          icon={<MdAdd />}
          label={`Nuevo: ${link.newProduct.descripcion}`}
          onDelete={handleClear}
          color="primary"
          deleteIcon={<MdClose />}
        />
      </Container>
    );
  }
  
  return <div>Estado desconocido</div>;
}

// Styled Components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const CreateButton = styled.button<{ primary?: boolean }>`
  background: ${props => props.primary ? '#2196F3' : 'white'};
  color: ${props => props.primary ? 'white' : '#2196F3'};
  border: 1px solid #2196F3;
  border-radius: 6px;
  padding: 8px 12px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  
  &:hover {
    background: ${props => props.primary ? '#1976D2' : '#e3f2fd'};
  }
`;

const NoSuggestions = styled.div`
  font-size: 13px;
  color: #999;
  font-style: italic;
  padding: 8px 0;
`;

const OptionItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
`;

const OptionName = styled.span`
  font-size: 14px;
  color: #333;
`;

const OptionScore = styled.span`
  font-size: 12px;
  color: #666;
  font-weight: 600;
`;
