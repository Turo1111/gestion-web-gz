import { ExtendItemSale, ItemSale } from '@/interfaces/sale.interface'
import { useAppDispatch, useAppSelector } from '@/redux/hook'
import { deleteItemSale, downQTY10Sale, downQTYSale, getItemSale, getSale, onChangePrecioUnitarioSale, upQTY10Sale, upQTYSale } from '@/redux/saleSlice'
import React from 'react'
import ItemLineaVenta from './ItemLineaVenta'
import styled from 'styled-components'
import { Types } from 'mongoose'
import useLocalStorage from '@/hooks/useLocalStorage'
import apiClient from '@/utils/client'
import { setLoading } from '@/redux/loadingSlice'

export default function ListLineaVenta({edit}:{edit?: boolean}) {

    const itemSale = useAppSelector(getItemSale)
    const dispatch = useAppDispatch();
    const sale = useAppSelector(getSale)
    const [valueStorage , setValue] = useLocalStorage("user", "")

  return (
    <ListProduct>
        { 
            itemSale.length === 0 ? 'No se selecciono productos' :
            itemSale.map((item: ExtendItemSale, index:number)=>{
              return <ItemLineaVenta key={index} elem={item}
                onChangePrecioUnitario={(value:string, idProducto: string)=>dispatch(onChangePrecioUnitarioSale({value: value, idProducto: idProducto}))}
                onClick={() =>{
                  if (edit) {
                    if (sale._id) {
                      dispatch(setLoading(true));
                      apiClient.patch(`/itemSale/${item._id}`, {estado: false},{
                        headers: {
                            Authorization: `Bearer ${valueStorage.token}`
                        },
                      })
                      .then((r)=>{
                        dispatch(setLoading(false));
                        dispatch(deleteItemSale({id: item.idProducto}))
                      })
                      .catch((e)=>{
                        dispatch(setLoading(false))
                      })
                    }
                    return
                  }
                  dispatch(deleteItemSale({id: item.idProducto}))
                }}
                upQTY={() => dispatch(upQTYSale({id: item.idProducto}))}
                downQTY={() => dispatch(downQTYSale({id: item.idProducto}))}
                upQTY10={() => dispatch(upQTY10Sale({id: item.idProducto}))}
                downQTY10={() => dispatch(downQTY10Sale({id: item.idProducto}))} 
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
  @media only screen and (max-width: 500px) {
    padding: 0;
    max-height: 40vh;
  }
`