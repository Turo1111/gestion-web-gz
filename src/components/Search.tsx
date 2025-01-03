import React, {ChangeEvent, useEffect, useState} from 'react'
import styled from 'styled-components'
import { IoMdSearch } from "react-icons/io";
import { IoOptionsOutline } from 'react-icons/io5';

export default function Search({ type, value, onChange, name, placeHolder, onClickFilter=undefined }: {
  type: string,
  value: string,
  onChange: (e: ChangeEvent<HTMLInputElement>)=>void,
  name: string,
  placeHolder: string,
  onClickFilter?: ()=>void
}) {

  const [isFocused, setIsFocused] = useState<boolean>(false)

  useEffect(()=>{console.log(isFocused)},[isFocused])

  return (
      <InputWrapper>
          <Input 
            placeholder={placeHolder}
            $focused={isFocused}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            onFocus={()=>setIsFocused(true)}
            onBlur={()=>setIsFocused(false)}
          />
          <IconWrapper style={{right: 55, top: 10, color: '#6B7280', borderRight: '1px solid #d9d9d9', paddingRight: 5}}>
              <IoMdSearch/>
          </IconWrapper>
          {
            onClickFilter &&
            <WrapperFilter onClick={onClickFilter}>
              <IoOptionsOutline />
            </WrapperFilter>
          }
      </InputWrapper>
  )
}

const InputWrapper = styled.div `
    position: relative;
    text-align: center;
    display: flex;
    flex-direction: column;
    margin: 15px 0;
    width: 100%;
    padding: 0 15px;
    @media only screen and (max-width: 500px) {
      margin: 10px 0;
    }
`

const Input = styled.input<{ $focused?: boolean }> `
  height: 45px;
  padding: 15px;
  font-size: 16px;
  color: ${props => props.color};
  border-radius: 10px;
  border: ${({ $focused }) => ($focused ? '2px solid #7286D3' : '1px solid #d9d9d9')};
  transition: border-color 0.2s ease-in-out;
  padding-left: 15px;
  &:focus {
    outline: none;
  }
`

const IconWrapper = styled.div`
  position: absolute;
  font-size: 25px;
  color: ${props => props.color};
  display: flex;
  align-items: center;
`;

const WrapperFilter = styled(IconWrapper) `
  cursor: pointer; 
  color: #6B7280;
  right: 22px;
  top: 10px;
  transition: background-color .5s linear, font-size .5s linear, color 1s linear;
  &:hover {
    font-size: 26px;
    color: #6A5BCD;
    background-color: rgba(217, 217, 217, 0.5);
    padding: 6px 4px;
    top: 4px;
    right: 18px;
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
  }
`