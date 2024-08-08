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

export default function Home() {

  const user = useSelector(getUser)
  const [valueStorage , setValue] = useLocalStorage("user", "")
  const dispatch = useAppDispatch();
  const router = useRouter()

  useEffect(() => {
    if (!user && valueStorage) {
      dispatch(setUser(valueStorage))
    }
    if (!valueStorage) {
      router.push('/')
    }
  }, [valueStorage, user, dispatch])
  
  return (
    <div style={{display: 'flex', flexDirection: 'column'}} >
    </div>
  )
}

const ItemLista = styled.li `
  font-size: 18px;
  font-weight: 600;
  padding: 15px;
  border: solid 1px #d9d9d9;
  width: 400px;
  list-style: none;
  border-radius: 10px;
  cursor: pointer;
  &:hover {
    color: white;
    background-color: #83B4FF;
  }
`

const Lista = styled.ul `
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 15px;
`

const LogOut = styled.button `
  margin: 0 15px;
  margin-left: 150px;
  padding: 0;
  border: 0;
  color: #83B4FF;
  background: none;
  font-weight: 600;
  font-size: 16px;
`
