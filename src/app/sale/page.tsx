'use client'

import Button from '@/components/Button'
import Search from '@/components/Search'
import useLocalStorage from '@/hooks/useLocalStorage'
import { useAppDispatch } from '@/redux/hook'
import { getLoading, setLoading } from '@/redux/loadingSlice'
import { getUser, setUser } from '@/redux/userSlice'
import apiClient from '@/utils/client'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
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

    const getSale = async () => {
      dispatch(setLoading(true))
        apiClient.get('/sale',{
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
        .catch(e=>console.log("error getSale",e))
    }

    useEffect(()=>{
        getSale()
    },[valueStorage.token])

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
          <Button text='Nuevo' onClick={()=>console.log('nuevo')} to='/sale/newSale'/>
        </div>
        <ul>
            {
                data.length !== 0 ?
                data.map((item:any, index:number)=><Item key={index}>
                        <h2 style={{fontSize: 18, color: '#252525'}}>{item.cliente}</h2>
                        <h2 style={{fontSize: 18, fontWeight: 600, color: '#FA9B50'}}>$ {item.total}</h2>
                </Item>)
                :
                'no hay ventas'
            }
        </ul>
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
