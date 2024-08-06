import Link from 'next/link'
import React, { FormEvent, MouseEventHandler } from 'react'
import styled from 'styled-components'

export default function Button({text, onClick, width='auto', to, type}: {
  text: string;
  onClick: any;
  width?: string | undefined;
  to?: string;
  type?: 'submit' 
}) {
  
  return (
    <div>
      {
        to ?
        <Link href={to}>
          <Btn onClick={onClick} width={width} type={type} >
            {text}
          </Btn>
        </Link>
        :
        <Btn onClick={onClick} width={width} type={type}>
          {text}
        </Btn>
      }
    </div>
  )
}

const Btn = styled.button <{ width?: string }>`
    border: 0;
    background-color: #8294C4;
    padding: 10px 25px;
    border-radius: 10px;
    color: #fff;
    font-size: 14px;
    font-weight: 600;
    width: ${props=>props.width ? props.width : 'auto'};
    margin: 10px 0;
    cursor: pointer;
    :hover{
        background-color: #637195;
    }
`