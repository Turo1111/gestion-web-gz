'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';
import { IoIosArrowDown, IoIosClose, IoIosSearch } from 'react-icons/io';
import apiClient from '@/utils/client';
import useLocalStorage from '@/hooks/useLocalStorage';

// Tipos e interfaces
export interface SelectOption {
  id: string;
  label: string;
  subtitle?: string;
  keywords?: string | string[];
  group?: string;
  disabled?: boolean;
  meta?: Record<string, any>;
}

export interface SelectSearchableProps {
  options: SelectOption[];
  selectedId?: string | null;
  placeholder?: string;
  isRequired?: boolean;
  isLoading?: boolean;
  errorMessage?: string;
  helperText?: string;
  name?: string;
  onSelect?: (option: SelectOption) => void;
  onClear?: () => void;
  onOpen?: (fieldName?: string, optionCount?: number) => void;
  onClose?: () => void;
  onSearchChange?: (searchText: string, resultCount: number) => void;
  clearSearchOnClose?: boolean; // Si true, limpia el texto de búsqueda al cerrar
  maxHeight?: string;
  width?: string;
}

// Función para normalizar texto (quitar tildes y convertir a minúsculas)
const normalizeText = (text: string): string => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
};

// Función para filtrar opciones
const filterOptions = (options: SelectOption[], searchText: string): SelectOption[] => {
  if (!searchText.trim()) return options;

  const normalizedSearch = normalizeText(searchText);

  return options.filter((option) => {
    // Buscar en label
    if (normalizeText(option.label).includes(normalizedSearch)) {
      return true;
    }

    // Buscar en subtitle
    if (option.subtitle && normalizeText(option.subtitle).includes(normalizedSearch)) {
      return true;
    }

    // Buscar en keywords
    if (option.keywords) {
      const keywordsArray = Array.isArray(option.keywords) 
        ? option.keywords 
        : [option.keywords];
      
      if (keywordsArray.some(keyword => normalizeText(keyword).includes(normalizedSearch))) {
        return true;
      }
    }

    return false;
  });
};

