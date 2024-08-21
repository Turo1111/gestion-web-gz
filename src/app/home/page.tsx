'use client'
import { getUser, setUser } from '@/redux/userSlice'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import useLocalStorage from '@/hooks/useLocalStorage';
import { useAppDispatch } from '@/redux/hook';
import Logo from '@/components/Logo';
import styled from 'styled-components';
import Link from 'next/link';
import { UserWithToken } from '@/interfaces/auth.interface';
import { useRouter } from 'next/navigation';
import Loading from '@/components/Loading';
import Button from '@/components/Button';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

export default function Home() {

  const user = useSelector(getUser)
  const [valueStorage , setValue] = useLocalStorage("user", "")
  const dispatch = useAppDispatch();
  const router: AppRouterInstance = useRouter()

  useEffect(() => {
    if (!user && valueStorage) {
      dispatch(setUser(valueStorage))
    }
    if (!valueStorage) {
      router.push('/')
    }
  }, [valueStorage, user, dispatch, router])
  
  return (
    <div style={{display: 'flex', flexDirection: 'column'}} >
      <Button text='Boton confirm' onClick={()=>console.log('')} />
    </div>
  )
}
