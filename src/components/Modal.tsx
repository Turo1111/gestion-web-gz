import React, { useRef } from "react"
import { AiOutlineClose } from "react-icons/ai"
import styled, { keyframes } from "styled-components"
import { CSSTransition } from "react-transition-group"
import useOutsideClick from "@/hooks/useOutsideClick"

const Modal = ({
  children,
  open = false,
  eClose,
  title,
  borderRadius = false,
  width = "30%",
  height = "35%",
  outside = true
}:{
  children?: React.ReactNode,
  open: boolean,
  eClose: ()=>void,
  title: string,
  modalButton?: boolean,
  onButton1?: void,
  onButton2?: void,
  borderRadius?: boolean,
  width?: string,
  height?: string
  outside?: boolean
}) => {

  const modalRef = useRef(null);

  outside && useOutsideClick(modalRef, eClose);

  return (
    <CSSTransition in={open} timeout={300} classNames="modal-transition" unmountOnExit>
      <Container >
        <Content
          $borderRadius={borderRadius}
          width={width}
          height={height}
          ref={modalRef}
        >
          <ModalHeader title={title}>
            <Header>
              <Title>
                {title}
              </Title>
            </Header>
            <IconWrapper onClick={eClose}>
              <AiOutlineClose/>
            </IconWrapper>
          </ModalHeader>
          <ModalContent>
            {children}
          </ModalContent>
        </Content>
      </Container>
    </CSSTransition>
  )
}

export default Modal

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(100%);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideOut = keyframes`
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(100%);
  }
`;

const Container = styled.div`
  display: flex;
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

interface ContentProps {
  $borderRadius?: boolean;
  width?: string;
  height?: string;
}

const Content = styled.div<ContentProps>`
  background-color: white;
  border: 1px solid #888;
  width: ${props => props.width && props.width};
  height: ${props => props.height && props.height};
  border-radius: ${props => (props.$borderRadius ? "10px" : "0")};
  position: relative;
  max-width: 1240px;
  max-height: 720px;
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  animation-duration: 1s;
  animation-fill-mode: forwards;

  &.modal-transition-enter {
    animation-name: ${slideIn};
  }

  &.modal-transition-exit {
    animation-name: ${slideOut};
  }

  @media only screen and (max-width: 1024px) {
    width: 80%;
  }
  @media only screen and (max-width: 768px) {
    height: auto;
    width: 95%;
    min-width: 100%;
    max-height: 90%;
  }
`;

const IconWrapper = styled.div`
  margin: 0 10px;
  font-size: 15px;
  text-align: end;
  cursor: pointer;
  :hover {
    color: #ff7878;
  }
`;

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 0 20px;
  overflow-y: scroll;
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
  }
  @media only screen and (max-width: 768px) {
    padding: 5px;
    overflow-y: scroll;
  }
`;

interface ModalHeaderProps {
  title?: string;
}

const ModalHeader = styled.div<ModalHeaderProps>`
  display: ${props => (props.title ? "flex" : "none")};
  justify-content: space-between;
  padding: 10px;
  align-items: center;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  border-bottom: 1px solid #d9d9d9;
  @media only screen and (max-width: 1023px) {
    padding: 5px;
  }
`;

const Header = styled.div`
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  padding: 0 10px;
  @media only screen and (max-width: 1023px) {
    height: 20px;
  }
`;

const Title = styled.div`
  font-size: 16px;
  margin: 0 10px;
  display: flex;
  align-items: center;
  color: #716a6a;
  font-weight: bold;
  @media only screen and (max-width: 1440px) {
    font-size: 23px;
  }
  @media only screen and (max-width: 1366px) {
    font-size: 18px;
  }
  @media only screen and (max-width: 1024px) {
    font-size: 16px;
  }
  @media only screen and (max-width: 445px) {
    font-size: 14px;
  }
`;
