/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import React, { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react'
import Search from '../../../../components/Search';
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
import FindProductSale from '@/components/sale/FindProductSale';
import LineaVenta from '@/components/sale/LineaVenta';
import { useResize } from '@/hooks/useResize';
import { ExtendItemSale, ItemSale, Sale } from '@/interfaces/sale.interface';
import { Product } from '@/interfaces/product.interface';
import { Types } from 'mongoose';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import Confirm from '@/components/Confirm';
import { resetSale, setSale } from '@/redux/saleSlice';
import ContainerSaleWeb from '@/components/sale/ContainerSaleWeb';
import ContainerSaleMobile from '@/components/sale/ContainerSaleMobile';

interface ResponseSale {
  r: Sale
  itemsSale: ExtendItemSale[]
}

export default function EditSale({ params }: { params: { id: string } }) {

  const [valueStorage, setValue] = useLocalStorage("user", "")
  const router: AppRouterInstance = useRouter()
  let { ancho, alto } = useResize()
  const { id } = params;

  const user = useSelector(getUser)
  const dispatch = useAppDispatch();

  const getSale = async () => {
    dispatch(setLoading(true))
    apiClient.get(`/sale/${id}`, {
      headers: {
        Authorization: `Bearer ${valueStorage.token}`
      },
    })
      .then(({ data }: { data: ResponseSale }) => {
        console.log('data', data)
        dispatch(setLoading(false));
        dispatch(setSale({ sale: { _id: id, cliente: data.r.cliente, createdAt: data.r.createdAt, estado: data.r.estado, total: data.r.total, itemsSale: data.itemsSale } }));
      })
      .catch((e) => {
        console.log(e);
        dispatch(setLoading(false))
      })
  }

  useEffect(() => {
    getSale()
  }, [id, valueStorage])

  return (
    <Container>
      {
        ancho > 940 ?
          <ContainerSaleWeb edit={true} />
          :
          <ContainerSaleMobile edit={true} />
      }
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  flex: 1;
  @media only screen and (max-width: 940px) {
    flex-direction: column;
  }
`