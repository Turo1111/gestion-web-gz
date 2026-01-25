'use client';

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { useAppDispatch } from '@/redux/hook';
import { getItemLinks, selectProduct, clearItemLink, setNewProduct } from '@/redux/purchaseDocSlice';
import { AnalyzedItem, LinkingStatus, ProductSuggestion } from '@/interfaces/purchaseDoc.interface';
import { Autocomplete, TextField, Chip, CircularProgress } from '@mui/material';
import { MdAdd, MdClose, MdCheckCircle, MdSearch } from 'react-icons/md';
import ProductCreateModal from './ProductCreateModal';
import { productService, Product } from '@/services/product.service';

interface ItemLinkingCellProps {
  lineId: string;
  item: AnalyzedItem;
}

export default function ItemLinkingCell({ lineId, item }: ItemLinkingCellProps) {
  const dispatch = useAppDispatch();
  const itemLinks = useSelector(getItemLinks);
  const link = itemLinks[lineId];
  
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [searching, setSearching] = useState(false);
  
  // Debounced search
  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setSearching(true);
      try {
        const results = await productService.searchProducts(searchQuery, 20);
        setSearchResults(results);
      } catch (error) {
        console.error('Error searching products:', error);
        setSearchResults([]);
      } finally {
        setSearching(false);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);
  
  if (!link) return <div>Error: no se encontró el link</div>;
  
  const handleSelectProduct = (productId: string | null) => {
    if (productId) {
      dispatch(selectProduct({ lineId, productId }));
    }
  };
  
  const handleSelectSearchResult = (product: Product | null) => {
    if (product) {
      dispatch(selectProduct({ lineId, productId: product._id }));
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
  
  // ESTADO: PENDING - Mostrar sugerencias o búsqueda
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
      // Sin sugerencias: mostrar búsqueda con autocompletado
      return (
        <Container>
          <SearchInfo>
            <MdSearch size={16} />
            <span>Busca el producto en el catálogo</span>
          </SearchInfo>
          
          <Autocomplete
            options={searchResults}
            getOptionLabel={(option: Product) => option.descripcion}
            onChange={(_, value) => handleSelectSearchResult(value)}
            onInputChange={(_, value) => setSearchQuery(value)}
            loading={searching}
            noOptionsText={searchQuery.length < 2 ? "Escribe al menos 2 caracteres..." : "No se encontraron productos"}
            loadingText="Buscando..."
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Buscar producto..."
                size="small"
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <>
                      <MdSearch style={{ color: '#999', marginLeft: 8 }} />
                      {params.InputProps.startAdornment}
                    </>
                  ),
                  endAdornment: (
                    <>
                      {searching ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
            renderOption={(props: any, option: Product) => (
              <OptionItem {...props} key={option._id}>
                <OptionName>{option.descripcion}</OptionName>
                {option.marca && <OptionMeta>Marca: {option.marca}</OptionMeta>}
              </OptionItem>
            )}
            fullWidth
          />
          
          <CreateButton onClick={handleOpenCreateModal} primary>
            <MdAdd size={16} />
            Crear Producto Nuevo
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
    // Buscar primero en sugerencias, luego en resultados de búsqueda
    const selectedProduct = 
      item.suggestions?.find((s: ProductSuggestion) => s._id === link.chosenProductId) ||
      searchResults.find((p: Product) => p._id === link.chosenProductId);
    
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

const SearchInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #666;
  padding: 4px 0;
  
  span {
    font-style: italic;
  }
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

const OptionMeta = styled.span`
  font-size: 11px;
  color: #999;
  margin-left: 8px;
`;

const OptionScore = styled.span`
  font-size: 12px;
  color: #666;
  font-weight: 600;
`;
