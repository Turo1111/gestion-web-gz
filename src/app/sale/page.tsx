'use client'

import Button from '@/components/Button'
import Search from '@/components/Search'
import useLocalStorage from '@/hooks/useLocalStorage'
import { useAppDispatch } from '@/redux/hook'
import { getUser, setUser } from '@/redux/userSlice'
import apiClient from '@/utils/client'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

export default function Sale() {

    const [search, setSearch] = useState('')
    const [data, setData] = useState([])
    const user = useSelector(getUser)
    const [valueStorage , setValue] = useLocalStorage("user", "")
    const dispatch = useAppDispatch();
    const router = useRouter()

    const getSale = async () => {
        apiClient.get('/sale')
        .then(r=>{
            setData(prevData=>r.data)
        })
        .catch(e=>console.log("error getSale",e))
    }

    useEffect(()=>{
        getSale()
    },[data])

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
        <div style={{display: 'flex', justifyContent: 'space-between', width: '100%', padding: '0px 15px'}}>
          <Search name='search' placeHolder={'Buscar ventas'} type='text' value={search} onChange={(e:any)=>setSearch(e.target.value)} />
          <Button text='Nuevo' onClick={()=>console.log('nuevo')} to='/sale/newSale'/>
        </div>
        <ul>
            {
                data.length !== 0 ?
                data.map((item:any, index:number)=><li key={index}>{index}</li>)
                :
                'no hay ventas'
            }
        </ul>
    </main>
  )
}
