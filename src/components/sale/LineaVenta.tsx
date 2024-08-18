import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import ItemLineaVenta from './ItemLineaVenta'
import apiClient from '@/utils/client';
import { setLoading } from '@/redux/loadingSlice';
import { setAlert } from '@/redux/alertSlice';
import { useAppDispatch } from '@/redux/hook';
import Input from '../Input';
import Button from '../Button';
import { useRouter } from 'next/navigation';
import useLocalStorage from '@/hooks/useLocalStorage';

export default function LineaVenta({lineaVenta, onClick, upQTY, downQTY, upQTY10, downQTY10, total, edit=false, id, cliente, onChangeCliente}:
  {lineaVenta:any, onClick:any, upQTY:any, downQTY: any, upQTY10:any, downQTY10:any, total:any, edit?:boolean, id?:string, cliente?:any, onChangeCliente?:any}
) {

    const dispatch = useAppDispatch();
    const router = useRouter()
    /* const [cliente, setCliente] = useState<any>('') */
    const [valueStorage , setValue] = useLocalStorage("user", "")
    const [clearValue] = useLocalStorage("newSale", "")

    /* useEffect(()=>{c !== '' && onChangeCliente(c)},[c]) */

  return (
    <ContainerListLineaVenta>
        <div style={{display: 'flex', flex: 1, flexDirection: 'column', padding: 15}}>
            <h2 style={{fontSize: 18}} >Linea de Venta</h2>
            <ListProduct style={{ display: 'flex', flexDirection: 'column', padding: 15}}>
                { 
                    lineaVenta.length === 0 ? 'No se selecciono productos' :
                    lineaVenta.map((item:any, index:number)=><ItemLineaVenta key={index} elem={item}  
                      onClick={()=>onClick(item)}
                      upQTY={(id:any)=>upQTY(id)}
                      downQTY={(id:any)=>downQTY(id)}
                      upQTY10={(id:any)=>upQTY10(id)}
                      downQTY10={(id:any)=>downQTY10(id)} 
                    />)
                }
            </ListProduct>
        </div>
        <div style={{height: '30%', padding: '0 15px'}}>
           <Input label='Cliente' name='cliente' value={cliente} onChange={(e:any)=>onChangeCliente(e.target.value)} type='text' />
            <Total>Total: $ {total} </Total>
            <div style={{display: 'flex', justifyContent: 'center'}}>
              <Button text='Crear' onClick={()=>{
                if (lineaVenta.length===0 || total <= 0) {
                  dispatch(setAlert({
                    message: `No se agregaron productos al carrito`,
                    type: 'warning'
                  }))
                  return
                }
                console.log(cliente)
                if (cliente==='' || cliente===undefined) {
                  dispatch(setAlert({
                    message: `No se ingreso ningun cliente`,
                    type: 'warning'
                  }))
                  return
                }
                dispatch(setLoading(true))
                !edit?
                apiClient.post('/sale', {itemsSale: lineaVenta, cliente: cliente, total: total, estado: 'Modificado'},{
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
                  clearValue()
                  router.back()
                })
                .catch((e)=>dispatch(setAlert({
                  message: `${e.response.data.error}`,
                  type: 'error'
                }))):
                apiClient.patch(`/sale/${id}`, {itemsSale: lineaVenta, cliente: cliente, total: total, estado: 'Modificado'},{
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
  @media only screen and (max-width: 940px) {
    display: none;
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
  max-height: 65vh;
  min-height: 60vh;
`