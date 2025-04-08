import React, { useState } from 'react'
import styled from 'styled-components';
import FindProductSale from '../sale/FindProductSale';
import { Product } from '@/interfaces/product.interface';
import { addItemBuy, getBuy } from '@/redux/buySlice';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import LineaCompra from './LineaCompra';
import { AnimatedNumber } from '../AnimatedNumber';

export default function ContainerBuyMobile({edit}:{edit?: boolean}) {

    const dispatch = useAppDispatch();
    const [openLVMobile, setOpenLVMobile] = useState<boolean>(false)
    const buy = useAppSelector(getBuy)

  return (
    <ContainerMobile>
        <FindProductSale
            onClickItem={(item:Product)=>{dispatch(addItemBuy({item}))}}
        />
        <WrapperLineaVenta $openLVMobile={openLVMobile}>
            {
              openLVMobile && 
              <div style={{display: 'flex', flex: 1}} >
                <LineaCompra edit={edit} />
              </div>
            }
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: `${!openLVMobile ? '0px' : '15px'}`}} >
                <h2 style={{fontSize: 18}} > {buy.itemsBuy.length} Productos </h2>
                <h2 style={{fontSize: 18}} >Total: $ <AnimatedNumber value={buy.total} /> </h2>
                <h2 style={{fontSize: 18, color: '#3764A0', cursor: 'pointer  '}} onClick={()=>setOpenLVMobile(!openLVMobile)} >{openLVMobile ? 'CERRAR':'ABRIR'}</h2>
            </div>
        </WrapperLineaVenta>
    </ContainerMobile>
  )
}


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
const ContainerMobile = styled.div `
  position:relative;
  display: flex;
  flex: 1;
  flex-direction: column;
`