const SelectSearchable: React.FC<SelectSearchableProps> = ({
  options = [],
  selectedId,
  placeholder = 'Seleccionar...',
  isRequired = false,
  isLoading = false,
  errorMessage,
  helperText,
  name,
  onSelect,
  onClear,
  onOpen,
  onClose,
  onSearchChange,
  clearSearchOnClose = true,
  maxHeight = '300px',
  width = '100%',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filteredOptions, setFilteredOptions] = useState<SelectOption[]>(options);
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const valueStorage = useLocalStorage("user", "")

  // Obtener la opción seleccionada
  const selectedOption = options.find(opt => opt.id === selectedId || opt.id === String(selectedId));

  const getData = () => {
    apiClient.get('categorie', {
      headers: {
        // @ts-ignore
        Authorization: `Bearer ${valueStorage.token}`,
      },
    })
      .then(response => {
        console.log(response.data);
      })
      .catch(e => console.log(e));
  };

  // Filtrar opciones cuando cambia el texto de búsqueda o las opciones
  useEffect(() => {
    const filtered = filterOptions(options, searchText);
    setFilteredOptions(filtered);
    getData();
    // Evento para analytics
    if (onSearchChange && searchText.trim()) {
      onSearchChange(searchText, filtered.length);
    }
  }, [searchText, options, onSearchChange]);

  // Definir handleClose primero para que pueda ser usado por otros callbacks y efectos
  const handleClose = useCallback(() => {
    setIsOpen(false);
    if (clearSearchOnClose) {
      setSearchText('');
    }
    if (onClose) {
      onClose();
    }
  }, [clearSearchOnClose, onClose]);

  // Manejar clic fuera del componente
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isOpen, handleClose]);

  // Enfocar el input de búsqueda cuando se abre el dropdown
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  const handleToggle = useCallback(() => {
    if (isOpen) {
      handleClose();
    } else {
      setIsOpen(true);
      if (onOpen) {
        onOpen(name, options.length);
      }
    }
  }, [isOpen, onOpen, name, options.length, handleClose]);

  const handleSelect = useCallback((option: SelectOption) => {
    if (option.disabled) return;

    if (onSelect) {
      onSelect(option);
    }
    
    setSearchText('');
    handleClose();
  }, [onSelect, handleClose]);

  const handleClear = useCallback(() => {
    if (onClear) {
      onClear();
    }
    setSearchText('');
  }, [onClear]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  // Agrupar opciones si tienen group
  const groupedOptions = filteredOptions.reduce((acc, option) => {
    const group = option.group || 'Sin grupo';
    if (!acc[group]) {
      acc[group] = [];
    }
    acc[group].push(option);
    return acc;
  }, {} as Record<string, SelectOption[]>);

  const hasGroups = Object.keys(groupedOptions).length > 1 || 
    (Object.keys(groupedOptions).length === 1 && Object.keys(groupedOptions)[0] !== 'Sin grupo');

  return (
    <Container ref={containerRef} width={width}>
      <InputWrapper
        onClick={handleToggle}
        $isOpen={isOpen}
        $hasError={!!errorMessage}
        $isFocused={isOpen}
      >
        <InputContent>
          {selectedOption ? (
            <SelectedValue>
              <SelectedLabel>{selectedOption.label}</SelectedLabel>
              {selectedOption.subtitle && (
                <SelectedSubtitle>{selectedOption.subtitle}</SelectedSubtitle>
              )}
            </SelectedValue>
          ) : (
            <Placeholder>{placeholder}</Placeholder>
          )}
        </InputContent>
        <ActionsContainer>
          {selectedOption && !isRequired && (
            <ClearButton
              onClick={(e) => {
                e.stopPropagation();
                handleClear();
              }}
              type="button"
            >
              <IoIosClose size={20} />
            </ClearButton>
          )}
          <ArrowIcon $isOpen={isOpen}>
            <IoIosArrowDown size={20} />
          </ArrowIcon>
        </ActionsContainer>
      </InputWrapper>

      {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
      {helperText && !errorMessage && <HelperText>{helperText}</HelperText>}

      {isOpen && (
        <Dropdown ref={dropdownRef} maxHeight={maxHeight}>
          <SearchContainer>
            <SearchIcon>
              <IoIosSearch size={18} />
            </SearchIcon>
            <SearchInput
              ref={searchInputRef}
              type="text"
              placeholder="Buscar..."
              value={searchText}
              onChange={handleSearchChange}
              onClick={(e) => e.stopPropagation()}
            />
          </SearchContainer>

          <OptionsContainer>
            {isLoading ? (
              <EmptyState>
                <EmptyText>Cargando...</EmptyText>
              </EmptyState>
            ) : filteredOptions.length === 0 ? (
              <EmptyState>
                <EmptyText>Sin resultados</EmptyText>
              </EmptyState>
            ) : hasGroups ? (
              Object.entries(groupedOptions).map(([group, groupOptions]) => (
                <GroupContainer key={group}>
                  {group !== 'Sin grupo' && <GroupLabel>{group}</GroupLabel>}
                  {groupOptions.map((option) => (
                    <OptionItem
                      key={option.id}
                      onClick={() => handleSelect(option)}
                      $disabled={option.disabled}
                      $isSelected={option.id === selectedId}
                    >
                      <OptionContent>
                        <OptionLabel>{option.label}</OptionLabel>
                        {option.subtitle && (
                          <OptionSubtitle>{option.subtitle}</OptionSubtitle>
                        )}
                      </OptionContent>
                      {option.meta && Object.keys(option.meta).length > 0 && (
                        <OptionMeta>
                          {Object.entries(option.meta).map(([key, value]) => (
                            <MetaTag key={key}>{String(value)}</MetaTag>
                          ))}
                        </OptionMeta>
                      )}
                    </OptionItem>
                  ))}
                </GroupContainer>
              ))
            ) : (
              filteredOptions.map((option) => (
                <OptionItem
                  key={option.id}
                  onClick={() => handleSelect(option)}
                  $disabled={option.disabled}
                  $isSelected={option.id === selectedId}
                >
                  <OptionContent>
                    <OptionLabel>{option.label}</OptionLabel>
                    {option.subtitle && (
                      <OptionSubtitle>{option.subtitle}</OptionSubtitle>
                    )}
                  </OptionContent>
                  {option.meta && Object.keys(option.meta).length > 0 && (
                    <OptionMeta>
                      {Object.entries(option.meta).map(([key, value]) => (
                        <MetaTag key={key}>{String(value)}</MetaTag>
                      ))}
                    </OptionMeta>
                  )}
                </OptionItem>
              ))
            )}
          </OptionsContainer>
        </Dropdown>
      )}
    </Container>
  );
};

export default SelectSearchable;

// Styled Components
const Container = styled.div<{ width: string }>`
  position: relative;
  width: ${({ width }) => width};
  margin: 10px 0;
`;

const InputWrapper = styled.div<{ $isOpen: boolean; $hasError: boolean; $isFocused: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 15px;
  border: ${({ $hasError, $isFocused }) => 
    $hasError 
      ? '2px solid #f44336' 
      : $isFocused 
        ? '2px solid #7286D3' 
        : '1px solid #D9D9D9'};
  border-radius: 10px;
  background-color: #fff;
  cursor: pointer;
  transition: border-color 0.2s ease-in-out;
  min-height: 45px;
`;

const InputContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
`;

const SelectedValue = styled.div`
  display: flex;
  flex-direction: column;
`;

const SelectedLabel = styled.span`
  font-size: 16px;
  color: #333;
  font-weight: 500;
`;

const SelectedSubtitle = styled.span`
  font-size: 12px;
  color: #7F8487;
  margin-top: 2px;
`;

const Placeholder = styled.span`
  font-size: 16px;
  color: #7F8487;
`;

const ActionsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: 10px;
`;

const ClearButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  cursor: pointer;
  color: #7F8487;
  padding: 2px;
  transition: color 0.2s;

  &:hover {
    color: #333;
  }
`;

const ArrowIcon = styled.div<{ $isOpen: boolean }>`
  display: flex;
  align-items: center;
  color: #7F8487;
  transition: transform 0.2s ease-in-out;
  transform: ${({ $isOpen }) => ($isOpen ? 'rotate(180deg)' : 'rotate(0deg)')};
`;

const Dropdown = styled.div<{ maxHeight: string }>`
  position: absolute;
  top: calc(100% + -20px);
  left: 0;
  right: 0;
  background-color: #fff;
  border: 1px solid #D9D9D9;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  max-height: ${({ maxHeight }) => maxHeight};
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const SearchContainer = styled.div`
  position: relative;
  padding: 10px;
  border-bottom: 1px solid #E5E5E5;
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  color: #7F8487;
  display: flex;
  align-items: center;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 8px 15px 8px 40px;
  border: 1px solid #D9D9D9;
  border-radius: 8px;
  font-size: 14px;
  color: #333;
  background-color: #f9f9f9;

  &:focus {
    outline: none;
    border-color: #7286D3;
    background-color: #fff;
  }

  &::placeholder {
    color: #999;
  }
`;

const OptionsContainer = styled.div`
  overflow-y: auto;
  max-height: calc(100% - 60px);
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 10px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;

const GroupContainer = styled.div`
  margin-bottom: 8px;
`;

const GroupLabel = styled.div`
  padding: 8px 15px;
  font-size: 12px;
  font-weight: 600;
  color: #7F8487;
  text-transform: uppercase;
  background-color: #f5f5f5;
  border-bottom: 1px solid #E5E5E5;
`;

const OptionItem = styled.div<{ $disabled?: boolean; $isSelected?: boolean }>`
  padding: 12px 15px;
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  background-color: ${({ $isSelected }) => ($isSelected ? '#f0f4ff' : '#fff')};
  opacity: ${({ $disabled }) => ($disabled ? 0.5 : 1)};
  transition: background-color 0.2s;
  border-left: ${({ $isSelected }) => ($isSelected ? '3px solid #7286D3' : '3px solid transparent')};

  &:hover {
    background-color: ${({ $disabled }) => ($disabled ? '#fff' : '#f5f5f5')};
  }
`;

const OptionContent = styled.div`
  display: flex;
  flex-direction: column;
`;

const OptionLabel = styled.span`
  font-size: 16px;
  color: #333;
  font-weight: 500;
`;

const OptionSubtitle = styled.span`
  font-size: 12px;
  color: #7F8487;
  margin-top: 4px;
`;

const OptionMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 6px;
`;

const MetaTag = styled.span`
  font-size: 11px;
  padding: 2px 6px;
  background-color: #e8e8e8;
  border-radius: 4px;
  color: #555;
`;

const EmptyState = styled.div`
  padding: 30px 15px;
  text-align: center;
`;

const EmptyText = styled.p`
  font-size: 14px;
  color: #7F8487;
`;

const ErrorMessage = styled.p`
  font-size: 12px;
  color: #f44336;
  margin-top: 5px;
  margin-left: 5px;
`;

const HelperText = styled.p`
  font-size: 12px;
  color: #7F8487;
  margin-top: 5px;
  margin-left: 5px;
`;
