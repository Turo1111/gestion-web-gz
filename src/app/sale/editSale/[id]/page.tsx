/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import React, { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react'
import Search from '../../../../components/Search';
import { io } from 'socket.io-client';
import apiClient from '@/utils/client';
import { getUser, setUser } from '@/redux/userSlice';
import { useAppDispatch } from '@/redux/hook';
import { useSelector } from 'react-redux';
import useLocalStorage from '@/hooks/useLocalStorage';
import styled from 'styled-components';
import ItemsProducts from '@/components/products/ItemsProducts';
import Input from '@/components/Input';
import ItemLineaVenta from '@/components/sale/ItemLineaVenta';
import Button from '@/components/Button';
import { useRouter } from 'next/navigation';
import { getLoading, setLoading } from '@/redux/loadingSlice';
import { setAlert } from '@/redux/alertSlice';
import FindProductSale from '@/components/sale/FindProductSale';
import LineaVenta from '@/components/sale/LineaVenta';
import { useResize } from '@/hooks/useResize';
import { ExtendItemSale, ItemSale, Sale } from '@/interfaces/sale.interface';
import { Product } from '@/interfaces/product.interface';
import { Types } from 'mongoose';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import Confirm from '@/components/Confirm';

interface ResponseSale {
  r: Sale
  itemsSale: ExtendItemSale[]
}

export default function EditSale({ params }: { params: { id: string } }) {

    const [valueStorage , setValue] = useLocalStorage("user", "")
    const [lineaVenta, setLineaVenta] = useState<ExtendItemSale[]>([])
    const [total, setTotal] = useState<number>(0)
    const router: AppRouterInstance = useRouter()
    let {ancho, alto} = useResize()
    const [openLVMobile, setOpenLVMobile] = useState<boolean>(false)
    const { id } = params;
    const [cliente, setCliente] = useState<string>('')
    const [openConfirm, setOpenConfirm] = useState<boolean>(false)
    const [porcentaje, setPorcentaje] = useState<number>(0)
    const [date, setDate] = React.useState<Date>(new Date());

    const user = useSelector(getUser)
    const dispatch = useAppDispatch();

    const getSale = () => {
      dispatch(setLoading(true))
      apiClient.get(`/sale/${id}`,{
        headers: {
            Authorization: `Bearer ${valueStorage.token}`
        },
      })
      .then(({data}:{data: ResponseSale})=>{
        dispatch(setLoading(false));
        setLineaVenta((prevData)=>data.itemsSale)
        setTotal(data.r.total)
        setCliente(data.r.cliente)
        setDate(new Date(data.r.createdAt))
        setPorcentaje((_: number)=>data.r.porcentaje !== undefined ? data.r.porcentaje : 0)
      })
      .catch((e)=>{
        console.log(e);
        dispatch(setLoading(false))
      })
    }

    useEffect(()=>{
      if (lineaVenta.length === 0) {
        setTotal(_prevData=>0)
        return
      }
      const sum = lineaVenta.reduce(
          (accumulator:number, currentValue: ItemSale) => {
            let suma = accumulator + currentValue.total
            if (porcentaje > 0) {
              return (suma + (suma * (porcentaje/100)))
            }
            return suma
          }
          ,
          0,
      );
      setTotal(_prevData => parseFloat(sum.toFixed(2)))
    },[lineaVenta, porcentaje])

  useEffect(()=> {
    getSale()
  },[id, valueStorage, openConfirm])

  return (
    <Container>
      {
        ancho > 940 ?
        <div style={{display: 'flex', flex: 1}}>
          <ContainerListProduct>
            <FindProductSale
              onClickItem={(item:Product)=>{
                setLineaVenta((prevData:ExtendItemSale[])=>{
                  /* if (prevData._id === undefined) {
                    return
                  } */
                    const exist = prevData.find((elem:ExtendItemSale)=>elem._id===item._id || elem.idProducto===item._id)
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
          <LineaVenta dateEdit={date} lineaVenta={lineaVenta} total={total} cliente={cliente} onChangeCliente={(e:ChangeEvent<HTMLInputElement>)=>setCliente((prevData:string)=>e.target.value)} 
            edit={true} id={id}
            porcentaje={porcentaje} onChangePorcentaje={(e:ChangeEvent<HTMLInputElement>)=>setPorcentaje((_:number)=> parseFloat(e.target.value) >= 0 ? parseFloat(e.target.value) : 0)}
            onClick={(item:ExtendItemSale)=>{
              
              if (id) {
                dispatch(setLoading(true));
                apiClient.patch(`/itemSale/${item._id}`, {estado: false},{
                  headers: {
                      Authorization: `Bearer ${valueStorage.token}`
                  },
                })
                .then((r)=>{
                  dispatch(setLoading(false));
                  setLineaVenta((prevData:ExtendItemSale[])=>prevData.filter((elem:ExtendItemSale)=>elem._id!==item._id))
                })
                .catch((e)=>{
                  dispatch(setLoading(false))
                })
              }
            }}
            onChangePrecioUnitario={(value:string, idProduct: any)=>{
              let parseValue = parseFloat(value)
              if (value === '') {
                parseValue = 0
              }
              setLineaVenta((prevData:ExtendItemSale[])=>{
                const itemSale = prevData.find(elem=>elem._id === idProduct)
                if(!itemSale){
                  return prevData
                }
                const newItemSale = {...itemSale, precioUnitario: parseValue, total: itemSale?.cantidad*parseValue}
                const prevFiltered = prevData.map((elem:ExtendItemSale)=>elem._id===idProduct ? newItemSale : elem)
                return prevFiltered
              })
            }}
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
                    const exist = prevData.find((elem:ExtendItemSale)=>elem._id===item._id || elem.idProducto===item._id)
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
                <LineaVenta dateEdit={date} lineaVenta={lineaVenta} total={total} cliente={cliente} onChangeCliente={(e:ChangeEvent<HTMLInputElement>)=>setCliente((prevData:string)=>e.target.value)} 
                  edit={true} id={id}
                  porcentaje={porcentaje} onChangePorcentaje={(e:ChangeEvent<HTMLInputElement>)=>setPorcentaje((_:number)=> parseFloat(e.target.value) >= 0 ? parseFloat(e.target.value) : 0)}
                  onClick={(item:ExtendItemSale)=>{
                    
                    if (id) {
                      dispatch(setLoading(true));
                      apiClient.patch(`/itemSale/${item._id}`, {estado: false},{
                        headers: {
                            Authorization: `Bearer ${valueStorage.token}`
                        },
                      })
                      .then((r)=>{
                        dispatch(setLoading(false));
                        setLineaVenta((prevData:ExtendItemSale[])=>prevData.filter((elem:ExtendItemSale)=>elem._id!==item._id))
                      })
                      .catch((e)=>{
                        dispatch(setLoading(false))
                      })
                    }
                  }}
                  onChangePrecioUnitario={(value:string, idProduct: any)=>{
                    let parseValue = parseFloat(value)
                    if (value === '') {
                      parseValue = 0
                    }
                    setLineaVenta((prevData:ExtendItemSale[])=>{
                      const itemSale = prevData.find(elem=>elem._id === idProduct)
                      if(!itemSale){
                        return prevData
                      }
                      const newItemSale = {...itemSale, precioUnitario: parseValue, total: itemSale?.cantidad*parseValue}
                      const prevFiltered = prevData.map((elem:ExtendItemSale)=>elem._id===idProduct ? newItemSale : elem)
                      return prevFiltered
                    })
                  }}
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
    </Container>
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