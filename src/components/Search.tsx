import React, {useState} from 'react'
import styled from 'styled-components'
import { IoMdSearch } from "react-icons/io";

export default function Search({ type, value, onChange, name, placeHolder }: {
  type: string,
  value: any,
  onChange: any,
  name: string,
  placeHolder: string
}) {

  const [isFocused, setIsFocused] = useState<boolean>(false)

  const handleInputFocus = () => {
    setIsFocused(true);
  };

  return (
    <div style={{width: '100%', padding: '0 20%'}} >
      <InputWrapper>
          <IconWrapper>
              <IoMdSearch/>
          </IconWrapper>
          <Input 
            placeholder={placeHolder}
            focused={isFocused} 
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            onFocus={handleInputFocus}
          />
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
`

const Input = styled.input<{ focused?: boolean; }> `
  height: 35px;
  padding: 10px 25px;
  font-size: 16px;
  color: ${props => props.color};
  border-radius: 10px;
  border: ${({ focused }) => (focused ? '2px solid #7286D3' : '1px solid #d9d9d9')};
  transition: border-color 0.2s ease-in-out;
  padding-left: 50px;
  &:focus {
    outline: none;
  }
`

const IconWrapper = styled.div`
  position: absolute;
  top: 8px;
  left: 25px;
  font-size: 20px;
  color: ${props => props.color};
  display: flex;
  align-items: center;
`;
