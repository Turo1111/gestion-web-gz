import React, { useState } from 'react'
import { MdEdit, MdInfo } from 'react-icons/md';
import styled from 'styled-components';

export default function ItemsProducts({item, onClick, select = true, onClickItem, line = true}:{item: any, onClick?: any, select?:boolean, onClickItem?: any, line?:boolean}) {

    const [openInfo, setOpenInfo] = useState(false)
    
  return (
    <ItemProduct onClick={onClickItem} line={line} >
        <div style={{display: 'flex', flex: 1}}>
            <div style={{display: 'flex', flex: 1, flexDirection: 'column', marginRight: 15}}>
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <h2 style={{fontSize: 18, color: '#252525'}}>{item.descripcion}</h2>
                    <h2 style={{fontSize: 18, color: '#FA9B50'}}>$ {item.precioUnitario}</h2>
                </div>
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <h5 style={{fontSize: 14, fontWeight: 400, color: '#7F8487'}}>{item.NameCategoria}</h5>
                    <h5 style={{fontSize: 14, fontWeight: 400, color: '#7F8487'}}>{item.NameMarca}</h5>
                </div>
            </div>
            {
                select && 
                <div  style={{display: 'flex'}}>
                    <IconWrapper style={{color: '#A2CA71'}}  onClick={onClick}>
                    <MdEdit />
                    </IconWrapper>
                    <IconWrapper style={{color: '#6EACDA'}} onClick={()=>setOpenInfo(!openInfo)}>
                    <MdInfo />
                    </IconWrapper>
                </div>
            }
        </div>
        {
            openInfo && 
            <div style={{padding: '15px 0'}} >
                <h2 style={{fontSize: 14, fontWeight: 400, color: '#7F8487'}}>Stock: {item?.stock || 'No definido'}</h2>
                <h2 style={{fontSize: 14, fontWeight: 400, color: '#7F8487'}}>Proveedor: {item?.NameProveedor || 'No definido'}</h2>
                <h2 style={{fontSize: 14, fontWeight: 400, color: '#7F8487'}}>Codigo de barra: {item?.codigoBarra || 'Sin codigo'}</h2>
                <h2 style={{fontSize: 14, fontWeight: 400, color: '#7F8487'}}>Peso: {item?.peso?.cantidad || 'No definido'} {item?.peso?.unidad}</h2>
                <h2 style={{fontSize: 14, fontWeight: 400, color: '#7F8487'}}>Bulto: {item?.bulto || 'No definido'}</h2>
                <h2 style={{fontSize: 14, fontWeight: 400, color: '#7F8487'}}>Precio por Bulto: {item?.precioBulto || 'No definido'}</h2>
                <h2 style={{fontSize: 14, fontWeight: 400, color: '#7F8487'}}>Precio de compra: {item?.precioCompra || 'No definido'}</h2>
            </div>
        }
    </ItemProduct>
  )
}

interface ItemProduct {
    line?: boolean;
}

const ItemProduct = styled.li <ItemProduct> `
  list-style: none;
  padding: 15px;
  font-weight: 600;
  width: 100%;
  border-bottom: ${({ line }) => (line ? '1px solid #d1d1d1' : 'none')};
  display: flex;
  flex-direction: column;
  flex-shrink: 0;  /* Evita que el item se encoja demasiado */
  justify-content: center;  /* Centra el contenido verticalmente */
  min-height: 60px;  /* Altura mínima para que no crezca mucho con pocos elementos */
  height: auto;  /* Altura automática basada en el contenido */
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
`