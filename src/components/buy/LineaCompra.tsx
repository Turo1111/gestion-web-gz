import React, { useState } from 'react'
import styled from 'styled-components'
import ListLineaCompra from './ListLineaCompra'
import InputSelectAdd from '../InputSelectAdd'
import { useAppDispatch, useAppSelector } from '@/redux/hook'
import { getBuy, onChangeProveedor, resetBuy, setItemsBuy } from '@/redux/buySlice'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { AnimatedNumber } from '../AnimatedNumber'
import ButtonUI from '../ButtonUI'
import { setAlert } from '@/redux/alertSlice'
import { setLoading } from '@/redux/loadingSlice'
import apiClient from '@/utils/client'
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { useRouter } from 'next/navigation';
import useLocalStorage from '@/hooks/useLocalStorage'
import ModalAutoGenerate from './ModalAutoGenerate'
import { addHours, endOfDay, format, isSunday, isValid, previousSunday, startOfDay, subDays } from 'date-fns';

export default function LineaCompra() {

    const buy = useAppSelector(getBuy)
    const dispatch = useAppDispatch();
    const [date, setDate] = React.useState<Date>(new Date());
    const router: AppRouterInstance = useRouter()
    const [valueStorage , setValue] = useLocalStorage("user", "")
    const [openAutoGenerate, setOpenAutoGenerate] = useState<boolean>(false)

    const generateAutoBuy = (start: Date, end: Date, isSelectRange: boolean) => {
        start = addHours(startOfDay(start), 3)
        end = addHours(endOfDay(end), 3)
        if (isSelectRange) {
          apiClient.get(`/itemSale/listbuy/${format(start, 'MM-dd-yyyy')}/${format(end, 'MM-dd-yyyy')}/${buy.proveedor}`,{
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
            dispatch(setItemsBuy({itemsBuy: r.data}))
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
        apiClient.get(`/itemSale/listbuyavg/${buy.proveedor}`,{
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
          dispatch(setItemsBuy({itemsBuy: r.data}))
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
    <ContainerListLineaCompra>
        <div style={{display: 'flex', flex: 1, flexDirection: 'column', padding: 15}}>
          <h2 style={{fontSize: 18, color: '#6B7280', textAlign: 'center'}} >CARRITO</h2>
          <div style={{borderBottom: '2px solid #d9d9d9', margin: '15px', borderRadius: '100%'}} ></div>
          <ListLineaCompra/>
        </div>
        <div style={{display: 'flex', justifyContent: 'center', flexDirection: 'column', padding: '0 15px'}}>
            <InputSelectAdd type={'text'} label={'Proveedor'} name={'proveedor'} path={'provider'} 
                value={buy.proveedor} 
                onChange={(id:any, item:any)=>dispatch(onChangeProveedor({proveedor: item.descripcion}))} 
            /> 
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Seleccionar fecha"
                format="dd/MM/yyyy"
                value={date}
                onChange={(newValue) => {
                  if (newValue) {
                    setDate(newValue);
                  }
                }}
              />
            </LocalizationProvider>
            <div style={{display: 'flex', justifyContent: 'space-between', margin:'15px 0'}} >
              <Total><AnimatedNumber value={buy.itemsBuy.length} /> productos </Total>
              <Total>Total: $ <AnimatedNumber value={buy.total} /> </Total>
            </div>
            <div style={{display: 'flex', justifyContent: 'center',  margin: '15px 0'}}>
              <ButtonUI label='VACIAR' onClick={()=>{dispatch(resetBuy({}))}}/>
              <ButtonUI label='AUTO Generar' onClick={()=>{
                if (buy.proveedor === '') {
                  dispatch(setAlert({
                    message: `Primero elige un proveedor`,
                    type: 'warning'
                  }))
                  return
                }
                if (buy.itemsBuy.length > 0) {
                  dispatch(setAlert({
                    message: `Primero quita los productos de la lista`,
                    type: 'warning'
                  }))
                  return
                }
                setOpenAutoGenerate(true)
              }}/>
              <ButtonUI label='Crear' onClick={()=>{
                if (buy.itemsBuy.length===0 || buy.total <= 0) {
                  dispatch(setAlert({
                    message: `No se agregaron productos al carrito`,
                    type: 'warning'
                  }))
                  return
                }
                if (buy.proveedor==='' || buy.proveedor === undefined) {
                  dispatch(setAlert({
                    message: `No se ingreso ningun proveedor`,
                    type: 'warning'
                  }))
                  return
                }
                dispatch(setLoading(true))
                apiClient.post('/buy', {itemsBuy: buy.itemsBuy, proveedor: buy.proveedor, total: buy.total, estado: 'Entregado', createdAt: date},{
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
        {
            openAutoGenerate &&
            <ModalAutoGenerate open={openAutoGenerate} handleClose={()=>setOpenAutoGenerate(false)} handleSubmit={generateAutoBuy} />
        }
    </ContainerListLineaCompra>
  )
}

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
const Total = styled.h2 `
  font-size: 18px;
  color: #6B7280;
  @media only screen and (max-width: 940px) {
    display: none;
  }
`