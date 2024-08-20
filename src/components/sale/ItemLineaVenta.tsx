import { Product } from '@/interfaces/product.interface'
import { ExtendItemSale, ItemSale } from '@/interfaces/sale.interface'
import { Types } from 'mongoose'
import React from 'react'
import { BiTrash } from 'react-icons/bi'
import styled from 'styled-components'

export default function ItemLineaVenta({elem, onClick, upQTY, downQTY, downQTY10, upQTY10}:
    {onClick:()=>void, upQTY:(id:string | Types.ObjectId| undefined)=>void, 
    downQTY: (id:string | Types.ObjectId | undefined)=>void, upQTY10:(id:string | Types.ObjectId | undefined)=>void, 
    downQTY10:(id:string | Types.ObjectId | undefined)=>void, elem: ExtendItemSale}) {
  return (
    <Item>
        <div>
            <h2 style={{fontSize: 18, color: '#252525'}}>{elem.descripcion}</h2>
            <h2 style={{fontSize: 14, fontWeight: 400, color: '#7F8487'}}>{elem.NameCategoria}</h2>
        </div>
        <div style={{display: 'flex'}}>
            <div>
                <div style={{display: 'flex'}}>
                    <div style={{display: 'flex'}}>
                        <div style={{fontSize: 14, fontWeight: 400, color: '#7F8487', padding: 10, borderRight: '1px solid #d9d9d9'}} onClick={()=>downQTY10(elem._id)}>-10</div>
                        <div style={{fontSize: 14, fontWeight: 400, color: '#7F8487', padding: 10, borderRight: '1px solid #d9d9d9'}} onClick={()=>downQTY(elem._id)}>-</div>
                    </div>
                    <div style={{fontSize: 18, color: '#252525', padding: 10}}>{elem.cantidad}</div>
                    <div style={{display: 'flex'}}>
                        <div style={{fontSize: 14, fontWeight: 400, color: '#7F8487', padding: 10, borderLeft: '1px solid #d9d9d9'}} onClick={()=>upQTY(elem._id)} >+</div>
                        <div style={{fontSize: 14, fontWeight: 400, color: '#7F8487', padding: 10, borderLeft: '1px solid #d9d9d9'}} onClick={()=>upQTY10(elem._id)}>+10</div>
                    </div>
                </div>
                <h2 style={{fontSize: 16, fontWeight: 600, color: '#FA9B50', textAlign: 'center'}}>$ {elem.total}</h2>
            </div>
            <IconWrapper  onClick={onClick}>
                <BiTrash/>
            </IconWrapper>
        </div>
    </Item>
  )
}

const Item = styled.li `
  list-style: none;
  padding: 15px;
  font-weight: 600;
  width: 100%;
  border-bottom: 1px solid #d1d1d1;
  display: flex;
  justify-content: space-between;
  cursor: pointer;
`

const IconWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 25px;
    color: #F7A4A4;
    padding: 5px 15px;
    margin: 0px 5px;
    cursor: pointer;
    &:hover {
        background-color: #d9d9d9;
    }
`