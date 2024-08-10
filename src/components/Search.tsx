import React, {useState} from 'react'
import styled from 'styled-components'
import { IoMdSearch } from "react-icons/io";
import { IoOptionsOutline } from 'react-icons/io5';

export default function Search({ type, value, onChange, name, placeHolder, onClickFilter=undefined }: {
  type: string,
  value: any,
  onChange: any,
  name: string,
  placeHolder: string,
  onClickFilter?: any
}) {

  const [isFocused, setIsFocused] = useState<boolean>(false)

  const handleInputFocus = () => {
    setIsFocused(true);
  };

  return (
    <div style={{width: '100%'}} >
      <InputWrapper>
          <IconWrapper style={{left: 25}}>
              <IoMdSearch/>
          </IconWrapper>
          <Input 
            placeholder={placeHolder}
            $focused={isFocused ? 1:0}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            onFocus={handleInputFocus}
          />
          {
            onClickFilter &&
            <IconWrapper style={{right: 25, cursor: 'pointer'}} onClick={onClickFilter}>
              <IoOptionsOutline />
            </IconWrapper>
          }
      </InputWrapper>
    </div>
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

const Input = styled.input<{ $focused?: any; }> `
  height: 35px;
  padding: 10px 25px;
  font-size: 16px;
  color: ${props => props.color};
  border-radius: 10px;
  border: ${({ $focused }) => ($focused ? '2px solid #7286D3' : '1px solid #d9d9d9')};
  transition: border-color 0.2s ease-in-out;
  padding-left: 50px;
  &:focus {
    outline: none;
  }
`

const IconWrapper = styled.div`
  position: absolute;
  top: 8px;
  font-size: 20px;
  color: ${props => props.color};
  display: flex;
  align-items: center;
`;
