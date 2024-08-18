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
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { BsPrinterFill } from 'react-icons/bs'
import { MdEdit, MdInfo } from 'react-icons/md'
import { useSelector } from 'react-redux'
import { io } from 'socket.io-client'
import styled from 'styled-components'

export default function Sale() {

    const [search, setSearch] = useState('')
    const [data, setData] = useState<any>([])
    const [longArray, setLongArray] = useState(0)
    const [dataSearch, setDataSearch] = useState<any>([])
    const user = useSelector(getUser)
    const [valueStorage , setValue] = useLocalStorage("user", "")
    const dispatch = useAppDispatch();
    const router:any = useRouter()
    const {open: loading} = useSelector(getLoading)
    const [openPrintSale, setOpenPrintSale] = useState(false)
    const [saleSelected, setSaleSelected] = useState(undefined)
    const [openInfoSale, setOpenInfoSale] = useState(false)
    const observer = useRef<IntersectionObserver | null>(null);
    const [query, setQuery] = useState({skip: 0, limit: 25})

    const getSale = async (skip: number, limit: number) => {
      dispatch(setLoading(true))
      try {
        const response = await apiClient.post(`/sale/skip`, { skip, limit },
          {
              headers: {
                  Authorization: `Bearer ${valueStorage.token}`
              },
          });
          setData((prevData:any) => {
  
            if (prevData.length === 0) {
                return response.data.array;
            }
            const newData = response.data.array.filter((element: any) => {
                return prevData.findIndex((item: any) => item._id === element._id) === -1;
            });

            return [...prevData, ...newData];
          })
          setLongArray(prevData=>response.data.longitud)
          console.log(response.data.longitud)
          dispatch(setLoading(false))
      } catch (e) {
        console.log("error getSale",e);dispatch(setLoading(false))
      } finally {
        dispatch(setLoading(false));
      }
    }

    const getSaleSearch = async (input: string) => {
      dispatch(setLoading(true))
      try {
          const response = await apiClient.post(`/sale/search`, {input});
          setDataSearch(response.data);
          dispatch(setLoading(false));
      } catch (e) {
          console.log("error", e);
          dispatch(setLoading(false));
      } finally {
        dispatch(setLoading(false))
      }
    }

    useEffect(()=>{
      if ( search !== '') {
        getSaleSearch(search)
      }
    },[search]) 

    useEffect(()=>{
      if (valueStorage) {
        getSale(query.skip, query.limit)
      }
    },[query])

    useEffect(() => {
      if (!user && valueStorage) {
        dispatch(setUser(valueStorage))
      }
      if (!valueStorage) {
          router.push('/')
        }
    }, [valueStorage, user, dispatch])

    useEffect(()=>{
      if (!process.env.NEXT_PUBLIC_DB_HOST) {
        return
      }
      const socket = io(process.env.NEXT_PUBLIC_DB_HOST)
      socket.on(`sale`, (socket) => {
        console.log('escucho', socket)
        setData((prevData:any)=>{
          return [...prevData, socket.data]
        })
      })
      return () => {
        socket.disconnect();
      }; 
    },[data])
      
    const lastElementRef: any = useCallback(
      (node: HTMLLIElement | null) => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
          if (entries[0].isIntersecting) {
            console.log("Elemento visible");
            if (data.length < longArray) {
              setQuery(prevData => ({ skip: prevData.skip + 25, limit: prevData.limit }));
            }
          }
        });
        if (node) observer.current.observe(node);
      },
      [loading, data, search, query]
    );

  return (
    <main>
        <div style={{display: 'flex', justifyContent: 'space-between', width: '100%', padding: '0px 15px', alignItems: 'center'}}>
          <Search name='search' placeHolder={'Buscar ventas'} type='text' value={search} onChange={(e:any)=>setSearch(e.target.value)} />
          <Button text='Nuevo' onClick={()=>{}} to='/sale/newSale'/>
        </div>
        <ListSale>
            {
               search !== '' ?
                dataSearch.length !== 0 ?
                dataSearch.map((item:any, index:number)=>{
                return (<Item key={index} onClick={()=>setSaleSelected(item._id)} >
                  <div style={{display: 'flex', justifyContent: 'space-between', width : '100%', alignItems: 'center', marginRight: 15}}>
                    <h2 style={{fontSize: 18, color: '#252525'}}>{item.cliente}</h2>
                    <h2 style={{fontSize: 18, fontWeight: 600, color: '#FA9B50'}}>$ {item.total}</h2>
                  </div>
                  <div  style={{display: 'flex'}}>
                    <IconWrapper style={{color: '#A2CA71'}} onClick={()=>{
                      router.push(`/sale/editSale/${item._id}`);
                    }}>
                        <MdEdit />
                    </IconWrapper>
                    <IconWrapper style={{color: '#939185'}}  onClick={()=>{setOpenPrintSale(true)}}>
                      <BsPrinterFill />
                    </IconWrapper>
                    <IconWrapper style={{color: '#6EACDA'}} onClick={()=>setOpenInfoSale(true)}>
                      <MdInfo />
                    </IconWrapper>
                </div>
                </Item>)})
                :
                'no hay ventas'
              :
                data.length !== 0 ? 
                data.map((item:any, index:number)=>
                  <Item key={index} onClick={()=>setSaleSelected(item._id)} >
                    <div style={{display: 'flex', justifyContent: 'space-between', width : '100%', alignItems: 'center', marginRight: 15}}>
                      <h2 style={{fontSize: 18, color: '#252525'}}>{item.cliente}</h2>
                      <h2 style={{fontSize: 18, fontWeight: 600, color: '#FA9B50'}}>$ {item.total}</h2>
                    </div>
                    <div  style={{display: 'flex'}}>
                      <IconWrapper style={{color: '#A2CA71'}} onClick={()=>{
                        router.push(`/sale/editSale/${item._id}`);
                      }}>
                          <MdEdit />
                      </IconWrapper>
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
            {search === '' && data.length < longArray && (
              <li
                style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 15,
                  minHeight: 5
                }}
                ref={lastElementRef}
              >
                final
              </li>
            )}
        </ListSale>
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

const ListSale = styled.ul `
  display: flex;
  flex: 1;
  width: 100%;
  flex-direction: column;
  padding: 0 15px;
  overflow: scroll;
  max-height: 82vh;
`