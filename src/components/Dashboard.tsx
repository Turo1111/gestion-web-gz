import React, { useEffect, useState } from 'react'
import Logo from './Logo'
import styled from 'styled-components'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation';
import useLocalStorage from '@/hooks/useLocalStorage';
import { getUser, setUser } from '@/redux/userSlice';
import { useAppDispatch } from '@/redux/hook';
import { useSelector } from 'react-redux';
import { useResize } from '@/hooks/useResize';
import { BiMenu } from 'react-icons/bi';
import { MdMenuOpen } from 'react-icons/md';

export default function Dashboard({children}: any) {

    /* const itemsLi = ["HOME", "PRODUCT", "SALE", "BUY"] */
    const itemsLi = [
        {path: 'HOME', name: 'INICIO'},
        {path: 'PRODUCT', name: 'PRODUCTOS'},
        {path: 'SALE', name: 'VENTAS'},
        {path: 'BUY', name: 'COMPRAS'}
    ]
    const pathname = usePathname()
    const [isClient, setIsClient] = useState(false)
    let {ancho, alto} = useResize()

    const user = useSelector(getUser)
    const [valueStorage , setValue, clearValue] = useLocalStorage("user", "")
    const dispatch = useAppDispatch();
    const router = useRouter()
    const [openMenu, setOpenMenu] = useState(false)

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
    <div style={{display: 'flex', flexDirection: 'column', flex: 1, height: '100vh'}}>
        {
            ancho > 940 ?
            <ContainerBig>
                {
                    pathname !== '/' &&
                    <LeftDash>
                        <Logo/>
                        <ul>
                            {
                                itemsLi.map((item, index)=>{
                                    return(
                                    <Link href={"/"+(item.path.toLowerCase().split(' ').join(''))} style={{textDecoration: 'none'}}  key={index}> 
                                        <ItemLi $isSelect={pathname === "/"+(item.path.toLowerCase().split(' ').join(''))}>
                                            {item.name}
                                        </ItemLi>
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
            </ContainerBig>
            :
            <ContainerSmall>
                {
                    pathname !== '/' &&
                    <Header>
                        {
                            !openMenu ? 
                            <IconWrapper onClick={()=>setOpenMenu(true)}>
                                <BiMenu/>
                            </IconWrapper>:
                            <IconWrapper onClick={()=>setOpenMenu(false)}>
                                <MdMenuOpen />
                            </IconWrapper>
                        }
                        <div style={{display: 'flex', justifyContent: 'center', flex: 1}} >
                            <Logo small={true}/>
                        </div>
                    </Header>
                }
                {
                    openMenu &&
                    <LeftDash>
                        <ul>
                            {
                                itemsLi.map((item, index)=>{
                                    const isSelect = pathname === "/"+(item.path.toLowerCase().split(' ').join(''))
                                    return(
                                    <Link href={"/"+(item.path.toLowerCase().split(' ').join(''))} style={{textDecoration: 'none'}}  key={index} onClick={()=>setOpenMenu(false)}> 
                                        <ItemLi $isSelect={isSelect} >{item.name}</ItemLi>
                                    </Link>
                                )})
                            }
                        </ul>
                        <SignOut onClick={() => {clearValue(); router.push('/');setOpenMenu(false)}}>Cerrar sesion</SignOut>
                    </LeftDash>
                }
                <div style={{display: 'flex', flex: 1, flexDirection: 'column'}}>
                    {children}
                </div>
            </ContainerSmall>
        }
    </div>
  )
}

const Header = styled.div`
    width: 100%;
    display: flex;
    background-color: #d9d9d9;
`

const ContainerSmall = styled.div `
    width: 100%;
    display: none;
    flex:1;
    position: relative;
    @media only screen and (max-width: 940px) {
        display: flex;
        flex-direction: column;
        flex: 1;
    }
`

const IconWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 32px;
    color: #716A6A;
    padding: 5px 15px;
    margin: 0px 5px;
    border-left: 1px solid #d9d9d9;
    cursor: pointer;
    &:hover {
        background-color: #d9d9d9;
    }
`

const ContainerBig = styled.div `
    width: 100%;
    display: flex;
    flex:1;
    @media only screen and (max-width: 940px) {
        display: none
    }
`

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
    position: relative;
    @media only screen and (max-width: 940px) {
        position: absolute;
        z-index: 2;
        top: 60px;
    }
`

interface ItemLiProps {
    $isSelect: boolean;
}

const ItemLi = styled.li<ItemLiProps>`
    list-style: none;
    font-weight: 600;
    font-size: 16px;
    margin: 15px 0;
    padding: 15px;
    border-bottom: 1px solid white;
    background-color: ${({ $isSelect }) => ($isSelect ? '#3764A0' : 'none')};
    color: ${({ $isSelect }) => ($isSelect ? 'white' : '#252525')};
    cursor: pointer;
    &:hover {
        background-color: #3764A0;
        color: white;
    }
`;
