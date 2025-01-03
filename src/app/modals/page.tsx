'use client'
import React, { useState } from 'react';
import styled, { css, keyframes } from 'styled-components';


const ModalsPage = () => {
  const [activeModal, setActiveModal] = useState(false);


  return (
    <Frame>
      <Header>
        <h2>Save These</h2>
        <h1 style={{ fontSize: '19px' }}>CSS Modals</h1>
      </Header>
      <Grid>
        <div>
          <p>1</p>
          <Button onClick={() => setActiveModal(true)}>Unfolding</Button>
        </div>
      </Grid>
      {
        activeModal &&
        <ModalContainer $active={activeModal} >
          <ModalBackground onClick={() => setActiveModal(false)}>
            <Modal onClick={(e) => e.stopPropagation()} $active={activeModal}>
              <h2>I'm a Modal</h2>
              <p>Hear me roar.</p>
              <button onClick={() => setActiveModal(false)}>Close</button>
            </Modal>
          </ModalBackground>
        </ModalContainer>
      }
    </Frame>
  );
};

export default ModalsPage;


const unfoldIn = keyframes`
  0% {
    transform: scaleY(0.005) scaleX(0);
  }
  50% {
    transform: scaleY(0.005) scaleX(1);
  }
  100% {
    transform: scaleY(1) scaleX(1);
  }
`;


const unfoldOut = keyframes`
  0% {
    transform: scaleY(1) scaleX(1);
  }
  50% {
    transform: scaleY(0.005) scaleX(1);
  }
  100% {
    transform: scaleY(0.005) scaleX(0);
  }
`;

const zoomIn = keyframes`
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
`;

const zoomOut = keyframes`
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(0);
  }
`;

const ModalContainer = styled.div<{$active: boolean}>`
  position: fixed;
  display: flex;
  flex: 1;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  transform: ${({$active})=>$active ? 'scale(1)':'scale(0)'};
  z-index: 1;
  color: #222222;
  transform: scaleY(0.01) scaleX(0);
  animation: ${({$active})=>$active ? css`${unfoldIn} 1s cubic-bezier(0.165, 0.84, 0.44, 1) forwards`
  :css`${unfoldOut} 1s 0.3s cubic-bezier(0.165, 0.84, 0.44, 1) forwards`};
`;

const ModalBackground = styled.div`
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  flex: 1;
`;

const Modal = styled.div<{$active: boolean}>`
  background: #fff;
  padding: 20px;
  border-radius: 5px;
  text-align: center;
  position: relative;
  animation: ${({$active})=>$active ? css`${zoomIn} 0.5s 0.8s cubic-bezier(0.165, 0.84, 0.44, 1) forwards`
  :css`${zoomOut} 0.5s cubic-bezier(0.165, 0.84, 0.44, 1) forwards`};
`;

const Grid = styled.div`
  display: flex;
  flex-direction: column;
  flex:1;
`;

const Button = styled.button`
  font-family: inherit;
  border: 0;
  font-size: 10px;
  padding: 8px 0;
  border-radius: 3px;
  cursor: pointer;
  width: 70px;
  background: rgba(0 0 0 / 40%);
  color: #f9f9f9;
  transition: 0.3s;

  &:hover {
    background: rgba(0 0 0 / 100%);
  }
`;

const Frame = styled.div`
  margin: 20px;
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  flex: 1;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 20px;
`;
