import React, { useEffect, useState } from 'react'
import Modal from '../Modal'
import apiClient from '@/utils/client'
import styled from 'styled-components'
import Button from '../Button'

export default function FilterProduct({open, handleClose, activeCategorie, activeBrand, activeProvider, selectCategorie, selectBrand, selectProvider}:
    {open: boolean, handleClose: any, activeCategorie: any, activeBrand: any, activeProvider: any, selectCategorie: any, selectBrand: any, selectProvider: any}) {

    const [categorie, setCategorie] = useState<any>([])
    const [brand, setBrand] = useState<any>([])
    const [provider, setProvider] = useState<any>([])

    const getCategorie = () => {
      apiClient.get(`/categorie`)
      .then(function(response){
        setCategorie([ {_id: 1 , descripcion: 'Todas'}, ...response.data])
      })
      .catch(function(error){
          console.log("get",error);
      })
    }

    const getBrand = () => {
      apiClient.get(`/brand`)
      .then(function(response){
        setBrand([ {_id: 1 , descripcion: 'Todas'}, ...response.data])
      })
      .catch(function(error){
          console.log("get",error);
      })
    }

    const getProvider = () => {
        apiClient.get(`/provider`)
        .then(function(response){
          setProvider([ {_id: 1 , descripcion: 'Todas'}, ...response.data])
        })
        .catch(function(error){
            console.log("get",error);
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
            {categorie.map((item: any) => (
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
            {brand.map((item: any) => (
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
            {provider.map((item: any) => (
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