/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import Modal from '../Modal'
import apiClient from '@/utils/client'
import styled from 'styled-components'
import Button from '../Button'
import { useAppDispatch } from '@/redux/hook'
import { setLoading } from '@/redux/loadingSlice'

interface CBP {
  _id: (string | number) 
  descripcion: string
}

export default function FilterProduct({open, handleClose, activeCategorie, activeBrand, activeProvider, selectCategorie, selectBrand, selectProvider}:
    {open: boolean, handleClose: ()=>void, activeCategorie: (string | number), activeBrand: (string | number), activeProvider: (string | number), 
      selectCategorie: (item: CBP)=>void, selectBrand: (item: CBP)=>void, selectProvider: (item: CBP)=>void}) {

    const [categorie, setCategorie] = useState<CBP[]>([])
    const [brand, setBrand] = useState<CBP[]>([])
    const [provider, setProvider] = useState<CBP[]>([])
    const dispatch = useAppDispatch();

    const getCategorie = () => {
      dispatch(setLoading(true));
      apiClient.get(`/categorie`)
      .then(function(response){
        setCategorie([ {_id: 1 , descripcion: 'Todas'}, ...response.data])
        dispatch(setLoading(false));
      })
      .catch(function(error){
          console.log("get",error);
          dispatch(setLoading(false));
      })
    }

    const getBrand = () => {
      dispatch(setLoading(true));
      apiClient.get(`/brand`)
      .then(function(response){
        setBrand([ {_id: 1 , descripcion: 'Todas'}, ...response.data])
        dispatch(setLoading(false));
      })
      .catch(function(error){
          console.log("get",error);
          dispatch(setLoading(false));
      })
    }

    const getProvider = () => {
        dispatch(setLoading(true));
        apiClient.get(`/provider`)
        .then(function(response){
          setProvider([ {_id: 1 , descripcion: 'Todas'}, ...response.data])
          dispatch(setLoading(false));
        })
        .catch(function(error){
            console.log("get",error);
            dispatch(setLoading(false));
        })
    }

    useEffect(()=>{
        if (open) {
          getCategorie()
          getBrand()
          getProvider()
        }
    }, [open])

  return (
    <Modal open={open} title={'Filtrar productos'} eClose={handleClose} width='60%' height='auto'>
        <div style={{padding: 15}}>
            <TitleText>CATEGORIAS</TitleText>
            <HorizontalList>
            {categorie.map((item: CBP) => (
                <ItemListText
                key={item._id}
                $isActive={activeCategorie === item._id}
                onClick={() => selectCategorie(item)}
                >
                {item.descripcion}
                </ItemListText>
            ))}
            </HorizontalList>

            <TitleText>MARCAS</TitleText>
            <HorizontalList>
            {brand.map((item: CBP) => (
                <ItemListText
                key={item._id}
                $isActive={activeBrand === item._id}
                onClick={() => selectBrand(item)}
                >
                {item.descripcion}
                </ItemListText>
            ))}
            </HorizontalList>

            <TitleText>PROVEEDORES</TitleText>
            <HorizontalList>
            {provider.map((item: CBP) => (
                <ItemListText
                key={item._id}
                $isActive={activeProvider === item._id}
                onClick={() => selectProvider(item)}
                >
                {item.descripcion}
                </ItemListText>
            ))}
            </HorizontalList>
        <ButtonContainer>
            <Button text={'Cancelar'} onClick={handleClose} />
            <Button text={'Aceptar'} onClick={handleClose} />
        </ButtonContainer>
        </div>
    </Modal>
  )
}

// Estilos para los componentes de texto y listas
const TitleText = styled.h2`
  font-size: 16px;
  font-family: 'Cairo-Bold', sans-serif;
  color: #716A6A;
  margin-bottom: 15px;
`;

const ItemListText = styled.li<{ $isActive: boolean }>`
  font-size: 14px;
  font-family: 'Cairo-Bold', sans-serif;
  color: ${({ $isActive }) => ($isActive ? '#fff' : '#716A6A')};
  background-color: ${({ $isActive }) => ($isActive ? '#3764A0' : 'none')};
  border: ${({ $isActive }) => ($isActive ? '1px solid #d9d9d9' : 'none')};
  border-radius: ${({ $isActive }) => ($isActive ? '15px' : 'none')};
  margin-right: 10px;
  padding: 5px 15px;
  list-style:none;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  &:hover{
    border: 1px solid #d9d9d9;
    border-radius: 15px;
    background-color: #3764A0;
    color: white;
  }
  @media only screen and (max-width: 500px) {
    padding: 2px 10px;
  }
`;

const HorizontalList = styled.ul`
  display: flex;
  overflow-x: scroll;
  margin-bottom: 15px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-around;
  margin: 15px 0;
`;