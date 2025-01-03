/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import React, { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react'
import Search from '../../../components/Search';
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
import { useResize } from '@/hooks/useResize';
import { ExtendItemBuy, ItemBuy } from '@/interfaces/buy.interface';
import { Product } from '@/interfaces/product.interface';
import { Types } from 'mongoose';
import Confirm from '@/components/Confirm';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import AddBuyItem from '@/components/buy/AddBuyItem';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

export default function NewBuy() {

    const [valueStorage , setValue] = useLocalStorage("user", "")
    const [lineaCompra, setLineaCompra] = useState<ExtendItemBuy[]>([])
    const [proveedor, setProveedor] = useState<string>('')
    const [total, setTotal] = useState<number>(0)
    const router: AppRouterInstance = useRouter()
    let {ancho, alto} = useResize()
    const [openLVMobile, setOpenLVMobile] = useState<boolean>(false)
    const [openConfirm, setOpenConfirm] = useState<boolean>(false)
    const [openAddProduct, setOpenAddProduct] = useState<boolean>(false)
    const [productSelected, setProductSelected] = useState<Product | undefined>(undefined)

    const user = useSelector(getUser)
    const dispatch = useAppDispatch();

    const [date, setDate] = React.useState<Date>(new Date());

    useEffect(()=>{
      if (lineaCompra.length === 0) {
        setTotal(prevData=>0)
        return
      }
      const sum = lineaCompra.reduce(
          (accumulator:number, currentValue: ExtendItemBuy) => {
            return accumulator + currentValue.total
          }
          ,
          0,
      );
      setTotal(prevData => parseFloat(sum.toFixed(2)))
    },[lineaCompra])


  return (
    <Container>
      {
        ancho > 940 ?
        <div style={{display: 'flex', flex: 1}}>

          <ContainerListProduct>
            <FindProductSale
              onClickItem={(item:Product)=>{
                setProductSelected(item)
                setOpenAddProduct(true)
              } }
            />
          </ContainerListProduct>
          <ContainerListLineaCompra>
              <div style={{display: 'flex', flex: 1, flexDirection: 'column', padding: 15}}>
                  <h2 style={{fontSize: 18}} >Linea de Compra</h2>
                  <ListProduct style={{ display: 'flex', flexDirection: 'column', padding: 15, maxHeight: '65vh'}}>
                      { 
                          lineaCompra.length === 0 ? 'No se selecciono productos' :
                          lineaCompra.map((item:ExtendItemBuy, index:number)=><ItemLineaVenta key={index} elem={item}  
                              onClick={()=>
                                setLineaCompra((prevData:ExtendItemBuy[])=>prevData.filter((elem:ExtendItemBuy)=>{
                                  console.log(elem, item)
                                  return elem.idProducto!==item.idProducto
                                }))
                              }
                              upQTY={(id:string | Types.ObjectId | undefined)=>setLineaCompra((prevData:ExtendItemBuy[])=>prevData.map((elem:ExtendItemBuy)=>{
                                return elem._id===id ? {...elem, cantidad: elem.cantidad+1, total: parseFloat((elem.precio*(elem.cantidad+1)).toFixed(2))} : elem
                              }))}
                              downQTY={(id:string | Types.ObjectId | undefined)=>setLineaCompra((prevData:ExtendItemBuy[])=>prevData.map((elem:ExtendItemBuy)=>{
                                if (elem._id===id) {
                                  if (elem.cantidad-1 > 1 ) {
                                    return {...elem, cantidad: elem.cantidad-1, total: parseFloat((elem.precio*(elem.cantidad-1)).toFixed(2))}
                                  }
                                  return {...elem, cantidad: 1, total: elem.precio}
                                }
                                return elem
                              }))}
                              upQTY10={(id:string | Types.ObjectId | undefined)=>setLineaCompra((prevData:ExtendItemBuy[])=>prevData.map((elem:ExtendItemBuy)=>{
                                return elem._id===id ? {...elem, cantidad: elem.cantidad+10, total: parseFloat((elem.precio*(elem.cantidad+10)).toFixed(2))} : elem
                              }))}
                              downQTY10={(id:string | Types.ObjectId | undefined)=>setLineaCompra((prevData:ExtendItemBuy[])=>prevData.map((elem:ExtendItemBuy)=>{
                                if (elem._id===id) {
                                  if (elem.cantidad > 10 ) {
                                    return {...elem, cantidad: elem.cantidad-10, total: parseFloat((elem.precio*(elem.cantidad-10)).toFixed(2))}
                                  }
                                  return elem
                                }
                                return elem
                              }))}
                          />)
                      }
                  </ListProduct>
              </div>
              <div style={{height: '30%', padding: '0 15px'}}>
                  <Input label='Proveedor' name='proveedor' value={proveedor} onChange={(e:ChangeEvent<HTMLInputElement>)=>setProveedor(e.target.value)} type='text' />
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="Seleccionar fecha"
                      value={date}
                      onChange={(newValue) => {
                        if (newValue) {
                          setDate(newValue);
                        }
                      }}
                    />
                  </LocalizationProvider>
                  <h2 style={{fontSize: 18}} >Total: $ {total} </h2>
                  <Button text='Crear' onClick={()=>{
                    if (lineaCompra.length===0 || total <= 0) {
                      dispatch(setAlert({
                        message: `No se agregaron productos al carrito`,
                        type: 'warning'
                      }))
                      return
                    }
                    if (proveedor==='' || proveedor === undefined) {
                      dispatch(setAlert({
                        message: `No se ingreso ningun proveedor`,
                        type: 'warning'
                      }))
                      return
                    }
                    dispatch(setLoading(true))
                    apiClient.post('/buy', {itemsBuy: lineaCompra, proveedor: proveedor, total: total, estado: 'Entregado', createdAt: date},{
                      headers: {
                        Authorization: `Bearer ${valueStorage.token}` 
                      }
                    })
                    .then((r)=>{
                      dispatch(setLoading(false))
                      dispatch(setAlert({
                        message: `Compra creada correctamente`,
                        type: 'success'
                      }))
                      router.back()
                    })
                    .catch((e)=>{
                      console.log(e.response)
                      dispatch(setLoading(false))
                      dispatch(setAlert({
                      message: `${e.response.data.error}`,
                      type: 'error'
                      }))
                    })
                  }} />
              </div>
          </ContainerListLineaCompra>
        </div>
        :
        <ContainerMobile>
          <FindProductSale
              onClickItem={(item:Product)=>{
                setProductSelected(item)
                setOpenAddProduct(true)
              } }
            />
          <WrapperLineaVenta $openLVMobile={openLVMobile}>
            {
              openLVMobile && 
              <ContainerListLineaCompra>
              <div style={{display: 'flex', flex: 1, flexDirection: 'column', padding: 15}}>
                  <h2 style={{fontSize: 18}} >Linea de Compra</h2>
                  <ListProduct style={{ display: 'flex', flexDirection: 'column', padding: 15, maxHeight: '65vh'}}>
                      { 
                          lineaCompra.length === 0 ? 'No se selecciono productos' :
                          lineaCompra.map((item:ExtendItemBuy, index:number)=><ItemLineaVenta key={index} elem={item}  
                              onClick={()=>
                                setLineaCompra((prevData:ExtendItemBuy[])=>prevData.filter((elem:ExtendItemBuy)=>elem.idProducto!==item.idProducto))
                              }
                              upQTY={(id:string | Types.ObjectId | undefined)=>setLineaCompra((prevData:ExtendItemBuy[])=>prevData.map((elem:ExtendItemBuy)=>{
                                return elem._id===id ? {...elem, cantidad: elem.cantidad+1, total: parseFloat((elem.precio*(elem.cantidad+1)).toFixed(2))} : elem
                              }))}
                              downQTY={(id:string | Types.ObjectId | undefined)=>setLineaCompra((prevData:ExtendItemBuy[])=>prevData.map((elem:ExtendItemBuy)=>{
                                if (elem._id===id) {
                                  if (elem.cantidad-1 > 1 ) {
                                    return {...elem, cantidad: elem.cantidad-1, total: parseFloat((elem.precio*(elem.cantidad-1)).toFixed(2))}
                                  }
                                  return {...elem, cantidad: 1, total: elem.precio}
                                }
                                return elem
                              }))}
                              upQTY10={(id:string | Types.ObjectId | undefined)=>setLineaCompra((prevData:ExtendItemBuy[])=>prevData.map((elem:ExtendItemBuy)=>{
                                return elem._id===id ? {...elem, cantidad: elem.cantidad+10, total: parseFloat((elem.precio*(elem.cantidad+10)).toFixed(2))} : elem
                              }))}
                              downQTY10={(id:string | Types.ObjectId | undefined)=>setLineaCompra((prevData:ExtendItemBuy[])=>prevData.map((elem:ExtendItemBuy)=>{
                                if (elem._id===id) {
                                  if (elem.cantidad > 10 ) {
                                    return {...elem, cantidad: elem.cantidad-10, total: parseFloat((elem.precio*(elem.cantidad-10)).toFixed(2))}
                                  }
                                  return elem
                                }
                                return elem
                              }))}
                          />)
                      }
                  </ListProduct>
              </div>
              <div style={{height: '30%', padding: '0 15px'}}>
                  <Input label='Proveedor' name='proveedor' value={proveedor} onChange={(e:ChangeEvent<HTMLInputElement>)=>setProveedor(e.target.value)} type='text' />
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="Seleccionar fecha"
                      value={date}
                      onChange={(newValue) => {
                        if (newValue) {
                          setDate(newValue);
                        }
                      }}
                    />
                  </LocalizationProvider>
                  <h2 style={{fontSize: 18}} >Total: $ {total} </h2>
                  <Button text='Crear' onClick={()=>{
                    if (lineaCompra.length===0 || total <= 0) {
                      dispatch(setAlert({
                        message: `No se agregaron productos al carrito`,
                        type: 'warning'
                      }))
                      return
                    }
                    if (proveedor==='' || proveedor === undefined) {
                      dispatch(setAlert({
                        message: `No se ingreso ningun proveedor`,
                        type: 'warning'
                      }))
                      return
                    }
                    dispatch(setLoading(true))
                    apiClient.post('/buy', {itemsBuy: lineaCompra, proveedor: proveedor, total: total, estado: 'Entregado', createdAt: date},{
                      headers: {
                        Authorization: `Bearer ${valueStorage.token}` 
                      }
                    })
                    .then((r)=>{
                      dispatch(setLoading(false))
                      dispatch(setAlert({
                        message: `Compra creada correctamente`,
                        type: 'success'
                      }))
                      router.back()
                    })
                    .catch((e)=>{
                      console.log(e.response)
                      dispatch(setLoading(false))
                      dispatch(setAlert({
                      message: `${e.response.data.error}`,
                      type: 'error'
                      }))
                    })
                  }} />
              </div>
          </ContainerListLineaCompra>
            }
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}} >
              <h2 style={{fontSize: 18}} > {lineaCompra.length} Productos </h2>
              <h2 style={{fontSize: 18}} >Total: $ {total} </h2>
              <h2 style={{fontSize: 18, color: '#3764A0'}} onClick={()=>setOpenLVMobile(!openLVMobile)} >{openLVMobile ? 'CERRAR':'ABRIR'}</h2>
            </div>
          </WrapperLineaVenta>
        </ContainerMobile>
      }
      {
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

const ContainerListLineaCompra = styled.div`
  display: flex;
  flex: 1;
  width: 50%;
  flex-direction: column;
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
  min-height: 60vh;
`
