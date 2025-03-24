/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import Button from '@/components/Button';
import ButtonUI from '@/components/ButtonUI';
import Loading from '@/components/Loading';
import FilterProduct from '@/components/products/FilterProduct';
import ItemsProducts from '@/components/products/ItemsProducts';
import ModalProduct from '@/components/products/ModalProduct';
import NewProduct from '@/components/products/NewProduct';
import PrintProduct from '@/components/products/PrintProduct';
import UpdatePrice from '@/components/products/UpdatePrice';
import Search from '@/components/Search';
import useLocalStorage from '@/hooks/useLocalStorage';
import { Product } from '@/interfaces/product.interface';
import { useAppDispatch } from '@/redux/hook';
import { getLoading, setLoading } from '@/redux/loadingSlice';
import { getUser, setUser } from '@/redux/userSlice';
import apiClient from '@/utils/client';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { useRouter } from 'next/navigation';
import React, { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react'
import { MdEdit, MdInfo } from 'react-icons/md';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import styled from 'styled-components';

interface CBP {
  _id: (string | number) 
  descripcion: string
}


export default function ProductScreen() {

    const [search, setSearch] = useState<string>('')
    const [data, setData] = useState<Product[] | []>([])
    const [valueStorage , setValue] = useLocalStorage("user", "")
    const [dataSearch, setDataSearch] = useState<Product[] | []>([])
    const [query, setQuery] = useState<{skip: number, limit: number}>({skip: 0, limit: 25})
    const [selectProduct, setSelectProduct] = useState<Product | undefined>(undefined)
    const [openModalProduct, setOpenModalProduct] = useState<boolean>(false)
    const observer = useRef<IntersectionObserver | null>(null);
    const {open: loading} = useSelector(getLoading)
    const [openNewProduct, setOpenNewProduct] = useState<boolean>(false)
    const router: AppRouterInstance = useRouter()
    const [longArray, setLongArray] = useState<number>(0)
    const [openUpdatePrice, setOpenUpdatePrice] = useState<boolean>(false)
    const [openPrintProduct, setOpenPrintProduct] = useState<boolean>(false)
    const [activeCategorie, setActiveCategorie] = useState<CBP>({_id: 1 , descripcion: 'Todas'})
    const [activeBrand, setActiveBrand] = useState<CBP>({_id: 1 , descripcion: 'Todas'})
    const [activeProvider, setActiveProvider] = useState<CBP>({_id: 1 , descripcion: 'Todas'})
    const [openModalFilter, setOpenModalFilter] = useState<boolean>(false)

    const user = useSelector(getUser)
    const dispatch = useAppDispatch();

    useEffect(() => {
      if (!user && valueStorage) {
        dispatch(setUser(valueStorage))
      }
    }, [valueStorage, user, dispatch])

    const searchProduct = (e: ChangeEvent<HTMLInputElement>) => {
        setSearch(prevData=>e.target.value)
    }    

    useEffect(()=>{

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
                const newData = response.data.array.filter((element: Product) => {
                    return prevData.findIndex((item: Product) => item._id === element._id) === -1;
                });
    
                return [...prevData, ...newData];
            })
            setLongArray(prevData=>response.data.longitud)
            dispatch(setLoading(false));
        } catch (e) {
            console.log("error", e);
            dispatch(setLoading(false));
        } finally {
          dispatch(setLoading(false));
        }
    }
      if (valueStorage) {
        getProduct(query.skip, query.limit)
      }
      
    },[dispatch, query, valueStorage]) 

    useEffect(()=>{

      const getProductSearch = async (input: string, categorie: CBP['_id'], brand: CBP['_id'], provider: CBP['_id']) => {
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
    
      if ( search !== '' || activeBrand._id !== 1 || activeCategorie._id !== 1 || activeProvider._id !== 1) {
        getProductSearch(search, activeCategorie._id, activeBrand._id, activeProvider._id)
      }
    },[search, activeBrand, activeCategorie, activeProvider, dispatch]) 


    useEffect(()=>{
      if (!process.env.NEXT_PUBLIC_DB_HOST) {
        return
      }
      const socket = io(process.env.NEXT_PUBLIC_DB_HOST)
      socket.on(`product`, (socket) => {
        setSearch(prevData=>'')
        setData((prevData: Product[])=>{
          const exist = prevData.find((elem: Product) => elem._id === socket.data._id )
          if (exist) {
            return prevData.map((item: Product) =>
              item._id === socket.data._id ? socket.data : item
            )
          }
          return [...prevData]
        })
      })
      return () => {
        socket.disconnect();
      }; 
    },[data, dataSearch])

    
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
      [loading, search, data.length, longArray]
    );

  return (
    <main style={{display: 'flex', flexDirection: 'column', flex: 1}}>
      {
        <>
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1}} >
              <WrapperSearch>
                <Search name='search' placeHolder={'Buscar productos'} type='text' value={search} onChange={searchProduct}/*  onClickFilter={()=>setOpenModalFilter(true)} */ />
                <WrapperButtons>
                  <ButtonUI label='IMPRIMIR' onClick={()=>{
                    setOpenPrintProduct(true)
                  }}/>
                  <ButtonUI label='ACTUALIZAR' onClick={()=>setOpenUpdatePrice(true)} />
                  <ButtonUI label='NUEVO' onClick={()=>setOpenNewProduct(true)} />
                </WrapperButtons>
              </WrapperSearch>
              <FilterProduct open={openModalFilter} handleClose={()=>setOpenModalFilter(false)} 
              activeBrand={activeBrand} activeCategorie={activeCategorie} activeProvider={activeProvider}
              selectCategorie={(item: CBP)=>setActiveCategorie(prevData=>item)}
              selectBrand={(item: CBP)=>setActiveBrand(prevData=>item)}
              selectProvider={(item: CBP)=>setActiveProvider(prevData=>item)}
              />
              <ListProduct >
                  {
                    search !== '' || activeBrand._id !== 1 || activeCategorie._id !== 1 || activeProvider._id !== 1 ?
                      dataSearch.length !== 0 ? 
                        dataSearch.map((item: Product, index: number)=>{
                          return <ItemsProducts  key={index} item={item} onClick={()=>{setSelectProduct(prevData=>item);setOpenModalProduct(true)}}/>
                        })
                        : 'NO HAY PRODUCTOS'
                    :
                      data.length !== 0 ? 
                      data.map((item: Product, index: number)=>{
                        return <ItemsProducts  key={index} item={item} onClick={()=>{setSelectProduct(prevData=>item);setOpenModalProduct(true)}}/>
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
            (selectProduct !== undefined) &&
            <ModalProduct open={openModalProduct} handleClose={()=>setOpenModalProduct(false)} product={selectProduct} ></ModalProduct>
          }
          {
            openNewProduct &&
            <NewProduct open={openNewProduct} handleClose={()=>setOpenNewProduct(false)} ></NewProduct>
          }
          {
            openUpdatePrice &&
            <UpdatePrice open={openUpdatePrice} handleClose={()=>setOpenUpdatePrice(false)} />
          }
          {
             openPrintProduct &&
            <PrintProduct open={openPrintProduct} handleClose={()=>setOpenPrintProduct(false)} />
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
    margin: 5px 0;
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

 