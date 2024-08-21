/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import React, { ChangeEvent, useEffect, useState } from 'react'
import { getUser, setUser } from '@/redux/userSlice';
import { useAppDispatch } from '@/redux/hook';
import { useSelector } from 'react-redux';
import useLocalStorage from '@/hooks/useLocalStorage';
import styled from 'styled-components';
import { useRouter } from 'next/navigation';
import FindProductSale from '@/components/sale/FindProductSale';
import LineaVenta from '@/components/sale/LineaVenta';
import { useResize } from '@/hooks/useResize';
import Confirm from '@/components/Confirm';
import { ExtendItemSale, ItemSale } from '@/interfaces/sale.interface';
import { Product } from '@/interfaces/product.interface';
import { Types } from 'mongoose';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

export default function NewSale() {

    const [valueStorage , setValue] = useLocalStorage("user", "")
    const [newSaleStorage, setValueStorage, clearValue] = useLocalStorage("newSale", "")
    const [lineaVenta, setLineaVenta] = useState<ExtendItemSale[]>([])
    const [total, setTotal] = useState<number>(0)
    const router: AppRouterInstance = useRouter()
    let {ancho, alto} = useResize()
    const [openLVMobile, setOpenLVMobile] = useState<boolean>(false)
    const [cliente, setCliente] = useState<string>('')
    const [openConfirm, setOpenConfirm] = useState<boolean>(false)

    const user = useSelector(getUser)
    const dispatch = useAppDispatch();

    useEffect(() => {
      if (!user && valueStorage) {
        dispatch(setUser(valueStorage))
      }
      if (!valueStorage) {
        router.push('/')
      }
    }, [valueStorage, user, dispatch, router])

  useEffect(()=>{
    if (lineaVenta.length === 0) {
      setTotal(prevData=>0)
      return
    }
    const sum = lineaVenta.reduce(
        (accumulator:number, currentValue: ItemSale) => {
          console.log(accumulator, currentValue.total)
          return accumulator + currentValue.total
        }
        ,
        0,
    );
    setTotal(prevData => parseFloat(sum.toFixed(2)))
  },[lineaVenta])

  useEffect(()=>{
    if (lineaVenta.length !== 0 || cliente !== '' || total !== 0) {
      setValueStorage({lineaVenta:lineaVenta, cliente:cliente, total:total})
      return
    }
    clearValue()
    return
  },[lineaVenta, cliente, total]) 

  useEffect(() => {
    if (newSaleStorage) {
      setOpenConfirm(true)
    }
  }, [])

  return (
    <Container>
      {
        ancho > 940 ?
        <div style={{display: 'flex', flex: 1}}>
          <ContainerListProduct>
            <FindProductSale
              onClickItem={(item:Product)=>{
                setLineaVenta((prevData: ExtendItemSale[])=>{
                    const exist = prevData.find((elem:ExtendItemSale)=>elem._id===item._id)
                    if (exist) {
                        return prevData.map((elem: ExtendItemSale) =>
                            elem._id === item._id ? {...item, cantidad: 1, total: item.precioUnitario} : elem
                        )
                    }
                    return [...prevData, {...item, cantidad: 1, total: item.precioUnitario, idProducto: item._id}]
                })
            } }
            />
          </ContainerListProduct>
          <LineaVenta lineaVenta={lineaVenta} total={total} cliente={cliente} onChangeCliente={(e:ChangeEvent<HTMLInputElement>)=>setCliente((prevData:string)=>e.target.value)}
            onClick={(item:ExtendItemSale)=>setLineaVenta((prevData:ExtendItemSale[])=>prevData.filter((elem:ExtendItemSale)=>elem._id!==item._id))}
            upQTY={(id:string | Types.ObjectId | undefined)=>setLineaVenta((prevData:ExtendItemSale[])=>prevData.map((elem:ExtendItemSale)=>{
              return elem._id===id ? {...elem, cantidad: elem.cantidad+1, total: parseFloat((elem.precioUnitario*(elem.cantidad+1)).toFixed(2))} : elem
            }))}
            downQTY={(id:string | Types.ObjectId | undefined)=>setLineaVenta((prevData:ExtendItemSale[])=>prevData.map((elem:ExtendItemSale)=>{
              if (elem._id===id) {
                if (elem.cantidad-1 > 1 ) {
                  return {...elem, cantidad: elem.cantidad-1, total: parseFloat((elem.precioUnitario*(elem.cantidad-1)).toFixed(2))}
                }
                return {...elem, cantidad: 1, total: elem.precioUnitario}
              }
              return elem
            }))}
            upQTY10={(id:string | Types.ObjectId | undefined)=>setLineaVenta((prevData:ExtendItemSale[])=>prevData.map((elem:ExtendItemSale)=>{
              return elem._id===id ? {...elem, cantidad: elem.cantidad+10, total: parseFloat((elem.precioUnitario*(elem.cantidad+10)).toFixed(2))} : elem
            }))}
            downQTY10={(id:string | Types.ObjectId | undefined)=>setLineaVenta((prevData:ExtendItemSale[])=>prevData.map((elem:ExtendItemSale)=>{
              if (elem._id===id) {
                if (elem.cantidad > 10 ) {
                  return {...elem, cantidad: elem.cantidad-10, total: parseFloat((elem.precioUnitario*(elem.cantidad-10)).toFixed(2))}
                }
                return elem
              }
              return elem
            }))}
          />
        </div>:
        <ContainerMobile>
          <FindProductSale
              onClickItem={(item:Product)=>{
                setLineaVenta((prevData:ExtendItemSale[])=>{
                    const exist = prevData.find((elem:ExtendItemSale)=>elem._id===item._id)
                    if (exist) {
                        return prevData.map((elem: ExtendItemSale) =>
                            elem._id === item._id ? {...item, cantidad: 1, total: item.precioUnitario} : elem
                        )
                    }
                    return [...prevData, {...item, cantidad: 1, total: item.precioUnitario, idProducto: item._id}]
                })
            } }
            />
          <WrapperLineaVenta $openLVMobile={openLVMobile}>
            {
              openLVMobile && 
              <div>
                <LineaVenta lineaVenta={lineaVenta} total={total} cliente={cliente} onChangeCliente={(e:ChangeEvent<HTMLInputElement>)=>setCliente((prevData:string)=>e.target.value)}
                  onClick={(item:ExtendItemSale)=>setLineaVenta((prevData:ExtendItemSale[])=>prevData.filter((elem:ExtendItemSale)=>elem._id!==item._id))}
                  upQTY={(id:string | Types.ObjectId | undefined)=>setLineaVenta((prevData:ExtendItemSale[])=>prevData.map((elem:ExtendItemSale)=>{
                    return elem._id===id ? {...elem, cantidad: elem.cantidad+1, total: parseFloat((elem.precioUnitario*(elem.cantidad+1)).toFixed(2))} : elem
                  }))}
                  downQTY={(id:string | Types.ObjectId | undefined)=>setLineaVenta((prevData:ExtendItemSale[])=>prevData.map((elem:ExtendItemSale)=>{
                    if (elem._id===id) {
                      if (elem.cantidad-1 > 1 ) {
                        return {...elem, cantidad: elem.cantidad-1, total: parseFloat((elem.precioUnitario*(elem.cantidad-1)).toFixed(2))}
                      }
                      return {...elem, cantidad: 1, total: elem.precioUnitario}
                    }
                    return elem
                  }))}
                  upQTY10={(id:string | Types.ObjectId | undefined)=>setLineaVenta((prevData:ExtendItemSale[])=>prevData.map((elem:ExtendItemSale)=>{
                    return elem._id===id ? {...elem, cantidad: elem.cantidad+10, total: parseFloat((elem.precioUnitario*(elem.cantidad+10)).toFixed(2))} : elem
                  }))}
                  downQTY10={(id:string | Types.ObjectId | undefined)=>setLineaVenta((prevData:ExtendItemSale[])=>prevData.map((elem:ExtendItemSale)=>{
                    if (elem._id===id) {
                      if (elem.cantidad > 10 ) {
                        return {...elem, cantidad: elem.cantidad-10, total: parseFloat((elem.precioUnitario*(elem.cantidad-10)).toFixed(2))}
                      }
                      return elem
                    }
                    return elem
                  }))}
                />
              </div>
            }
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}} >
              <h2 style={{fontSize: 18}} > {lineaVenta.length} Productos </h2>
              <h2 style={{fontSize: 18}} >Total: $ {total} </h2>
              <h2 style={{fontSize: 18, color: '#3764A0'}} onClick={()=>setOpenLVMobile(!openLVMobile)} >{openLVMobile ? 'CERRAR':'ABRIR'}</h2>
            </div>
          </WrapperLineaVenta>
        </ContainerMobile>
      }
      {
        openConfirm &&
        <Confirm open={openConfirm} message='Hay elementos en el borrador, ¿Quieres continuar con el borrador?' handleClose={()=>setOpenConfirm(false)} handleConfirm={()=>{
          setLineaVenta((prevData:ExtendItemSale[])=>newSaleStorage.lineaVenta)
          setCliente((prevData:string)=>newSaleStorage.cliente)
          setTotal((prevData:number)=>newSaleStorage.total)
          setOpenConfirm(false)
        }} />
      }
    </Container>
  )
}

const WrapperLineaVenta = styled.div<{$openLVMobile: boolean;}> `
  position: absolute;
  bottom: ${({ $openLVMobile }) => ($openLVMobile ? 'none' : '15px')};
  top: ${({ $openLVMobile }) => ($openLVMobile ? '-25px' : 'none')};
  width: 100%;
  background-color: #F7F7F8;
  border: 1px solid #d9d9d9;
  border-radius: 15px;
  padding: 15px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  min-height: 80%;
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


const Container = styled.div`
  display: flex;
  flex: 1;
  @media only screen and (max-width: 940px) {
    flex-direction: column;
  }
`

const ContainerListLineaVenta = styled.div`
  display: flex;
  flex: 1;
  width: 50%;
  flex-direction: column;
  @media only screen and (max-width: 940px) {
    width: 100%;
  }
`


const ListProduct = styled.ul `
  display: flex;
  flex: 1;
  width: 100%;
  flex-direction: column;
  padding: 0 15px;
  overflow-y: scroll;
`