import React, { ChangeEvent, useEffect, useState } from 'react'
import styled from 'styled-components'
import ItemLineaVenta from './ItemLineaVenta'
import apiClient from '@/utils/client';
import { setLoading } from '@/redux/loadingSlice';
import { setAlert } from '@/redux/alertSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import Input from '../Input';
import Button from '../Button';
import { useRouter } from 'next/navigation';
import useLocalStorage from '@/hooks/useLocalStorage';
import { ExtendItemSale, ItemSale } from '@/interfaces/sale.interface';
import { Types } from 'mongoose';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers';
import ButtonUI from '../ButtonUI';
import { BiCart } from 'react-icons/bi';
import { AnimatedNumber } from '../AnimatedNumber';
import { getSale, onChangeClientSale, onChangePrecioUnitarioSale } from '@/redux/saleSlice';
import ListLineaVenta from './ListLineaVenta';

export default function LineaVenta({edit}:{edit?: boolean}) {

    const [date, setDate] = React.useState<Date>(new Date());
    const sale = useAppSelector(getSale)
    const dispatch = useAppDispatch();
    const router: AppRouterInstance = useRouter()
    const [valueStorage , setValue] = useLocalStorage("user", "")

    useEffect(()=>{
      if (sale.createdAt) {
        const newDate = new Date(sale.createdAt)
        setDate(prevData=>newDate)
      }
    }, [sale])

  return (
    <ContainerListLineaVenta>
        <div style={{display: 'flex', flex: 1, flexDirection: 'column', padding: 15}}>
          <h2 style={{fontSize: 18, color: '#6B7280', textAlign: 'center'}} >CARRITO</h2>
          <div style={{borderBottom: '2px solid #d9d9d9', margin: '15px', borderRadius: '100%'}} ></div>
          <ListLineaVenta edit={edit} />
        </div>
        <div style={{padding: '0 15px'}}>
          <Input label='Cliente' name='cliente' value={sale.cliente} onChange={(e:ChangeEvent<HTMLInputElement>)=>dispatch(onChangeClientSale({client: e.target.value}))} type='text' />
          <div style={{display: 'flex', justifyContent: 'space-around'}} >
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
          </div>
            <div style={{display: 'flex', justifyContent: 'space-between', margin:'15px 0'}} >
              <Total><AnimatedNumber value={sale.itemsSale.length} /> productos </Total>
              <Total>Total: $ <AnimatedNumber value={sale.total} /> </Total>
            </div>
            <div style={{display: 'flex', justifyContent: 'center', marginBottom: 15}}>
              <ButtonUI label='Crear' onClick={()=>{
                if (sale.itemsSale.length===0 || sale.total <= 0) {
                  dispatch(setAlert({
                    message: `No se agregaron productos al carrito`,
                    type: 'warning'
                  }))
                  return
                }
                if (sale.cliente==='' || sale.cliente===undefined) {
                  dispatch(setAlert({
                    message: `No se ingreso ningun cliente`,
                    type: 'warning'
                  }))
                  return
                }
                dispatch(setLoading(true))
                !edit? 
                apiClient.post('/sale', {itemsSale: sale.itemsSale, cliente: sale.cliente, total: sale.total, estado: 'Creado', createdAt: date, porcentaje: sale.porcentaje},{
                  headers: {
                    Authorization: `Bearer ${valueStorage.token}` 
                  }
                })
                .then((r)=>{
                  dispatch(setLoading(false))
                  dispatch(setAlert({
                    message: `Venta creada correctamente`,
                    type: 'success'
                  }))
                  router.back()
                })
                .catch((e)=>{
                  console.log(e)
                  dispatch(setLoading(false))
                  dispatch(setAlert({
                  message: `${e.response.data.error}`,
                  type: 'error'
                  }))
                }):
                apiClient.patch(`/sale/${sale._id}`, {itemsSale: sale.itemsSale, cliente: sale.cliente, total: sale.total, estado: 'Modificado', createdAt: sale.createdAt, porcentaje: sale.porcentaje},{
                  headers: {
                    Authorization: `Bearer ${valueStorage.token}` 
                  }
                })
                .then((r)=>{
                  dispatch(setLoading(false))
                  dispatch(setAlert({
                    message: `Venta modificada correctamente`,
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
    </ContainerListLineaVenta>
  )
}

const Total = styled.h2 `
  font-size: 18px;
  color: #6B7280;
  @media only screen and (max-width: 940px) {
    display: none;
  }
`

const ContainerListLineaVenta = styled.div`
  display: flex;
  flex: 1;
  min-width: 50%;
  flex-direction: column;
  @media only screen and (max-width: 940px) {
    width: 100%;
    height: 100%;
  }
`
