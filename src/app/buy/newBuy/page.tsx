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
import { AnimatedNumber } from '@/components/AnimatedNumber';
import ButtonUI from '@/components/ButtonUI';
import { addHours, endOfDay, format, isSunday, isValid, previousSunday, startOfDay, subDays } from 'date-fns';
import InputSelectAdd from '@/components/InputSelectAdd';
import ModalAutoGenerate from '@/components/buy/ModalAutoGenerate';

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
    const [openAutoGenerate, setOpenAutoGenerate] = useState<boolean>(false)

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
      console.log(lineaCompra)
    },[lineaCompra])

    const generateAutoBuy = (start: Date, end: Date, isSelectRange: boolean) => {
      start = addHours(startOfDay(start), 3)
      end = addHours(endOfDay(end), 3)
      if (isSelectRange) {
        apiClient.get(`/itemSale/listbuy/${format(start, 'MM-dd-yyyy')}/${format(end, 'MM-dd-yyyy')}/${proveedor}`,{
          headers: {
            Authorization: `Bearer ${valueStorage.token}` 
          }
        })
        .then((r)=>{
          dispatch(setLoading(false))
          dispatch(setAlert({
            message: `Generado correctamente`,
            type: 'success'
          }))
          console.log(r)
          setLineaCompra(prevData=>r.data)
          setOpenAutoGenerate(false)
        })
        .catch((e)=>{
          console.log(e.response)
          dispatch(setLoading(false))
          dispatch(setAlert({
          message: `${e.response.data.error}`,
          type: 'error'
          }))
        })
        return
      }
      apiClient.get(`/itemSale/listbuyavg/${proveedor}`,{
        headers: {
          Authorization: `Bearer ${valueStorage.token}` 
        }
      })
      .then((r)=>{
        dispatch(setLoading(false))
        dispatch(setAlert({
          message: `Generado correctamente`,
          type: 'success'
        }))
        console.log(r)
        setLineaCompra(prevData=>r.data)
        setOpenAutoGenerate(false)
      })
      .catch((e)=>{
        console.log(e.response)
        dispatch(setLoading(false))
        dispatch(setAlert({
        message: `${e.response.data.error}`,
        type: 'error'
        }))
      })
      return
    }

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
                <h2 style={{fontSize: 18, color: '#6B7280', marginTop: 15, textAlign: 'center'}} >CARRITO</h2>
                <div style={{borderBottom: '2px solid #d9d9d9', margin: '15px', borderRadius: '100%'}} ></div>
                  <ListProduct>
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
                                console.log("aca",elem)
                                return elem.idProducto===id ? {...elem, cantidad: elem.cantidad+1, total: parseFloat((elem.precio*(elem.cantidad+1)).toFixed(2))} : elem
                              }))}
                              downQTY={(id:string | Types.ObjectId | undefined)=>setLineaCompra((prevData:ExtendItemBuy[])=>prevData.map((elem:ExtendItemBuy)=>{
                                if (elem.idProducto===id) {
                                  if (elem.cantidad-1 > 1 ) {
                                    return {...elem, cantidad: elem.cantidad-1, total: parseFloat((elem.precio*(elem.cantidad-1)).toFixed(2))}
                                  }
                                  return {...elem, cantidad: 1, total: elem.precio}
                                }
                                return elem
                              }))}
                              upQTY10={(id:string | Types.ObjectId | undefined)=>setLineaCompra((prevData:ExtendItemBuy[])=>prevData.map((elem:ExtendItemBuy)=>{
                                return elem.idProducto===id ? {...elem, cantidad: elem.cantidad+10, total: parseFloat((elem.precio*(elem.cantidad+10)).toFixed(2))} : elem
                              }))}
                              downQTY10={(id:string | Types.ObjectId | undefined)=>setLineaCompra((prevData:ExtendItemBuy[])=>prevData.map((elem:ExtendItemBuy)=>{
                                if (elem.idProducto===id) {
                                  if (elem.cantidad > 10 ) {
                                    return {...elem, cantidad: elem.cantidad-10, total: parseFloat((elem.precio*(elem.cantidad-10)).toFixed(2))}
                                  }
                                  return elem
                                }
                                return elem
                              }))}
                              onChangePrecioUnitario={(value:string, idProduct: any)=>{
                                let parseValue = parseFloat(value)
                                if (value === '') {
                                  parseValue = 0
                                }
                                setLineaCompra((prevData:ExtendItemBuy[])=>{
                                  const itemSale = prevData.find(elem=>elem.idProducto === idProduct)
                                  if(!itemSale){
                                    return prevData
                                  }
                                  const newItemSale = {...itemSale, precioUnitario: parseValue, total: itemSale?.cantidad*parseValue}
                                  const prevFiltered = prevData.map((elem:ExtendItemBuy)=>elem.idProducto===idProduct ? newItemSale : elem)
                                  return prevFiltered
                                })
                              }}
                          />)
                      }
                  </ListProduct>
              </div>
              <div style={{display: 'flex', justifyContent: 'center', flexDirection: 'column', padding: '0 15px'}}>
                  {/* <Input label='Proveedor' name='proveedor' value={proveedor} onChange={(e:ChangeEvent<HTMLInputElement>)=>setProveedor(e.target.value)} type='text' /> */}
                  <InputSelectAdd type={'text'} label={'Proveedor'} name={'proveedor'} path={'provider'} value={proveedor} onChange={(id:any, item:any)=>{
                    setProveedor(item.descripcion)
                  }} /> 
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
                  <div style={{display: 'flex', justifyContent: 'space-between', margin:'15px 0'}} >
                    <Total><AnimatedNumber value={lineaCompra.length} /> productos </Total>
                    <Total>Total: $ <AnimatedNumber value={total} /> </Total>
                  </div>
                  <div style={{display: 'flex', justifyContent: 'center',  margin: '15px 0'}}>
                    <ButtonUI label='AUTO Generar' onClick={()=>{
                      if (proveedor === '') {
                        dispatch(setAlert({
                          message: `Primero elige un proveedor`,
                          type: 'warning'
                        }))
                        return
                      }
                      if (lineaCompra.length > 0) {
                        dispatch(setAlert({
                          message: `Primero quita los productos de la lista`,
                          type: 'warning'
                        }))
                        return
                      }
                      setOpenAutoGenerate(true)
                    }}/>
                    <ButtonUI label='Crear' onClick={()=>{
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
                <h2 style={{fontSize: 18, color: '#6B7280', marginTop: 15, textAlign: 'center'}} >CARRITO</h2>
                <div style={{borderBottom: '2px solid #d9d9d9', margin: '15px', borderRadius: '100%'}} ></div>
                  <ListProduct>
                      { 
                          lineaCompra.length === 0 ? 'No se selecciono productos' :
                          lineaCompra.map((item:ExtendItemBuy, index:number)=><ItemLineaVenta key={index} elem={item}  
                              onClick={()=>
                                setLineaCompra((prevData:ExtendItemBuy[])=>prevData.filter((elem:ExtendItemBuy)=>elem.idProducto!==item.idProducto))
                              }
                              upQTY={(id:string | Types.ObjectId | undefined)=>setLineaCompra((prevData:ExtendItemBuy[])=>prevData.map((elem:ExtendItemBuy)=>{
                                return elem.idProducto===id ? {...elem, cantidad: elem.cantidad+1, total: parseFloat((elem.precio*(elem.cantidad+1)).toFixed(2))} : elem
                              }))}
                              downQTY={(id:string | Types.ObjectId | undefined)=>setLineaCompra((prevData:ExtendItemBuy[])=>prevData.map((elem:ExtendItemBuy)=>{
                                if (elem.idProducto===id) {
                                  if (elem.cantidad-1 > 1 ) {
                                    return {...elem, cantidad: elem.cantidad-1, total: parseFloat((elem.precio*(elem.cantidad-1)).toFixed(2))}
                                  }
                                  return {...elem, cantidad: 1, total: elem.precio}
                                }
                                return elem
                              }))}
                              upQTY10={(id:string | Types.ObjectId | undefined)=>setLineaCompra((prevData:ExtendItemBuy[])=>prevData.map((elem:ExtendItemBuy)=>{
                                return elem.idProducto===id ? {...elem, cantidad: elem.cantidad+10, total: parseFloat((elem.precio*(elem.cantidad+10)).toFixed(2))} : elem
                              }))}
                              downQTY10={(id:string | Types.ObjectId | undefined)=>setLineaCompra((prevData:ExtendItemBuy[])=>prevData.map((elem:ExtendItemBuy)=>{
                                if (elem.idProducto===id) {
                                  if (elem.cantidad > 10 ) {
                                    return {...elem, cantidad: elem.cantidad-10, total: parseFloat((elem.precio*(elem.cantidad-10)).toFixed(2))}
                                  }
                                  return elem
                                }
                                return elem
                              }))}
                              onChangePrecioUnitario={(value:string, idProduct: any)=>{
                                let parseValue = parseFloat(value)
                                if (value === '') {
                                  parseValue = 0
                                }
                                setLineaCompra((prevData:ExtendItemBuy[])=>{
                                  const itemSale = prevData.find(elem=>elem.idProducto === idProduct)
                                  if(!itemSale){
                                    return prevData
                                  }
                                  const newItemSale = {...itemSale, precioUnitario: parseValue, total: itemSale?.cantidad*parseValue}
                                  const prevFiltered = prevData.map((elem:ExtendItemBuy)=>elem.idProducto===idProduct ? newItemSale : elem)
                                  return prevFiltered
                                })
                              }}
                          />)
                      }
                  </ListProduct>
              </div>
              <div style={{display: 'flex', justifyContent: 'center', flexDirection: 'column', padding: '0 15px'}}>
                  <InputSelectAdd type={'text'} label={'Proveedor'} name={'proveedor'} path={'provider'} value={proveedor} onChange={(id:any, item:any)=>{
                    setProveedor(item.descripcion)
                  }} /> 
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
                  <div style={{display: 'flex', justifyContent: 'center',  margin: '15px 0'}}>
                  <ButtonUI label='AUTO Generar' onClick={()=>{
                      if (proveedor === '') {
                        dispatch(setAlert({
                          message: `Primero elige un proveedor`,
                          type: 'warning'
                        }))
                        return
                      }
                      if (lineaCompra.length > 0) {
                        dispatch(setAlert({
                          message: `Primero quita los productos de la lista`,
                          type: 'warning'
                        }))
                        return
                      }
                      setOpenAutoGenerate(true)
                    }}/>
                    <ButtonUI label='Crear' onClick={()=>{
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
              </div>
          </ContainerListLineaCompra>
            }
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: `${!openLVMobile ? '0px' : '15px'}`}} >
              <h2 style={{fontSize: 18}} > {lineaCompra.length} Productos </h2>
              <h2 style={{fontSize: 18}} >Total: $ <AnimatedNumber value={total} /> </h2>
              <h2 style={{fontSize: 18, color: '#3764A0', cursor: 'pointer  '}} onClick={()=>setOpenLVMobile(!openLVMobile)} >{openLVMobile ? 'CERRAR':'ABRIR'}</h2>
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
      {
        openAutoGenerate &&
        <ModalAutoGenerate open={openAutoGenerate} handleClose={()=>setOpenAutoGenerate(false)} handleSubmit={generateAutoBuy} />
      }
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
  height: ${({ $openLVMobile }) => ($openLVMobile ? '95%' : '6%')};
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
  max-height: 60vh;
  @media only screen and (max-width: 500px) {
    padding: 0;
    max-height: 40vh;
  }
`
