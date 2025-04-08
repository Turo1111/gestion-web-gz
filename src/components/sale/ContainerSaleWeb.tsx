import React from 'react'
import styled from 'styled-components'
import FindProductSale from './FindProductSale'
import { useAppDispatch } from '@/redux/hook';
import { addItemSale } from '@/redux/saleSlice';
import { Product } from '@/interfaces/product.interface';
import LineaVenta from './LineaVenta';

export default function ContainerSaleWeb({edit}:{edit?: boolean}) {

  const dispatch = useAppDispatch();

  return (
     <div style={{display: 'flex', flex: 1}}>
      <ContainerListProduct>
        <FindProductSale
            onClickItem={(item:Product)=>{dispatch(addItemSale({item}))}}
        />
      </ContainerListProduct>
      <LineaVenta edit={edit} />
    </div>
  )
}


const ContainerListProduct = styled.div `
  width: 50%;
  @media only screen and (max-width: 940px) {
    width: 100%;
  }
`