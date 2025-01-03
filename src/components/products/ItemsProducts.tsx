import { Product } from '@/interfaces/product.interface';
import React, { useState } from 'react'
import { MdEdit, MdInfo } from 'react-icons/md';
import styled from 'styled-components';
import ButtonUI from '../ButtonUI';

export default function ItemsProducts({item, onClick, select = true, onClickItem, line = true}:{item: Product, onClick?: ()=>void, select?:boolean, onClickItem?: ()=>void, line?:boolean}) {
    const [openInfo, setOpenInfo] = useState(false);
    
    return (
        <ItemProduct onClick={onClickItem} $line={line}>
            <Container>
                <Column>
                    <Row>
                        <Title>{item.descripcion}</Title>
                        <Price>$ {item.precioUnitario}</Price>
                    </Row>
                    <Row>
                        <Subtitle>{item.NameCategoria}</Subtitle>
                        <Subtitle>{item.NameMarca}</Subtitle>
                    </Row>
                </Column>
                {select && 
                    <ContainerButton>
                        {/* <IconWrapper style={{color: '#A2CA71'}} onClick={onClick}>
                            <MdEdit />
                        </IconWrapper>
                        <IconWrapper style={{color: '#6EACDA'}} onClick={() => setOpenInfo(!openInfo)}>
                            <MdInfo />
                        </IconWrapper> */}
                      <ButtonUI label='EDITAR' onClick={()=>onClick} />
                      <ButtonUI label='+ INFO' onClick={()=>onClick} />
                    </ContainerButton>
                }
            </Container>
            {openInfo && 
                <InfoContainer>
                    <InfoText>Stock: {item?.stock || 'No definido'}</InfoText>
                    <InfoText>Proveedor: {item?.NameProveedor || 'No definido'}</InfoText>
                    <InfoText>Codigo de barra: {item?.codigoBarra || 'Sin codigo'}</InfoText>
                    <InfoText>Peso: {item?.peso?.cantidad || 'No definido'} {item?.peso?.unidad}</InfoText>
                    <InfoText>Bulto: {item?.bulto || 'No definido'}</InfoText>
                    <InfoText>Precio por Bulto: {item?.precioBulto || 'No definido'}</InfoText>
                    <InfoText>Precio de compra: {item?.precioCompra || 'No definido'}</InfoText>
                </InfoContainer>
            }
        </ItemProduct>
    );
}


interface ItemProduct {
    $line?: boolean;
}

const ContainerButton = styled.div `
  display: flex;
  @media (max-width: 480px) {  
    justify-content: center;
    margin-top: 10px;
  }
`

const ItemProduct = styled.li <ItemProduct> `
  list-style: none;
  padding: 15px;
  font-weight: 600;
  width: 100%;
  /* border: ${({ $line }) => ($line ? '1px solid #d1d1d1' : 'none')}; */
  border: 1px solid #fff;
  margin-bottom: 5px;
  margin-top: 5px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;  
  justify-content: center; 
  min-height: 60px;  
  height: auto;  
  background-color: #fff;
  box-shadow: 5px 5px 5px #e0e0e0;
  transition: background-color .5s linear, border-color .1s ease;
  &:hover {
    border: 1px solid #6A5BCD;
    background-color: rgba(217, 217, 217, 0.3);
  }
  @media only screen and (max-width: 500px) {
    padding: 8px;
  }
`

const IconWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 32px;
    color: #716A6A;
    padding: 5px 15px;
    margin: 0px 5px;
    border-left: 1px solid #d9d9d9;
    cursor: pointer;
    &:hover {
        background-color: #d9d9d9;
    }
    @media only screen and (max-width: 500px) {
        font-size: 22px;
        padding: 0px 8px;
    }
`

const Container = styled.div`
  display: flex;
  flex: 1;
  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

const Column = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  margin-right: 15px;
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Title = styled.h2`
  font-size: 18px;
  color: #252525;
  @media only screen and (max-width: 500px) {
    font-size: 16px;
  }
`;

const Price = styled(Title)`
  color: #FA9B50;
  font-size: 18px;
  @media only screen and (max-width: 500px) {
    font-size: 16px;
  }
`;

const Subtitle = styled.h5`
  font-size: 14px;
  font-weight: 400;
  color: #7F8487;
  @media only screen and (max-width: 500px) {
    font-size: 14px;
  }
`;

const InfoContainer = styled.div`
  padding: 15px 0;
`;

const InfoText = styled.h2`
  font-size: 14px;
  font-weight: 400;
  color: #7F8487;
  @media only screen and (max-width: 500px) {
    font-size: 14px;
  }
`;
