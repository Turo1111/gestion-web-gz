/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';// Usar react-icons para íconos
import apiClient from '../utils/client';
import { useAppDispatch, useAppSelector } from '../redux/hook';
import { getUser } from '../redux/userSlice';
import { setAlert } from '../redux/alertSlice';

import {IoIosArrowDown} from 'react-icons/io'
import useLocalStorage from '@/hooks/useLocalStorage';

interface Item {
  _id: string;
  descripcion: string;
}

interface InputSelectProps {
  value: string;
  onChange: (id: string, item: any) => void;
  name: string;
  path: string;
}

const InputSelect: React.FC<InputSelectProps> = ({ value, onChange, name, path }) => {
  const [open, setOpen] = useState(false);
  const user = useAppSelector(getUser);
  const [data, setData] = useState<Item[]>([]);
  const [inputValue, setInputValue] = useState(value || '');
  const [isActive, setIsActive] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const dispatch = useAppDispatch();
  const [valueStorage , setValue] = useLocalStorage("user", "")

  const getData = () => {
    setLoading(true);
    apiClient.get(path, {
      headers: {
        Authorization: `Bearer ${valueStorage.token}`, // Agregar el token en el encabezado como "Bearer {token}"
      },
    })
      .then(response => {
        setData(response.data);
        setLoading(false);
      })
      .catch(e => console.log(e));
  };

  const addValue = (item: Item) => {
    onChange(item._id, item);
    setInputValue(item.descripcion);
    setOpen(false);
    setIsActive(true);
    setIsFocused(true);
  };

  const cleanValue = () => {
    onChange('', '' );
    setInputValue('');
    setIsActive(false);
    setIsFocused(false);
  };

  const handleInputFocus = () => {
    setIsActive(true);
    setIsFocused(true);
  };

  const handleInputBlur = () => {
    setIsActive(inputValue !== '');
    setIsFocused(false);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  useEffect(() => {
    getData();
  }, [valueStorage.token]);

  useEffect(() => {
    if (value === '' || value === undefined) {
      setInputValue('');
      setIsActive(false);
      setIsFocused(false);
    } else {
      setIsActive(true);
      setIsFocused(true);
    }
  }, [value]);

  useEffect(() => {
    if (inputValue !== '') {
      setOpen(false);
    }
  }, [inputValue]);

  return (
    <Container>
      <StyledInput
        placeholder={name}
        value={inputValue}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
      />
      {
        inputValue === ''
          ? (
            <ArrowContainer onClick={() => setOpen(!open)}>
              <IoIosArrowDown />
            </ArrowContainer>
          )
          : (
            loading2
              ? <LoadingText>Cargando...</LoadingText>
              : (
                <ActionContainer>
                  <ActionText onClick={cleanValue}>Quitar</ActionText>
                </ActionContainer>
              )
          )
      }
      <Dropdown open={open}>
        <ScrollContainer>
          {
            loading
              ? <LoadingText>Cargando...</LoadingText>
              : data.length === 0
                ? <LoadingText>Lista Vacía</LoadingText>
                : data.map(item => (
                  <ItemContainer key={item._id} onClick={() => addValue(item)}>
                    <ItemText>{item.descripcion}</ItemText>
                  </ItemContainer>
                ))
          }
        </ScrollContainer>
      </Dropdown>
    </Container>
  );
};

export default InputSelect;

// Styled Components
const Container = styled.div`
  position: relative;
`;

const StyledInput = styled.input`
  margin: 10px 0;
  border: 1px solid #D9D9D9;
  padding: 5px 15px;
  border-radius: 10px;
  color: #7F8487;
  font-size: 14px;
  background-color: #fff;
  width: 100%;
`;

const ArrowContainer = styled.div`
  position: absolute;
  right: 15px;
  top: 15px;
  cursor: pointer;
`;

const ActionContainer = styled.div`
  position: absolute;
  right: 5px;
  top: 10px;
  display: flex;
  flex-direction: row;
`;

const ActionText = styled.span`
  font-size: 16px;
  color: #7F8487;
  margin: 5px 15px;
  cursor: pointer;
`;

const Dropdown = styled.div<{ open: boolean }>`
  position: absolute;
  max-height: 150px;
  background-color: #fff;
  width: 100%;
  top: 40px;
  z-index: 2;
  display: ${props => (props.open ? 'block' : 'none')};
  overflow: auto;
`;

const ScrollContainer = styled.div`
  max-height: 150px;
  overflow-y: auto;
`;

const LoadingText = styled.p`
  font-size: 16px;
  color: #7F8487;
  margin: 5px 15px;
`;

const ItemContainer = styled.div`
  padding: 5px 15px;
  cursor: pointer;
`;

const ItemText = styled.p`
  font-size: 16px;
  color: #7F8487;
  margin: 5px 0;
`;
