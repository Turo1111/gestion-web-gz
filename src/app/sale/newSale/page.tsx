/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import React, { ChangeEvent, useEffect, useState } from 'react'
import { getUser, setUser } from '@/redux/userSlice';
import { useAppDispatch } from '@/redux/hook';
import { useSelector } from 'react-redux';
import useLocalStorage from '@/hooks/useLocalStorage';
import styled from 'styled-components';
import { useRouter } from 'next/navigation';
import FindProductSale from '@/components/sale/FindProductSale';
import LineaVenta from '@/components/sale/LineaVenta';
import { useResize } from '@/hooks/useResize';
import Confirm from '@/components/Confirm';
import { ExtendItemSale, ItemSale } from '@/interfaces/sale.interface';
import { Product } from '@/interfaces/product.interface';
import { Types } from 'mongoose';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { BiCart } from 'react-icons/bi';
import ButtonUI from '@/components/ButtonUI';
import { AnimatedNumber } from '@/components/AnimatedNumber';
import ContainerSaleWeb from '@/components/sale/ContainerSaleWeb';
import { resetSale } from '@/redux/saleSlice';
import ContainerSaleMobile from '@/components/sale/ContainerSaleMobile';

export default function NewSale() { 

    let {ancho, alto} = useResize()
    const [valueStorage , setValue] = useLocalStorage("user", "")
    const router: AppRouterInstance = useRouter()
    const user = useSelector(getUser)
    const dispatch = useAppDispatch();

    useEffect(()=>{
      dispatch(resetSale({}))
    }, [router])

  return (
    <Container>
      {
        ancho > 940 ?
        <ContainerSaleWeb  />
       :
        <ContainerSaleMobile />
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
