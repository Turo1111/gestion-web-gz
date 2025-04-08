import { ExtendItemSale, ItemSale } from '@/interfaces/sale.interface'
import { useAppDispatch, useAppSelector } from '@/redux/hook'
import React from 'react'
import styled from 'styled-components'
import ItemLineaCompra from './ItemLineaCompra'
import { deleteItemBuy, downQTY10Buy, downQTYBuy, getBuy, getItemBuy, onChangePrecioUnitarioBuy, upQTY10Buy, upQTYBuy } from '@/redux/buySlice'
import { ExtendItemBuy } from '@/interfaces/buy.interface'
import apiClient from '@/utils/client'
import { setLoading } from '@/redux/loadingSlice'
import useLocalStorage from '@/hooks/useLocalStorage'

export default function ListLineaCompra({edit}:{edit?: boolean}) {

    const itemBuy = useAppSelector(getItemBuy)
    const dispatch = useAppDispatch();
    const buy = useAppSelector(getBuy)

    const [valueStorage , setValue] = useLocalStorage("user", "")

  return (
    <ListProduct>
        { 
            itemBuy.length === 0 ? 'No se selecciono productos' :
            itemBuy.map((item: ExtendItemBuy, index:number)=>{
              return <ItemLineaCompra key={index} elem={item}
                onChangePrecioCompra={(value:string, idProducto: string)=>dispatch(onChangePrecioUnitarioBuy({value: value, idProducto: idProducto}))}
                onClick={() =>{
                  if (edit) {
                    if (buy._id) {
                      dispatch(setLoading(true));
                      apiClient.patch(`/itemBuy/${item._id}`, {estado: false},{
                        headers: {
                            Authorization: `Bearer ${valueStorage.token}`
                        },
                      })
                      .then((r)=>{
                        dispatch(setLoading(false));
                        dispatch(deleteItemBuy({id: item.idProducto}))
                      })
                      .catch((e)=>{
                        dispatch(setLoading(false))
                      })
                    }
                    return
                  }
                  dispatch(deleteItemBuy({id: item.idProducto}))
                }}
                upQTY={() => {dispatch(upQTYBuy({id: item.idProducto}))}}
                downQTY={() => {dispatch(downQTYBuy({id: item.idProducto}))}}
                upQTY10={() => {dispatch(upQTY10Buy({id: item.idProducto}))}}
                downQTY10={() => {dispatch(downQTY10Buy({id: item.idProducto}))}} 
              />
            })
        }
    </ListProduct> 
  )
}

const ListProduct = styled.ul `
  display: flex;
  flex: 1;
  width: 100%;
  flex-direction: column;
  padding: 0 15px;
  overflow-y: scroll;
  max-height: 60vh;
  @media only screen and (max-width: 625px) {
    padding: 0;
    min-height: 35vh;
    max-height: 40vh;
  }
`