'use client'
import Button from '@/components/Button';
import Loading from '@/components/Loading';
import FilterProduct from '@/components/products/FilterProduct';
import ItemsProducts from '@/components/products/ItemsProducts';
import ModalProduct from '@/components/products/ModalProduct';
import NewProduct from '@/components/products/NewProduct';
import PrintProduct from '@/components/products/PrintProduct';
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
    const [openPrintProduct, setOpenPrintProduct] = useState(false)
    const [activeCategorie, setActiveCategorie] = useState({_id: 1 , descripcion: 'Todas'})
    const [activeBrand, setActiveBrand] = useState({_id: 1 , descripcion: 'Todas'})
    const [activeProvider, setActiveProvider] = useState({_id: 1 , descripcion: 'Todas'})
    const [openModalFilter, setOpenModalFilter] = useState(false)

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

  const getProductSearch = async (input: string, categorie: any, brand: any, provider: any) => {
    dispatch(setLoading(true))
    try {
        const response = await apiClient.post(`/product/search`, {input, categoria: categorie, marca: brand, proveedor: provider});
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
      if ( search !== '' || activeBrand._id !== 1 || activeCategorie._id !== 1 || activeProvider._id !== 1) {
        getProductSearch(search, activeCategorie._id, activeBrand._id, activeProvider._id)
      }
    },[search, activeBrand, activeCategorie, activeProvider]) 

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
      [loading, search, data]
  );

  return (
    <main style={{display: 'flex', flexDirection: 'column', flex: 1}}>
      {
        <>
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1}} >
              <WrapperSearch>
                <Search name='search' placeHolder={'Buscar productos'} type='text' value={search} onChange={searchProduct} onClickFilter={()=>setOpenModalFilter(true)} />
                <WrapperButtons>
                  <Button text='Imprimir' onClick={()=>setOpenPrintProduct(true)}/>
                  <Button text='Actualizar' onClick={()=>setOpenUpdatePrice(true)}/>
                  <Button text='Nuevo' onClick={()=>setOpenNewProduct(true)}/>
                </WrapperButtons>
              </WrapperSearch>
              <ListProduct>
                  {
                    search !== '' || activeBrand._id !== 1 || activeCategorie._id !== 1 || activeProvider._id !== 1 ?
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
                  {
                    search !== '' || activeBrand._id !== 1 || activeCategorie._id !== 1 || activeProvider._id !== 1 ?
                    <></>:
                    <li style={{listStyle: 'none', padding: 0, margin: 0, minHeight: '1px'}} ref={lastElementRef}></li>
                  }
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
          {
            openPrintProduct && 
            <PrintProduct open={openPrintProduct} handleClose={()=>setOpenPrintProduct(false)} />
          }
          {
            openModalFilter &&
            <FilterProduct open={openModalFilter} handleClose={()=>setOpenModalFilter(false)} 
              activeBrand={activeBrand._id} activeCategorie={activeCategorie._id} activeProvider={activeProvider._id}
              selectCategorie={(item: any)=>setActiveCategorie(prevData=>item)}
              selectBrand={(item: any)=>setActiveBrand(prevData=>item)}
              selectProvider={(item: any)=>setActiveProvider(prevData=>item)}
            />
          }
        </>
      }
    </main>
  )
}

const WrapperSearch = styled.div `
  display: flex; 
  width: 100%; 
  padding: 0px 15px; 
  align-items: center;
  @media only screen and (max-width: 500px) {
    flex-direction: column
  }
`

const WrapperButtons = styled.div `
  display: flex; 
  padding: 0px 15px; 
  align-items: center;
  @media only screen and (max-width: 500px) {
    width: 100%; 
    justify-content: center;
  }
`

const ListProduct = styled.ul `
  display: flex;
  flex: 1;
  width: 100%;
  flex-direction: column;
  padding: 0 15px;
  overflow: scroll;
  max-height: 82vh;
`

 