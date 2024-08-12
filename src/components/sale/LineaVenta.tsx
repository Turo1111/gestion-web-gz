import React from 'react'
import styled from 'styled-components'
import ItemLineaVenta from './ItemLineaVenta'
import apiClient from '@/utils/client';
import { setLoading } from '@/redux/loadingSlice';
import { setAlert } from '@/redux/alertSlice';
import { useAppDispatch } from '@/redux/hook';
import { useRouter } from 'next/router';
import Input from '../Input';
import Button from '../Button';

export default function LineaVenta(
) {

    const dispatch = useAppDispatch();
    const router = useRouter()

  return (
    <ContainerListLineaVenta>
        {/* <div style={{display: 'flex', flex: 1, flexDirection: 'column', padding: 15}}>
            <h2 style={{fontSize: 18}} >Linea de Venta</h2>
            <ListProduct style={{ display: 'flex', flexDirection: 'column', padding: 15, maxHeight: '65vh'}}>
                { 
                    lineaVenta.length === 0 ? 'No se selecciono productos' :
                    lineaVenta.map((item:any, index:number)=><ItemLineaVenta key={index} elem={item}  
                        onClick={()=>setLineaVenta((prevData:any)=>prevData.filter((elem:any)=>elem._id!==item._id))}
                        upQTY={(id:any)=>setLineaVenta((prevData:any)=>prevData.map((elem:any)=>{
                          return elem._id===id ? {...elem, cantidad: elem.cantidad+1, total: (elem.precioUnitario*(elem.cantidad+1)).toFixed(2)} : elem
                        }))}
                        downQTY={(id:any)=>setLineaVenta((prevData:any)=>prevData.map((elem:any)=>{
                          if (elem._id===id) {
                            if (elem.cantidad-1 > 1 ) {
                              return {...elem, cantidad: elem.cantidad-1, total: (elem.precioUnitario*(elem.cantidad-1)).toFixed(2)}
                            }
                            return {...elem, cantidad: 1, total: elem.precioUnitario}
                          }
                          return elem
                        }))}
                        upQTY10={(id:any)=>setLineaVenta((prevData:any)=>prevData.map((elem:any)=>{
                          return elem._id===id ? {...elem, cantidad: elem.cantidad+10, total: (elem.precioUnitario*(elem.cantidad+10)).toFixed(2)} : elem
                        }))}
                        downQTY10={(id:any)=>setLineaVenta((prevData:any)=>prevData.map((elem:any)=>{
                          if (elem._id===id) {
                            if (elem.cantidad > 10 ) {
                              return {...elem, cantidad: elem.cantidad-10, total: (elem.precioUnitario*(elem.cantidad-10)).toFixed(2)}
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
            <Input label='Cliente' name='cliente' value={cliente} onChange={(e:any)=>setCliente(e.target.value)} type='text' />
            <h2 style={{fontSize: 18}} >Total: $ {total} </h2>
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
        </div> */}
    </ContainerListLineaVenta>
  )
}


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