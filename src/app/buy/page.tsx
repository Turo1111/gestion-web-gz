'use client'
'use client'

import Button from '@/components/Button'
import InfoBuy from '@/components/buy/InfoBuy'
import InfoSale from '@/components/sale/InfoSale'
import ModalPrintSale from '@/components/sale/ModalPrintSale'
import Search from '@/components/Search'
import useLocalStorage from '@/hooks/useLocalStorage'
import { useAppDispatch } from '@/redux/hook'
import { getLoading, setLoading } from '@/redux/loadingSlice'
import { getUser, setUser } from '@/redux/userSlice'
import apiClient from '@/utils/client'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { BsPrinterFill } from 'react-icons/bs'
import { MdInfo } from 'react-icons/md'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

export default function Buy() {

    const [search, setSearch] = useState('')
    const [data, setData] = useState([])
    const user = useSelector(getUser)
    const [valueStorage , setValue] = useLocalStorage("user", "")
    const dispatch = useAppDispatch();
    const router = useRouter()
    const loading = useSelector(getLoading)
    const [buySelected, setBuySelected] = useState(undefined)
    const [openInfoBuy, setOpenInfoBuy] = useState(false)

    const getBuy = async () => {
      dispatch(setLoading(true))
        apiClient.get('/buy',{
          headers: {
            Authorization: `Bearer ${valueStorage.token}` 
          }
        })
        .then(r=>{
          console.log('loading false')
          dispatch(setLoading(false))
            setData(prevData=>{
              return r.data
            })
        })
        .catch(e=>{console.log("error getBuy",e);dispatch(setLoading(false))})
    }

    useEffect(()=>{
      if (valueStorage) {
        getBuy()
      }
    },[user])

    useEffect(() => {
        if (!user && valueStorage) {
          dispatch(setUser(valueStorage))
        }
        if (!valueStorage) {
            router.push('/')
          }
      }, [valueStorage, user, dispatch])

  return (
    <main>
        <div style={{display: 'flex', justifyContent: 'space-between', width: '100%', padding: '0px 15px', alignItems: 'center'}}>
          <Search name='search' placeHolder={'Buscar compras'} type='text' value={search} onChange={(e:any)=>setSearch(e.target.value)} />
          <Button text='Nuevo' onClick={()=>console.log('nuevo')} to='/buy/newBuy'/>
        </div>
        <ul>
            {
                data.length !== 0 ?
                data.map((item:any, index:number)=>
                <Item key={index} onClick={()=>setBuySelected(item._id)} >
                  <div style={{display: 'flex', justifyContent: 'space-between', width : '100%', alignItems: 'center', marginRight: 15}}>
                    <h2 style={{fontSize: 18, color: '#252525'}}>{item.proveedor}</h2>
                    <h2 style={{fontSize: 18, fontWeight: 600, color: '#FA9B50'}}>$ {item.total}</h2>
                  </div>
                  <div  style={{display: 'flex'}}>
                    <IconWrapper style={{color: '#6EACDA'}} onClick={()=>setOpenInfoBuy(true)}>
                      <MdInfo />
                    </IconWrapper>
                </div>
                </Item>)
                :
                'no hay compras'
            }
        </ul>
        {
          openInfoBuy && 
          <InfoBuy open={openInfoBuy} handleClose={()=>setOpenInfoBuy(false)} id={buySelected} />
        }
    </main>
  )
}

const Item = styled.li `
  list-style: none;
  padding: 15px;
  font-weight: 600;
  width: 100%;
  border-bottom: 1px solid #d1d1d1;
  display: flex;
  justify-content: space-between;
  cursor: pointer;
`

const IconWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 25px;
    color: #716A6A;
    padding: 5px 15px;
    margin: 0px 5px;
    border-left: 1px solid #d9d9d9;
    cursor: pointer;
    &:hover {
        background-color: #d9d9d9;
    }
`