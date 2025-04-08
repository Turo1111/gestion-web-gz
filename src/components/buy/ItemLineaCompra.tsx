import { ExtendItemBuy } from '@/interfaces/buy.interface'
import { Product } from '@/interfaces/product.interface'
import { ExtendItemSale, ItemSale } from '@/interfaces/sale.interface'
import { Types } from 'mongoose'
import React, { ChangeEvent, useEffect, useState } from 'react'
import { BiPlus, BiTrash } from 'react-icons/bi'
import styled, { css } from 'styled-components'
import { FaPlus } from "react-icons/fa";
import { MdOutlineAttachMoney } from 'react-icons/md'
import { AnimatedNumber } from '../AnimatedNumber'
import SimpleCheckbox from '../SimpleCheckbox'
import { useAppDispatch } from '@/redux/hook'
import { onChangePrecioUnitarioSale } from '@/redux/saleSlice'

export default function ItemLineaCompra({elem, onClick, upQTY, downQTY, downQTY10, upQTY10, onChangePrecioCompra}:
    {onClick:()=>void, upQTY:(id:string | Types.ObjectId| undefined)=>void, 
        onChangePrecioCompra?: (value:string, D: any)=>void
        downQTY: (id:string | Types.ObjectId | undefined)=>void, upQTY10:(id:string | Types.ObjectId | undefined)=>void, 
        downQTY10:(id:string | Types.ObjectId | undefined)=>void, elem: ExtendItemSale | ExtendItemBuy, compra?: boolean}) {

    const [openHandler, setOpenHandler] = useState(false)
    const [openPrecioCompra, setOpenPrecioCompra] = useState(false)
    const dispatch = useAppDispatch();

  return (
    <Item >
        <div style={{width: '100%'}}>
            <ContainerElem>
                <Description>{elem.descripcion}</Description>
                <div  style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}} >
                    <h2 style={{fontSize: 14, fontWeight: 600, color: '#7F8487'}}>X {elem.cantidad} UNIDAD</h2>
                    <label style={{fontSize: 14, fontWeight: 600, color: '#FA9B50', marginRight: 5}}>
                        $
                        <AnimatedNumber value={elem.total} />
                    </label>
                </div>
            </ContainerElem>
            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '5px 0'}} >
                <IconWrapper onClick={()=>setOpenHandler(!openHandler)} $open={openHandler}>
                    <FaPlus style={{margin: '0 5px', color: '#7286D3'}} />
                </IconWrapper>
                <IconWrapper onClick={()=>setOpenPrecioCompra(!openPrecioCompra)} $open={openPrecioCompra}>
                    <MdOutlineAttachMoney style={{fontSize: 20, margin: '0 5px', color: '#B0EBB4'}} />
                </IconWrapper>
                <IconWrapper>
                    <BiTrash style={{fontSize: 20, margin: '0 5px', color: '#F7A4A4'}} onClick={onClick}/>
                </IconWrapper>
            </div>
            {
                (openPrecioCompra && onChangePrecioCompra) &&
                <div style={{display: 'flex', alignItems: 'center'}} >
                    <label style={{fontSize: 14, fontWeight: 400, color: '#7F8487', marginRight: 5}}>Precio : $</label>
                    {
                        <Input value={elem.precio} onChange={(e:ChangeEvent<HTMLInputElement>)=>onChangePrecioCompra(e.target.value, elem.idProducto)} />
                    } 
                </div>
            }
            {
                (openHandler) &&
                <ContainerHandler>
                    <div>
                        <div style={{display: 'flex', width: '100%'}}>
                            <div style={{display: 'flex'}}>
                                <ButtonHandler onClick={()=>downQTY10(elem.idProducto)}>-10</ButtonHandler>
                                <ButtonHandler onClick={()=>downQTY(elem.idProducto)}>-</ButtonHandler>
                            </div>
                            <QtyHandler><AnimatedNumber value={elem.cantidad} /></QtyHandler>
                            <div style={{display: 'flex'}}>
                                <ButtonHandler onClick={()=>upQTY(elem.idProducto)} >+</ButtonHandler>
                                <ButtonHandler onClick={()=>upQTY10(elem.idProducto)}>+10</ButtonHandler>
                            </div>
                        </div>
                    </div>
                </ContainerHandler>
            }
        </div>
    </Item>
  )
}

const QtyHandler = styled.div `
    font-size: 16px;
    color: #252552;
    padding: 5px 10px;
    &:hover {
        background-color: #d9d9d9;
        border-radius: 100%;
        color: #6A5BCD;
    }
`

const ButtonHandler = styled.div `
    font-size: 14px; 
    font-weight: 400; 
    color: #7F8487; 
    padding: 5px 10px;
    &:hover {
        background-color: #d9d9d9;
        border-radius: 100%;
        color: #6A5BCD;
    }
`

const Input = styled.input<{ $focused?: boolean; $hasPrefix?: boolean; }>`
  padding: 5px 10px;
  font-size: 16px;
  max-width: 100px;
  color: ${props => props.color};
  border-radius: 10px;
  border: ${({ $focused }) => ($focused ? '2px solid #7286D3' : '1px solid #d9d9d9')};
  transition: border-color 0.2s ease-in-out;
  padding-left: ${({ $hasPrefix }) => ($hasPrefix ? '30px' : '10px')};

  &:focus {
    outline: none;
  }
`;

const Description = styled.h2 `
    font-size: 16px;
    color: #252525;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    max-width: 95%;
    @media only screen and (max-width: 500px) { 
        font-size: 16px
    } 
`

const ContainerHandler = styled.div `
    display: flex;
    width: 100%;
    justify-content: center;
    align-items: center;
`

const ContainerElem = styled.div`
`

const Item = styled.li `
  list-style: none;
  padding: 8px;
  font-weight: 600;
  width: 100%;
  border-bottom: 1px solid #d1d1d1;
  display: flex;
  justify-content: space-between;
  cursor: pointer;
  @media only screen and (max-width: 500px) {
    flex-direction: column;
    justify-content: center;
    padding: 15px 0;
  }
`

const IconWrapper = styled.div<{$open?: boolean}>`
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 5px;
    border-radius: 15px;
    transform: ${({$open})=>$open ? css`rotate(180deg)` : css`rotate(0deg)`};
    transition: transform .5s linear;
    cursor: pointer;
    &:hover {
        background-color: #d1d1d1;
    }
`