import useOutsideClick from '@/hooks/useOutsideClick';
import React, { useRef, useState } from 'react'
import { MdKeyboardArrowDown } from "react-icons/md";
import styled, { css } from 'styled-components'

interface CBP {
    _id: (string | number) 
    descripcion: string
  }

export default function SelectBox({text, selected, list, onClick}:{text: string, selected: CBP, list: CBP[], onClick: (item: CBP)=>void}) {

    const [openList, setOpenList] = useState(false)
    const listRef = useRef(null)

    useOutsideClick(listRef, ()=>setOpenList(false));

  return (
    <Container  ref={listRef}  onClick={()=>setOpenList(!openList)} style={{border: `${selected._id !== 1 ? '1px solid #6A5BCD' : '1px solid #d9d9d9'}`}}>
        <Select>
            <Option style={{color: `${selected._id !== 1 ? '#6A5BCD' : '#6B7280'}`}}>
                {
                    selected._id !== 1 ? selected.descripcion : text
                }
            </Option>
            <IconWrapper style={{color: `${selected._id !== 1 ? '#6A5BCD' : '#6B7280'}`}} $open={openList} >
                <MdKeyboardArrowDown />
            </IconWrapper>
        </Select>
        <List $open={openList}>
            {
                list.map((item: CBP, index: number)=>{
                    return <ItemOption key={item._id} onClick={()=>{onClick(item); setOpenList(false)}} >{item.descripcion}</ItemOption>
                })
            }
        </List>
    </Container>
  )
}

const ItemOption = styled.div `
    list-style: none;
    font-size: 14px;
    font-weight: 500;
    margin-bottom: 5px;
    color: #6B7280;
    padding: 2px 15px;
    &:hover {
        color: #6A5BCD;
        background-color: #d9d9d9;
    }
    @media only screen and (max-width: 500px) {
        font-size: 12px;
    }
`

const List = styled.ul<{$open: boolean}> `
    visibility: ${({$open})=>$open ? 'visible' : 'hidden'};
    opacity: ${({$open})=>$open ? '1' : '0'};
    transition: visibility 0s, opacity 0.5s linear;
    flex-direction: column;
    position: absolute;
    width: 100%;
    height: 150px;
    overflow-y: scroll;
    border: 1px solid #d9d9d9;
    border-radius: 15px;
    top: 30px;
    left: 0px;
    background-color: #ffff;
    padding: 5px 0;
    z-index: 1;
`

const Container = styled.div `
    max-width: 315px;
    min-width: 150px;
    padding: 5px 10px;
    border: 1px solid #d9d9d9;
    border-radius: 15px;
    position: relative;
    background-color: #ffff;
    margin: 0 5px;
`

const Select = styled.div `
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
`

const Option = styled.h5 `
    font-size: 14px;
    font-weight: 600;
    color: #6B7280;
    @media only screen and (max-width: 500px) {
        font-size: 12px;
    }
`

const IconWrapper = styled.div<{$open: boolean}> `
    right: -5px;
    position: absolute;
    top:${({$open})=>$open ? '-13px' : '-5px'};
    font-size: 30px;
    color: #6B7280;
    transform: ${({$open})=>$open ? css`rotate(180deg)` : css`rotate(0deg)`};
    transition: transform 0.5s linear, top 0.5s linear;
    @media only screen and (max-width: 500px) {
        font-size: 22px;
        top: -3px;
    }
`