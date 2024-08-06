'use client'

import Button from '@/components/Button'
import Search from '@/components/Search'
import apiClient from '@/utils/client'
import React, { useEffect, useState } from 'react'

export default function Sale() {

    const [search, setSearch] = useState('')
    const [data, setData] = useState([])

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
