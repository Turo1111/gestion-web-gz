/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import React from 'react'
import { getUser, setUser } from '@/redux/userSlice';
import { useAppDispatch } from '@/redux/hook';
import { useSelector } from 'react-redux';
import useLocalStorage from '@/hooks/useLocalStorage';
import styled from 'styled-components';
import { useRouter } from 'next/navigation';
import { useResize } from '@/hooks/useResize';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import ContainerBuyWeb from '@/components/buy/ContainerBuyWeb';

export default function NewBuy() {

    const [valueStorage , setValue] = useLocalStorage("user", "")
    const router: AppRouterInstance = useRouter()
    let {ancho, alto} = useResize()

    const user = useSelector(getUser)
    const dispatch = useAppDispatch();

  return (
    <Container>
      {
        ancho > 940 ?
        <ContainerBuyWeb/>
        :
        <div>

        </div>
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