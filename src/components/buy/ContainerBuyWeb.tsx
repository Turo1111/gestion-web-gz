import React from 'react'
import styled from 'styled-components'
import FindProductSale from '../sale/FindProductSale'
import { useAppDispatch } from '@/redux/hook';
import { Product } from '@/interfaces/product.interface';
import LineaCompra from './LineaCompra';
import { addItemBuy } from '@/redux/buySlice';

export default function ContainerBuyWeb() {

    const dispatch = useAppDispatch();

  return (
    <div style={{display: 'flex', flex: 1}}>
        <ContainerListProduct>
          <FindProductSale
              onClickItem={(item:Product)=>{dispatch(addItemBuy({item}))}}
          />
        </ContainerListProduct>
        <LineaCompra  />
    </div>
  )
}

const ContainerListProduct = styled.div `
  width: 50%;
  @media only screen and (max-width: 940px) {
    width: 100%;
  }
`