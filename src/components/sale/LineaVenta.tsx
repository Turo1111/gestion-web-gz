import React, { useState } from 'react'
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

export default function LineaVenta({lineaVenta, onClick, upQTY, downQTY, upQTY10, downQTY10, total}:
  {lineaVenta:any, onClick:any, upQTY:any, downQTY: any, upQTY10:any, downQTY10:any, total:any}
) {

    const dispatch = useAppDispatch();
    const router = useRouter()
    const [cliente, setCliente] = useState('')
    const [valueStorage , setValue] = useLocalStorage("user", "")

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
           <Input label='Cliente' name='cliente' value={cliente} onChange={(e:any)=>setCliente(e.target.value)} type='text' />
            <Total>Total: $ {total} </Total>
            <div style={{display: 'flex', justifyContent: 'center'}}>
              <Button text='Crear' onClick={()=>{
                dispatch(setLoading(true))
                apiClient.post('/sale', {itemsSale: lineaVenta, cliente: cliente, total: total, estado: 'Entregado'},{
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
                .catch((e)=>dispatch(setAlert({
                  message: `${e.response.data.error}`,
                  type: 'error'
                })))
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
  @media only screen and (max-width: 940px) {
    max-height: 55vh;
  }
`