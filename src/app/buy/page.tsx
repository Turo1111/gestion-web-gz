'use client'
'use client'

import Button from '@/components/Button'
import InfoBuy from '@/components/buy/InfoBuy'
import InfoSale from '@/components/sale/InfoSale'
import ModalPrintSale from '@/components/sale/ModalPrintSale'
import Search from '@/components/Search'
import useLocalStorage from '@/hooks/useLocalStorage'
import { Buy } from '@/interfaces/buy.interface'
import { useAppDispatch } from '@/redux/hook'
import { getLoading, setLoading } from '@/redux/loadingSlice'
import { getUser, setUser } from '@/redux/userSlice'
import apiClient from '@/utils/client'
import { Types } from 'mongoose'
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'
import { useRouter } from 'next/navigation'
import React, { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react'
import { BsPrinterFill } from 'react-icons/bs'
import { MdInfo } from 'react-icons/md'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

export default function BuyScreen() {

    const [search, setSearch] = useState<string>('')
    const [data, setData] = useState<Buy[]>([])
    const [longArray, setLongArray] = useState<number>(0)
    const [dataSearch, setDataSearch] = useState<Buy[]>([])
    const user = useSelector(getUser)
    const [valueStorage , setValue] = useLocalStorage("user", "")
    const dispatch = useAppDispatch();
    const router: AppRouterInstance = useRouter()
    const {open: loading} = useSelector(getLoading)
    const [buySelected, setBuySelected] = useState< Types.ObjectId | undefined | string>(undefined)
    const [openInfoBuy, setOpenInfoBuy] = useState<boolean>(false)
    const [query, setQuery] = useState<{skip: number, limit: number}>({skip: 0, limit: 25})
    const observer = useRef<IntersectionObserver | null>(null);

    

    useEffect(()=>{

      const getSaleSearch = async (input: string) => {
        dispatch(setLoading(true))
        try {
            const response = await apiClient.post(`/buy/search`, {input});
            setDataSearch(response.data);
            dispatch(setLoading(false));
        } catch (e) {
            console.log("error", e);
            dispatch(setLoading(false));
        } finally {
          dispatch(setLoading(false))
        }
      }

      if ( search !== '') {
        getSaleSearch(search)
      }
    },[dispatch, search]) 

    useEffect(()=>{

      const getSale = async (skip: number, limit: number) => {
        dispatch(setLoading(true))
        try {
          const response = await apiClient.post(`/buy/skip`, { skip, limit },
            {
                headers: {
                    Authorization: `Bearer ${valueStorage.token}`
                },
            });
            setData((prevData:Buy[]) => {
    
              if (prevData.length === 0) {
                  return response.data.array;
              }
              const newData = response.data.array.filter((element: Buy) => {
                  return prevData.findIndex((item: Buy) => item._id === element._id) === -1;
              });
  
              return [...prevData, ...newData];
            })
            setLongArray(prevData=>response.data.longitud)
            dispatch(setLoading(false))
        } catch (e) {
          console.log("error getSale",e);dispatch(setLoading(false))
        } finally {
          dispatch(setLoading(false));
        }
      }

      if (valueStorage) {
        getSale(query.skip, query.limit)
      }
    },[dispatch, query, valueStorage])

    useEffect(() => {
        if (!user && valueStorage) {
          dispatch(setUser(valueStorage))
        }
        if (!valueStorage) {
            router.push('/')
          }
      }, [valueStorage, user, dispatch, router])

  const lastElementRef = useCallback(
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
    [loading, data.length, longArray]
  );

  return (
    <main>
        <div style={{display: 'flex', justifyContent: 'space-between', width: '100%', padding: '0px 15px', alignItems: 'center'}}>
          <Search name='search' placeHolder={'Buscar compras'} type='text' value={search} onChange={(e:ChangeEvent<HTMLInputElement>)=>setSearch(e.target.value)} />
          <Button text='Nuevo' onClick={()=>{}} to='/buy/newBuy'/>
        </div>
        <ListSale>
            {
              search !== '' ?
                dataSearch.length !== 0 ?
                dataSearch.map((item:Buy, index:number)=>
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
              :
                data.length !== 0 ?
                data.map((item:Buy, index:number)=>
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

const ListSale = styled.ul `
  display: flex;
  flex: 1;
  width: 100%;
  flex-direction: column;
  padding: 0 15px;
  overflow: scroll;
  max-height: 82vh;
`