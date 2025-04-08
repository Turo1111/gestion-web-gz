import React, { useState } from 'react'
import styled from 'styled-components'
import FindProductSale from './FindProductSale'
import { addItemSale, getSale } from '@/redux/saleSlice';
import { Product } from '@/interfaces/product.interface';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import LineaVenta from './LineaVenta';

export default function ContainerSaleMobile({edit}:{edit?: boolean}) {

    const dispatch = useAppDispatch();
    const [openLVMobile, setOpenLVMobile] = useState<boolean>(false)
    const sale = useAppSelector(getSale)

  return (
    <ContainerMobile>
        <ContainerListProduct>
          <FindProductSale
              onClickItem={(item:Product)=>{dispatch(addItemSale({item}))}}
          />
        </ContainerListProduct>
        <WrapperLineaVenta $openLVMobile={openLVMobile}>
            {
              openLVMobile && 
              <div style={{display: 'flex', flex: 1}} >
                <LineaVenta edit={edit} />
              </div>
            }
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}} >
              <h2 style={{fontSize: 18}} > {sale.itemsSale.length} Productos </h2>
              <h2 style={{fontSize: 18}} >Total: $ {sale.total} </h2>
              <h2 style={{fontSize: 18, color: '#3764A0', cursor: 'pointer'}} onClick={()=>setOpenLVMobile(!openLVMobile)} >{openLVMobile ? 'CERRAR':'ABRIR'}</h2>
            </div>
        </WrapperLineaVenta>
    </ContainerMobile>
  )
}

const ContainerMobile = styled.div `
  position:relative;
  display: flex;
  flex: 1;
  flex-direction: column;
`

const ContainerListProduct = styled.div `
  width: 50%;
  @media only screen and (max-width: 940px) {
    width: 100%;
  }
`

const WrapperLineaVenta = styled.div<{$openLVMobile: boolean;}> `
  position: absolute;
  top: ${({ $openLVMobile }) => ($openLVMobile ? '25px' : '90%')};
  width: 100%;
  background-color: #F7F7F8;
  border: 1px solid #d9d9d9;
  border-radius: 15px;
  padding: 15px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  height: ${({ $openLVMobile }) => ($openLVMobile ? '85%' : 'auto')};
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
`