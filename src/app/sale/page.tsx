'use client'

import Button from '@/components/Button'
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

export default function Sale() {

    const [search, setSearch] = useState('')
    const [data, setData] = useState([])
    const user = useSelector(getUser)
    const [valueStorage , setValue] = useLocalStorage("user", "")
    const dispatch = useAppDispatch();
    const router = useRouter()
    const loading = useSelector(getLoading)
    const [openPrintSale, setOpenPrintSale] = useState(false)
    const [saleSelected, setSaleSelected] = useState(undefined)
    const [openInfoSale, setOpenInfoSale] = useState(false)

    const getSale = async () => {
      dispatch(setLoading(true))
        apiClient.get('/sale',{
          headers: {
            Authorization: `Bearer ${valueStorage.token}` 
          }
        })
        .then(r=>{
          dispatch(setLoading(false))
            setData(prevData=>{
              return r.data
            })
        })
        .catch(e=>{console.log("error getSale",e);dispatch(setLoading(false))})
    }

    useEffect(()=>{
      if (valueStorage) {
        getSale()
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
          <Search name='search' placeHolder={'Buscar ventas'} type='text' value={search} onChange={(e:any)=>setSearch(e.target.value)} />
          <Button text='Nuevo' onClick={()=>{}} to='/sale/newSale'/>
        </div>
        <ul>
            {
                data.length !== 0 ?
                data.map((item:any, index:number)=>
                <Item key={index} onClick={()=>setSaleSelected(item._id)} >
                  <div style={{display: 'flex', justifyContent: 'space-between', width : '100%', alignItems: 'center', marginRight: 15}}>
                    <h2 style={{fontSize: 18, color: '#252525'}}>{item.cliente}</h2>
                    <h2 style={{fontSize: 18, fontWeight: 600, color: '#FA9B50'}}>$ {item.total}</h2>
                  </div>
                  <div  style={{display: 'flex'}}>
                    <IconWrapper style={{color: '#939185'}}  onClick={()=>{setOpenPrintSale(true)}}>
                      <BsPrinterFill />
                    </IconWrapper>
                    <IconWrapper style={{color: '#6EACDA'}} onClick={()=>setOpenInfoSale(true)}>
                      <MdInfo />
                    </IconWrapper>
                </div>
                </Item>)
                :
                'no hay ventas'
            }
        </ul>
        {
          openPrintSale && 
          <ModalPrintSale open={openPrintSale} handleClose={()=>setOpenPrintSale(false)} id={saleSelected} />
        }
        {
          openInfoSale && 
          <InfoSale open={openInfoSale} handleClose={()=>setOpenInfoSale(false)} id={saleSelected} />
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