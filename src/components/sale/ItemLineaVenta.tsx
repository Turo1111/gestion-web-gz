import { ExtendItemBuy } from '@/interfaces/buy.interface'
import { Product } from '@/interfaces/product.interface'
import { ExtendItemSale, ItemSale } from '@/interfaces/sale.interface'
import { Types } from 'mongoose'
import React, { ChangeEvent } from 'react'
import { BiTrash } from 'react-icons/bi'
import styled from 'styled-components'

export default function ItemLineaVenta({elem, onClick, upQTY, downQTY, downQTY10, upQTY10, onChangePrecioUnitario}:
    {onClick:()=>void, upQTY:(id:string | Types.ObjectId| undefined)=>void, 
        onChangePrecioUnitario?: (value:string, idProduct: any)=>void
    downQTY: (id:string | Types.ObjectId | undefined)=>void, upQTY10:(id:string | Types.ObjectId | undefined)=>void, 
    downQTY10:(id:string | Types.ObjectId | undefined)=>void, elem: ExtendItemSale | ExtendItemBuy}) {

        console.log(elem)
  return (
    <Item>
        <div>
            <ContainerElem>
                <Description>{elem.descripcion}</Description>
                <h2 style={{fontSize: 14, fontWeight: 400, color: '#7F8487'}}>{elem.NameCategoria}</h2>
            </ContainerElem>
            {
                onChangePrecioUnitario &&
                <div style={{display: 'flex', alignItems: 'center'}} >
                    <label style={{fontSize: 14, fontWeight: 400, color: '#7F8487', marginRight: 5}}>Precio u. : $</label>
                    <Input value={elem.precioUnitario} onChange={(e:ChangeEvent<HTMLInputElement>)=>onChangePrecioUnitario(e.target.value, elem._id)} />
                </div>
            }
        </div>
        <ContainerHandler>
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
        </ContainerHandler>
    </Item>
  )
}

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
    font-size: 18px;
    color: #252525;
    @media only screen and (max-width: 500px) { 
        font-size: 16px
    } 
`

const ContainerHandler = styled.div `
    display: flex;
    @media only screen and (max-width: 500px) { 
        align-items: center;
        justify-content: space-between;
        margin-top: 5px;
    } 
`

const ContainerElem = styled.div`
    @media only screen and (max-width: 500px) { 
        display: flex;
        align-items: center;
        justify-content: space-between;
    } 
`

const Item = styled.li `
  list-style: none;
  padding: 15px;
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