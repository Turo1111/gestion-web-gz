/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import ContainerBuyMobile from '@/components/buy/ContainerBuyMobile'
import ContainerBuyWeb from '@/components/buy/ContainerBuyWeb'
import useLocalStorage from '@/hooks/useLocalStorage'
import { useResize } from '@/hooks/useResize'
import { Buy, ItemBuy } from '@/interfaces/buy.interface'
import { setBuy } from '@/redux/buySlice'
import { useAppDispatch } from '@/redux/hook'
import { setLoading } from '@/redux/loadingSlice'
import { getUser } from '@/redux/userSlice'
import apiClient from '@/utils/client'
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

interface ResponseBuy {
  r: Buy
  itemsBuy: ItemBuy[]
}

export default function EditBuy({ params }: { params: { id: string } }) {
  
  const [valueStorage , setValue] = useLocalStorage("user", "")
  const router: AppRouterInstance = useRouter()
  let {ancho, alto} = useResize()
  const { id } = params;

  const user = useSelector(getUser)
  const dispatch = useAppDispatch();


  useEffect(()=>{
    const getBuy = () => {
      dispatch(setLoading(true))
      apiClient.get(`/buy/${id}`,{
        headers: {
            Authorization: `Bearer ${valueStorage.token}`
        },
      })
      .then(({data}:{data: ResponseBuy})=>{
        dispatch(setLoading(false));
        console.log(data)
        dispatch(setBuy({buy: {_id: id, proveedor: data.r.proveedor, createdAt: data.r.createdAt, estado: data.r.estado, total: data.r.total, itemsBuy: data.itemsBuy}}))
      })
      .catch((e)=>{
        console.log(e);
        dispatch(setLoading(false))
      })
    }
    if (id) {
      getBuy()
    }
  },[id])


return (
  <Container>
    {
      ancho > 940 ?
      <ContainerBuyWeb edit={true}/>
      :
      <ContainerBuyMobile edit={true}/>
    }
    {/* {
      (openAddProduct && productSelected) &&
      <AddBuyItem open={openAddProduct} handleClose={()=>setOpenAddProduct(false)} item={productSelected}
        onClickItem={(item:ExtendItemBuy)=>{
          setLineaCompra((prevData:ExtendItemBuy[])=>{
              const exist = prevData.find((elem:ExtendItemBuy)=>elem.idProducto===item.idProducto)
              if (exist) {
                  return prevData.map((elem: ExtendItemBuy) =>
                      elem.idProducto === item.idProducto ? item : elem
                  )
              }
              return [...prevData, item]
          })
          setOpenAddProduct(false)
        } }
      />
    } */}
  </Container>
  )
}

const Total = styled.h2 `
  font-size: 18px;
  color: #6B7280;
  @media only screen and (max-width: 940px) {
    display: none;
  }
`

const WrapperLineaVenta = styled.div<{$openLVMobile: boolean;}> `
   position: absolute;
  top: ${({ $openLVMobile }) => ($openLVMobile ? '5px' : '85%')};
  width: 100%;
  background-color: #F7F7F8;
  border: 1px solid #d9d9d9;
  border-radius: 15px;
  padding: 15px;
  height: 95%;
  padding: ${({ $openLVMobile }) => ($openLVMobile ? '0px' : '15px')};
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  transition: top .9s cubic-bezier(0.075, 0.82, 0.165, 1);
`

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

const ContainerListLineaCompra = styled.div`
  display: flex;
  flex: 1;
  width: 50%;
  flex-direction: column;
  @media only screen and (max-width: 940px) {
    width: 100%;
    height: 90%;
  }
`

const Container = styled.div`
  display: flex;
  flex: 1;
  @media only screen and (max-width: 940px) {
    flex-direction: column;
  }
`
const ListProduct1 = styled.ul `
  display: flex;
  flex: 1;
  width: 100%;
  flex-direction: column;
  padding: 0 15px;
  overflow-y: scroll;
  max-height: 82vh;
  @media only screen and (max-width: 940px) {
    max-height: 55vh;
  }
`

const ListProduct = styled.ul `
  display: flex;
  flex: 1;
  width: 100%;
  flex-direction: column;
  padding: 0 15px;
  overflow-y: scroll;
  max-height: 50vh;
  @media only screen and (max-width: 500px) {
    padding: 0;
    max-height: 40vh;
  }
`