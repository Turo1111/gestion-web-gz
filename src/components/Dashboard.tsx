import React, { useEffect, useState } from 'react'
import Logo from './Logo'
import styled from 'styled-components'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation';
import useLocalStorage from '@/hooks/useLocalStorage';
import { getUser, setUser } from '@/redux/userSlice';
import { useAppDispatch } from '@/redux/hook';
import { useSelector } from 'react-redux';

export default function Dashboard({children}: any) {

    const itemsLi = ["HOME", "PRODUCT", "SALE", "BUY"]
    const pathname = usePathname()
    const [isClient, setIsClient] = useState(false)

    const user = useSelector(getUser)
    const [valueStorage , setValue, clearValue] = useLocalStorage("user", "")
    const dispatch = useAppDispatch();
    const router = useRouter()

    useEffect(() => {
      if (!user && valueStorage) {
        dispatch(setUser(valueStorage))
      }
      if (!valueStorage) {
        router.push('/')
      }
      setIsClient(true)
    }, [valueStorage, user, dispatch, router])

  return (
    <div style={{display: 'flex', width: '100%', flex: 1}}>
        {
            pathname !== '/' &&
            <LeftDash>
                <Logo/>
                <ul>
                    {
                        itemsLi.map((item, index)=>{
                            console.log(pathname, item, pathname === item)
                            return(
                            <Link href={"/"+(item.toLowerCase().split(' ').join(''))} style={{textDecoration: 'none'}}  key={index}> 
                                <ItemLi isSelect={pathname === "/"+(item.toLowerCase().split(' ').join('')) ? true : false} >{item}</ItemLi>
                            </Link>

                        )})
                    }
                </ul>
            </LeftDash>
        }
        <div style={{display: 'flex', flexDirection: 'column', flex: 1}}>
            {
                pathname !== '/' &&
                <div style={{display: 'flex', backgroundColor: '#f1f1f1', justifyContent: 'space-between', padding: 15, alignItems: 'center', color: '#252525'}}>
                    <h2>{pathname}</h2>
                    {
                      isClient && (
                        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                          <label style={{fontSize: 18, fontWeight: 600, marginRight: 15}}>Bienvenido {valueStorage?.user}</label>
                          <SignOut onClick={() => {clearValue(); router.push('/')}}>Cerrar sesion</SignOut>
                        </div>
                      )
                    }
                </div>
            }
            <div style={{display: 'flex', flex: 1, flexDirection: 'column'}}>
                {children}
            </div>
        </div>
       
    </div>
  )
}

const SignOut = styled.h2`
    font-size: 14px;
    font-weight: 400;
    color: '#7F8487';
    cursor: pointer;
    &:hover{
        color: #8294C4;
    }
`

const LeftDash = styled.div `
    height: 100vh;
    background-color: #d9d9d9;
    padding: 5px 0px;
`

interface ItemLi {
    isSelect: boolean
}

const ItemLi = styled.li<ItemLi> `
    list-style: none;
    font-weight: 600;
    font-size: 16px;
    margin: 15px 0;
    padding: 15px;
    border-bottom: 1px solid white;
    background-color: ${({ isSelect }) => (isSelect ? '#3764A0' : 'none')};
    color: ${({ isSelect }) => (isSelect ? 'white' : '#252525')};
    cursor: pointer;
    &:hover{
        background-color: #3764A0;
        color: white;
    }
`
