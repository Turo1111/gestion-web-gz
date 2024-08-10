'use client'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import Search from '../../../components/Search';
import { io } from 'socket.io-client';
import apiClient from '@/utils/client';
import { getUser, setUser } from '@/redux/userSlice';
import { useAppDispatch } from '@/redux/hook';
import { useSelector } from 'react-redux';
import useLocalStorage from '@/hooks/useLocalStorage';
import styled from 'styled-components';
import ItemsProducts from '@/components/products/ItemsProducts';
import Input from '@/components/Input';
import ItemLineaVenta from '@/components/sale/ItemLineaVenta';
import Button from '@/components/Button';
import { useRouter } from 'next/navigation';
import { getLoading, setLoading } from '@/redux/loadingSlice';
import { setAlert } from '@/redux/alertSlice';

export default function NewBuy() {

    const [search, setSearch] = useState('')
    const [data, setData] = useState([])
    const [valueStorage , setValue] = useLocalStorage("user", "")
    const [dataSearch, setDataSearch] = useState([])
    const [query, setQuery] = useState({skip: 0, limit: 25})
    const observer = useRef<IntersectionObserver | null>(null);
    const [lineaVenta, setLineaVenta] = useState<any>([])
    const [proveedor, setProveedor] = useState('')
    const [total, setTotal] = useState(0)
    const router = useRouter()
    const loading = useSelector(getLoading)
    
    const [longArray, setLongArray] = useState(0)

    const user = useSelector(getUser)
    const dispatch = useAppDispatch();

    useEffect(() => {
      if (!user && valueStorage) {
        dispatch(setUser(valueStorage))
      }
      if (!valueStorage) {
        router.push('/')
      }
    }, [valueStorage, user, dispatch])

    const searchProduct = (e: any) => {
        setSearch(prevData=>e.target.value)
    }

    const getProduct = async (skip: number, limit: number) => {
      dispatch(setLoading(true))
      try {
          const response = await apiClient.post(`/product/skip`, { skip, limit },
              {
                  headers: {
                      Authorization: `Bearer ${valueStorage.token}`
                  },
              });
          setData(prevData => {
  
              if (prevData.length === 0) {
                  return response.data.array;
              }
              const newData = response.data.array.filter((element: any) => {
                  return prevData.findIndex((item: any) => item._id === element._id) === -1;
              });
  
              return [...prevData, ...newData];
          });
          setLongArray(prevData=>response.data.longitud)
      } catch (e) {
          console.log("error", e);
      } finally {
        dispatch(setLoading(false))
      }
  }

  const getProductSearch = async (input: string) => {
    dispatch(setLoading(true))
    try {
        const response = await apiClient.post(`/product/search`, { input });
        setDataSearch(response.data);
    } catch (e) {
        console.log("error", e);
    } finally {
      dispatch(setLoading(false))
    }
}

    useEffect(()=>{
      getProduct(query.skip, query.limit)
    },[query]) 

    useEffect(()=>{
      if (search) {
        getProductSearch(search)
      }
    },[search]) 

    useEffect(()=>{
      if (!process.env.NEXT_PUBLIC_DB_HOST) {
        return
      }
      const socket = io(process.env.NEXT_PUBLIC_DB_HOST)
      socket.on(`product`, (socket:any) => {
        refreshProducts()
        setData((prevData: any)=>{
          const exist = prevData.find((elem: any) => elem._id === socket.data._id )
          if (exist) {
            return prevData.map((item: any) =>
              item._id === socket.data._id ? socket.data : item
            )
          }
          return [...prevData]
        })
      })
      return () => {
        socket.disconnect();
      }; 
    },[data])

    const refreshProducts = () => {
      setSearch(prevData=>'')
    };

    const lastElementRef = useCallback(
      (node: HTMLLIElement | null) => {
          if (loading) return;
          if (observer.current) observer.current.disconnect();
          observer.current = new IntersectionObserver(entries => {
              if (entries[0].isIntersecting) {
                  if (search === '') {
                    if (data.length < longArray) {
                      setQuery(prevData => ({ skip: prevData.skip + 25, limit: prevData.limit }));
                    }
                  }
              }
          });
          if (node) observer.current.observe(node);
      },
      [loading, search]
  );

  useEffect(()=>{
    const sumWithInitial = lineaVenta.reduce(
        (accumulator:number, currentValue: any) => accumulator + currentValue.total,
        0,
    );
    setTotal(prevData=>sumWithInitial.toFixed(2))
  },[lineaVenta])

  return (
    <div style={{display: 'flex', flex: 1}}>
        <div style={{width: '50%'}}>
            <Search name='search' placeHolder={'Buscar productos'} type='text' value={search} onChange={(e:any)=>setSearch(e.target.value)} />
            <ListProduct style={{maxHeight: '82vh'}}>
                {
                  search !== '' ?
                    dataSearch.length !== 0 ? 
                      dataSearch.map((item: any, index: any)=>{
                        return <ItemsProducts  key={index} item={item} onClickItem={()=>{
                            setLineaVenta((prevData:any)=>{
                                const exist = prevData.find((elem:any)=>elem._id===item._id)
                                if (exist) {
                                    return prevData.map((elem: any) =>
                                        elem._id === item._id ? {...item, cantidad: 1, total: item.precioUnitario} : elem
                                    )
                                }
                                return [...prevData, {...item, cantidad: 1, total: item.precioUnitario, idProducto: item._id}]
                            })
                        }} select={false} />
                      })
                      : 'NO HAY PRODUCTOS'
                  :
                    data.length !== 0 ? 
                    data.map((item: any, index: any)=>{
                      return <ItemsProducts  key={index} item={item} onClickItem={()=>{
                        setLineaVenta((prevData:any)=>{
                            const exist = prevData.find((elem:any)=>elem._id===item._id)
                            if (exist) {
                                return prevData.map((elem: any) =>
                                    elem._id === item._id ? {...item, cantidad: 1, total: item.precioUnitario} : elem
                                )
                            }
                            return [...prevData, {...item, cantidad: 1, total: item.precioUnitario}]
                        })
                      }} select={false}/>
                    })
                    : 'NO HAY PRODUCTOS'
                }
                <li style={{listStyle: 'none', padding: 0, margin: 0}} ref={lastElementRef}></li>;
            </ListProduct>
        </div>
        <div style={{width: '50%', display: 'flex', flex: 1, flexDirection: 'column'}}>
            <div style={{display: 'flex', flex: 1, flexDirection: 'column', padding: 15}}>
                <h2 style={{fontSize: 18}} >Linea de venta</h2>
                <ListProduct style={{ display: 'flex', flexDirection: 'column', padding: 15, maxHeight: '65vh'}}>
                    { 
                        lineaVenta.length === 0 ? 'No se selecciono productos' :
                        lineaVenta.map((item:any, index:number)=><ItemLineaVenta key={index} elem={item}  onClick={()=>
                                setLineaVenta((prevData:any)=>prevData.filter((elem:any)=>elem._id!==item._id))
                            }
                            upQTY={(id:any)=>setLineaVenta((prevData:any)=>prevData.map((elem:any)=>{
                              return elem._id===id ? {...elem, cantidad: elem.cantidad+1, total: elem.precioUnitario*(elem.cantidad+1)} : elem
                            }))}
                            downQTY={(id:any)=>setLineaVenta((prevData:any)=>prevData.map((elem:any)=>{
                              if (elem._id===id) {
                                if (elem.cantidad-1 > 1 ) {
                                  return {...elem, cantidad: elem.cantidad-1, total: elem.precioUnitario*(elem.cantidad-1)}
                                }
                                return {...elem, cantidad: 1, total: elem.precioUnitario}
                              }
                              return elem
                            }))}
                            upQTY10={(id:any)=>setLineaVenta((prevData:any)=>prevData.map((elem:any)=>{
                              return elem._id===id ? {...elem, cantidad: elem.cantidad+10, total: elem.precioUnitario*(elem.cantidad+10)} : elem
                            }))}
                            downQTY10={(id:any)=>setLineaVenta((prevData:any)=>prevData.map((elem:any)=>{
                              if (elem._id===id) {
                                if (elem.cantidad > 10 ) {
                                  return {...elem, cantidad: elem.cantidad-10, total: elem.precioUnitario*(elem.cantidad-10)}
                                }
                                return elem
                              }
                              return elem
                            }))}
                        />)
                    }
                </ListProduct>
            </div>
            <div style={{height: '30%', padding: '0 15px'}}>
                <Input label='Proveedor' name='proveedor' value={proveedor} onChange={(e:any)=>setProveedor(e.target.value)} type='text' />
                <h2 style={{fontSize: 18}} >Total: $ {total} </h2>
                <Button text='Crear' onClick={()=>{
                  dispatch(setLoading(true))
                  apiClient.post('/buy', {itemsBuy: lineaVenta, proveedor: proveedor, total: total, estado: 'Entregado'},{
                    headers: {
                      Authorization: `Bearer ${valueStorage.token}` 
                    }
                  })
                  .then((r)=>{
                    dispatch(setLoading(false))
                    dispatch(setAlert({
                      message: `Venta creada correctamente`,
                      type: 'success'
                    }))
                    router.back()
                  })
                  .catch((e)=>dispatch(setAlert({
                    message: `${e.response.data.error}`,
                    type: 'error'
                  })))
                }} />
            </div>
        </div>
    </div>
  )
}

const ListProduct = styled.ul `
  display: flex;
  flex: 1;
  width: 100%;
  flex-direction: column;
  padding: 0 15px;
  overflow-y: scroll;
`
