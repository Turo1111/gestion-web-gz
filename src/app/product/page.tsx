'use client'
import Button from '@/components/Button';
import Loading from '@/components/Loading';
import ItemsProducts from '@/components/products/ItemsProducts';
import ModalProduct from '@/components/products/ModalProduct';
import NewProduct from '@/components/products/NewProduct';
import UpdatePrice from '@/components/products/UpdatePrice';
import Search from '@/components/Search';
import useLocalStorage from '@/hooks/useLocalStorage';
import { useAppDispatch } from '@/redux/hook';
import { getLoading, setLoading } from '@/redux/loadingSlice';
import { getUser, setUser } from '@/redux/userSlice';
import apiClient from '@/utils/client';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { MdEdit, MdInfo } from 'react-icons/md';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import styled from 'styled-components';

export default function Product() {

    const [search, setSearch] = useState('')
    const [data, setData] = useState([])
    const [valueStorage , setValue] = useLocalStorage("user", "")
    const [dataSearch, setDataSearch] = useState([])
    const [query, setQuery] = useState({skip: 0, limit: 25})
    const [selectProduct, setSelectProduct] = useState(undefined)
    const [openModalProduct, setOpenModalProduct] = useState(false)
    const observer = useRef<IntersectionObserver | null>(null);
    const {open: loading} = useSelector(getLoading)
    const [openNewProduct, setOpenNewProduct] = useState(false)
    const router = useRouter()
    const [longArray, setLongArray] = useState(0)
    const [openUpdatePrice, setOpenUpdatePrice] = useState(false)

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

    useEffect(() => {
      if (!user && valueStorage) {
        dispatch(setUser(valueStorage))
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
          dispatch(setLoading(false));
      } catch (e) {
          console.log("error", e);
          dispatch(setLoading(false));
      } finally {
        dispatch(setLoading(false));
      }
  }

  const getProductSearch = async (input: string) => {
    dispatch(setLoading(true))
    try {
        const response = await apiClient.post(`/product/search`, { input });
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
      
      getProduct(query.skip, query.limit)
      
    },[query]) 

    useEffect(()=>{
      if (search) {
        getProductSearch(search)
      }
    },[search]) 

    useEffect(()=>{
      console.log(data.length, dataSearch.length)
      if (!process.env.NEXT_PUBLIC_DB_HOST) {
        console.log('env')
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
    },[data,dataSearch])

    const refreshProducts = () => {
      setSearch(prevData=>'')
      getProduct(query.skip, query.limit)
    };

    const lastElementRef = useCallback(
      (node: HTMLLIElement | null) => {
          if (loading) {
            return 
          };
          if (observer.current) observer.current.disconnect();
          observer.current = new IntersectionObserver(entries => {
            console.log('0')
              if (entries[0].isIntersecting) {
                console.log('1')
                  if (search === '') {
                    console.log('2', data.length, longArray)
                      if (data.length < longArray) {
                        console.log('3')
                        setQuery(prevData => ({ skip: prevData.skip + 25, limit: prevData.limit }));
                      }
                  }
              }
          });
          if (node) observer.current.observe(node);
      },
      [loading, search]
  );

  return (
    <main style={{display: 'flex', flexDirection: 'column', flex: 1}}>
      {
        <>
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1}} >
              <div style={{display: 'flex', width: '100%', padding: '0px 15px'}}>
                <Search name='search' placeHolder={'Buscar productos'} type='text' value={search} onChange={searchProduct} />
                <Button text='Actualizar' onClick={()=>setOpenUpdatePrice(true)}/>
                <Button text='Nuevo' onClick={()=>setOpenNewProduct(true)}/>
              </div>
              <ListProduct>
                  {
                    search !== '' ?
                      dataSearch.length !== 0 ? 
                        dataSearch.map((item: any, index: any)=>{
                          return <ItemsProducts  key={index} item={item} onClick={()=>{setSelectProduct(item);setOpenModalProduct(true)}}/>
                        })
                        : 'NO HAY PRODUCTOS'
                    :
                      data.length !== 0 ? 
                      data.map((item: any, index: any)=>{
                        return <ItemsProducts  key={index} item={item} onClick={()=>{setSelectProduct(item);setOpenModalProduct(true)}}/>
                      })
                      : 'NO HAY PRODUCTOS'
                  }
                  <li style={{listStyle: 'none', padding: 0, margin: 0}} ref={lastElementRef}>FINAL</li>
              </ListProduct>
          </div>
          {
            openModalProduct &&
            <ModalProduct open={openModalProduct} handleClose={()=>setOpenModalProduct(false)} product={selectProduct} ></ModalProduct>
          }
          {
            openNewProduct &&
            <NewProduct open={openNewProduct} handleClose={()=>setOpenNewProduct(false)} ></NewProduct>
          }
          {
            openUpdatePrice && 
            <UpdatePrice open={openUpdatePrice} handleClose={()=>setOpenUpdatePrice(false)} updateQuery={()=>refreshProducts()} />
          }
        </>
      }
    </main>
  )
}

const ListProduct = styled.ul `
  display: flex;
  flex: 1;
  width: 100%;
  flex-direction: column;
  padding: 0 15px;
  overflow: scroll;
  max-height: 82vh;
`

 