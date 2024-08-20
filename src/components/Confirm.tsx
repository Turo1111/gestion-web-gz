


import { useAppDispatch, useAppSelector } from "../redux/hook";
import { useEffect } from "react";
import styled from "styled-components";
import { AiOutlineClose } from "react-icons/ai";
import Button from "./Button";

export default function Confirm({open, message, handleClose, handleConfirm}:{open: boolean, message:string, handleClose: ()=>void, handleConfirm: ()=>void}) {

  return (
    <Container $open={open} >
        <div style={
            {
              display: "flex",
              flex: 1,
              padding: 15,
              position: 'absolute',
              flexDirection: "column",
              borderRadius: 15,
              color: '#F9F5F6',
              textAlign: 'center',
              marginTop: 50,
              zIndex: 100,
              backgroundColor: 'white',
              maxWidth: 300
            }
        } >
          <ContentHeader>
            <Header>
              <Title>
                ¿Quiere confirmar?
              </Title>
            </Header>
            <IconWrapper>
              <AiOutlineClose/>
            </IconWrapper>
          </ContentHeader>
          <WrapperContent>
            {message || 'Esto es una alerta'}
          </WrapperContent>
          <div style={{display: "flex", justifyContent:"space-between"}}>
            <Button text="Cancelar" onClick={handleClose} />
            <Button text="Aceptar" onClick={handleConfirm} />
          </div>
        </div>
    </Container>
    )
}

const Container = styled.div<{$open: boolean}>`
  display: ${({ $open }) => ($open ? 'flex' : 'none')};
  position: fixed;
  z-index: 2;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.4);
  justify-content: center;
  align-items: center;
`;

const ContentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px;
  align-items: center;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  border-bottom: 1px solid #d9d9d9;
`;


const Header = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  padding: 0 10px;
`;

const Title = styled.div`
  font-size: 18px;
  margin: 0 10px;
  display: flex;
  align-items: center;
  color: #252525;
  font-weight: bold;
`;

const IconWrapper = styled.div`
  margin: 0 10px;
  font-size: 15px;
  text-align: end;
  cursor: pointer;
  color: #252525;
  :hover {
    color: #ff7878;
  }
`;

const WrapperContent = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 20px;
  overflow-y: scroll;
  color: #252525;/* 
  ::-webkit-scrollbar {
      width: 5px;
  }
  ::-webkit-scrollbar-track {
      box-shadow: inset 0 0 6px rgba(0,0,0,0.3); 
      border-radius: 10px;
  }
  ::-webkit-scrollbar-thumb {
      border-radius: 10px;
      box-shadow: inset 0 0 6px rgba(0,0,0,0.5); 
  } */
`;