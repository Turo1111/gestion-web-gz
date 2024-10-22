/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import Button from '@/components/Button'
import InfoSale from '@/components/sale/InfoSale'
import ModalPrintSale from '@/components/sale/ModalPrintSale'
import PrintMultipleSale from '@/components/sale/PrintMultipleSale'
import Search from '@/components/Search'
import useLocalStorage from '@/hooks/useLocalStorage'
import { Sale } from '@/interfaces/sale.interface'
import { useAppDispatch } from '@/redux/hook'
import { getLoading, setLoading } from '@/redux/loadingSlice'
import { getUser, setUser } from '@/redux/userSlice'
import apiClient from '@/utils/client'
import { Types } from 'mongoose'
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'
import { useRouter } from 'next/navigation'
import React, { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react'
import { BsPrinterFill } from 'react-icons/bs'
import { MdClose, MdEdit, MdInfo } from 'react-icons/md'
import { useSelector } from 'react-redux'
import { io } from 'socket.io-client'
import styled from 'styled-components'

export default function SaleScreen() {

    const [search, setSearch] = useState<string>('')
    const [data, setData] = useState<Sale[]>([])
    const [longArray, setLongArray] = useState(0)
    const [dataSearch, setDataSearch] = useState<Sale[]>([])
    const user = useSelector(getUser)
    const [valueStorage , setValue] = useLocalStorage("user", "")
    const dispatch = useAppDispatch();
    const router: AppRouterInstance = useRouter()
    const {open: loading} = useSelector(getLoading)
    const [openPrintSale, setOpenPrintSale] = useState<boolean>(false)
    const [saleSelected, setSaleSelected] = useState< Types.ObjectId | undefined | string>(undefined)
    const [openInfoSale, setOpenInfoSale] = useState<boolean>(false)
    const observer = useRef<IntersectionObserver | null>(null);
    const [query, setQuery] = useState<{skip: number, limit: number}>({skip: 0, limit: 25})
    const [selectSaleArray, setSelectSaleArray] = useState<(string | Types.ObjectId)[]>([])
    const [openMultipleSale, setOpenMultipleSale] = useState(false)

    const addSaleArray = (item: string | Types.ObjectId) => {
      /* setSelectSaleArray(prevData=>{
        const exist = prevData.find((elem: Sale) => elem._id === item._id)
        if (exist) {
          return prevData.filter((elem: Sale) => elem._id !== item._id)
        }
        return[...prevData, item._id]
      }) */
        setSelectSaleArray(prevData=>{
          const exist = prevData.find((elem: (string | Types.ObjectId)) => elem === item)
          if (exist) {
            return prevData.filter((elem: (string | Types.ObjectId)) => elem !== item)
          }
          return[...prevData, item]
        })
    }

    const getSale = async (skip: number, limit: number) => {
      dispatch(setLoading(true))
      try {
        const response = await apiClient.post(`/sale/skip`, { skip, limit },
          {
              headers: {
                  Authorization: `Bearer ${valueStorage.token}`
              },
          });
          setData((prevData:Sale[]) => {
  
            if (prevData.length === 0) {
                return response.data.array;
            }
            const newData = response.data.array.filter((element: Sale) => {
                return prevData.findIndex((item: Sale) => item._id === element._id) === -1;
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

    const getSaleSearch = async (input: string) => {
      dispatch(setLoading(true))
      try {
          const {data}:{data:Sale[]} = await apiClient.post(`/sale/search`, {input});
          setDataSearch(data);
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

    /* useEffect(() => {
      if (!user && valueStorage) {
        dispatch(setUser(valueStorage))
      }
      if (!valueStorage) {
          router.push('/')
        }
    }, [valueStorage, user, dispatch]) */

    useEffect(()=>{
      if (!process.env.NEXT_PUBLIC_DB_HOST) {
        return
      }
      const socket = io(process.env.NEXT_PUBLIC_DB_HOST)
      socket.on(`sale`, (socket) => {
        setData((prevData:Sale[])=>{
          return [...prevData, socket.data]
        })
      })
      return () => {
        socket.disconnect();
      }; 
    },[data])
      
    const lastElementRef = useCallback(
      (node: HTMLLIElement | null) => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
          if (entries[0].isIntersecting) {
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
        <ContainerSearch>
          <Search name='search' placeHolder={'Buscar ventas'} type='text' value={search} onChange={(e:ChangeEvent<HTMLInputElement>)=>setSearch(e.target.value)} />
          {
            selectSaleArray.length === 0 ?
            <Button text='Nuevo' onClick={()=>{}} to='/sale/newSale'/>:
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0px 15px'}}>
              <IconWrapper onClick={()=>setSelectSaleArray(prevData=>[])}>
                <MdClose/>
              </IconWrapper>
              <h2 style={{fontSize: 16, color: '#252525'}}>{selectSaleArray.length} Ventas seleccionadas</h2>
              <Button text='Imprimir' onClick={()=>{
                /* setOpenMultipleSale(true) */
                dispatch(setLoading(true))
                apiClient.post(`/sale/print`, selectSaleArray, { responseType: 'blob' }) // Importante: usar 'blob' para recibir el PDF
                          .then(response => {
                            const blob = new Blob([response.data], { type: 'application/pdf' });
                            const url = window.URL.createObjectURL(blob);
                            
                            // Crear un enlace temporal para descargar el archivo
                            const link = document.createElement('a');
                            link.href = url;
                            link.setAttribute('download', `ventas.pdf`); // Nombre del archivo descargado
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                            // Liberar memoria
                            window.URL.revokeObjectURL(url);
                            dispatch(setLoading(false))
                          })
                          .catch(error => {
                            console.error('Error descargando el PDF:', error);
                            dispatch(setLoading(false))
                          });
              }}/>
            </div>
          }
        </ContainerSearch>
        <ListSale>
            {
               search !== '' ?
                dataSearch.length !== 0 ?
                dataSearch.map((item:Sale, index:number)=>{
                return (<Item key={index}  $isSelect={selectSaleArray.find((elem: (string | Types.ObjectId)) => elem === item._id) ? true : false} >
                  <ContainerTag onClick={()=>item._id && addSaleArray(item._id)} >
                    <div>
                      <Tag>{item.cliente}</Tag>
                      <TagDate>{item.createdAt.split("T")[0] || 'undefined'}</TagDate>
                    </div>
                    <Tag style={{fontWeight: 600, color: '#FA9B50'}}>$ {item.total}</Tag>
                  </ContainerTag>
                  <div  style={{display: 'flex'}}>
                    <IconWrapper style={{color: '#A2CA71'}} onClick={()=>{
                      router.push(`/sale/editSale/${item._id}`);
                    }}>
                        <MdEdit />
                    </IconWrapper>
                    <IconWrapper style={{color: '#939185'}} onClick={() => {
                      dispatch(setLoading(true))
                        apiClient.get(`/sale/print/${item._id}`, { responseType: 'blob' }) // Importante: usar 'blob' para recibir el PDF
                          .then(response => {
                            const blob = new Blob([response.data], { type: 'application/pdf' });
                            const url = window.URL.createObjectURL(blob);
                            
                            // Crear un enlace temporal para descargar el archivo
                            const link = document.createElement('a');
                            link.href = url;
                            link.setAttribute('download', `venta-${item.cliente}.pdf`); // Nombre del archivo descargado
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                            
                            // Liberar memoria
                            window.URL.revokeObjectURL(url);
                            dispatch(setLoading(false))
                          })
                          .catch(error => {
                            console.error('Error descargando el PDF:', error);
                            dispatch(setLoading(false))
                          });
                      }}>
                        <BsPrinterFill />
                      </IconWrapper>
                    <IconWrapper style={{color: '#6EACDA'}} onClick={()=>{setOpenInfoSale(true);setSaleSelected(item._id)}}>
                      <MdInfo />
                    </IconWrapper>
                </div>
                </Item>)})
                :
                'no hay ventas'
              :
                data.length !== 0 ? 
                data.map((item:Sale, index:number)=>
                  <Item key={index} $isSelect={selectSaleArray.find((elem: (string | Types.ObjectId)) => elem === item._id) ? true : false} >
                    <ContainerTag onClick={()=>item._id && addSaleArray(item._id)} >
                      <div>
                        <Tag>{item.cliente}</Tag>
                        <TagDate>{item.createdAt.split("T")[0]}</TagDate>
                      </div>
                      <Tag style={{fontWeight: 600, color: '#FA9B50'}}>$ {item.total}</Tag>
                    </ContainerTag>
                    <div  style={{display: 'flex'}}>
                      <IconWrapper style={{color: '#A2CA71'}} onClick={()=>{
                        router.push(`/sale/editSale/${item._id}`);
                      }}>
                          <MdEdit />
                      </IconWrapper>
                      <IconWrapper style={{color: '#939185'}} onClick={() => {
                        dispatch(setLoading(true))
                        apiClient.get(`/sale/print/${item._id}`, { responseType: 'blob' }) // Importante: usar 'blob' para recibir el PDF
                          .then(response => {
                            const blob = new Blob([response.data], { type: 'application/pdf' });
                            const url = window.URL.createObjectURL(blob);

                            // Crear un enlace temporal para descargar el archivo
                            const link = document.createElement('a');
                            link.href = url;
                            link.setAttribute('download', `venta-${item.cliente}.pdf`); // Nombre del archivo descargado
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);

                            // Liberar memoria
                            window.URL.revokeObjectURL(url);
                            dispatch(setLoading(false))
                          })
                          .catch(error => {
                            console.error('Error descargando el PDF:', error);
                            dispatch(setLoading(false))
                          });
                      }}>
                        <BsPrinterFill />
                      </IconWrapper>
                    <IconWrapper style={{color: '#6EACDA'}} onClick={()=>{setOpenInfoSale(true);setSaleSelected(item._id)}}>
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
        {/* {
          openMultipleSale &&
          <PrintMultipleSale open={openMultipleSale} handleClose={()=>setOpenMultipleSale(false)} salesIds={selectSaleArray} />
        } */}
    </main>
  )
}

const Item = styled.li<{$isSelect: boolean}> `
  list-style: none;
  padding: 15px;
  font-weight: 600;
  width: 100%;
  border-bottom: 1px solid #d1d1d1;
  display: flex;
  justify-content: space-between;
  cursor: pointer;
  background-color: ${({ $isSelect }) => ($isSelect ? '#e4e2e2' : 'none')};
  @media only screen and (max-width: 500px) {
    padding: 15px 0px 15px 15px;
  }
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
    @media only screen and (max-width: 500px) {
      font-size: 20px;
      padding: 5px 10px;
      margin: 0px 5px;
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
  @media only screen and (max-width: 500px) {
    padding: 0;
  }
`

const ContainerTag = styled.div`
  display: flex; 
  justify-content: space-between; 
  width : 100%; 
  align-items: center;
  margin-right: 15px;
  @media only screen and (max-width: 500px) {
    margin-right: 0px;
  }
`

const Tag = styled.h2`
  font-size: 18px;
  color: #252525;
  @media only screen and (max-width: 500px) {
    font-size: 14px;
  }
`

const TagDate = styled.h2`
  font-size: 14px;
  color: #252525;
  @media only screen and (max-width: 500px) {
    font-size: 12px;
  }
`

const ContainerSearch = styled.div `
  display: flex; 
  justify-content: space-between; 
  width: 100%; 
  padding: 0px 15px; 
  align-items: center;
  @media only screen and (max-width: 500px) {
    flex-direction: column;
  }
`