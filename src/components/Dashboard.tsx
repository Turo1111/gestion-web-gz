import React from 'react'
import Logo from './Logo'
import styled from 'styled-components'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation';
import useLocalStorage from '@/hooks/useLocalStorage';

export default function Dashboard({children}: any) {

    const itemsLi = ["Home", "Product", "Sale", "Buy"]
    const pathname = usePathname()
    const [valueStorage , setValue, clearValue] = useLocalStorage("user", "")
    const router = useRouter()

  return (
    <div style={{display: 'flex', width: '100%', flex: 1}}>
        <LeftDash>
            <Logo/>
            <ul>
                {
                    itemsLi.map((item, index)=>(
                        <Link href={"/"+(item.toLowerCase().split(' ').join(''))} style={{textDecoration: 'none'}}  key={index}> 
                            <ItemLi>{item}</ItemLi>
                        </Link>

                    ))
                }
            </ul>
        </LeftDash>
        <div style={{display: 'flex', flexDirection: 'column', flex: 1}}>
            <div style={{display: 'flex', height: 80, backgroundColor: '#f1f1f1', justifyContent: 'space-between'}}>
                {/* header */}
                <h2>{pathname}</h2>
                <h2 onClick={()=>{clearValue();router.push('/')}} >cerrar sesion</h2>
            </div>
            <div style={{display: 'flex', flex: 1, flexDirection: 'column'}}>
                {children}
            </div>
        </div>
       
    </div>
  )
}

const LeftDash = styled.div `
    height: 100vh;
    background-color: #d9d9d9;
    padding: 5px 0px;
`

const ItemLi = styled.li `
    list-style: none;
    font-weight: 600;
    font-size: 16px;
    margin: 15px 0;
    padding: 15px;
    cursor: pointer;
    &:hover{
        background-color: white;
    }
`
