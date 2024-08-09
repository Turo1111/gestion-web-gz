import React from 'react';
import styled from 'styled-components';

export default function Logo({ small = false }:{small?: boolean}) {
    return (
      <StyledButton onClick={() => { /* Handle navigation here */ }}>
        <Container>
          <Golozur>
            <ColorBlue style={{ fontSize: `${small ? '25px' : '40px'}`, fontWeight: 'bold' }}>GOLO</ColorBlue>
            <ColorOrange style={{ fontSize: `${small ? '25px' : '40px'}`, fontWeight: 'bold' }}>ZUR</ColorOrange>
          </Golozur>
          <Distri style={{ marginTop: `${small ? '-5px' : '-10px'}`}}>
            <ColorBlue style={{ fontSize: `${small ? '8px' : '16px'}`, fontWeight: 'bold' }}>DISTRI</ColorBlue>
            <ColorOrange style={{ fontSize: `${small ? '8px' : '16px'}`, fontWeight: 'bold' }}>BUIDORA</ColorOrange>
          </Distri>
        </Container>
      </StyledButton>
    );
}


const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  justify-content: center;
  align-items: center;
  margin: 10px 0;
`;

const Golozur = styled.div`
  display: flex;
  font-weight: bold;
`;

const Distri = styled.div`
  display: flex;
  font-weight: bold;
`;

const ColorBlue = styled.span`
  color: #3764A0;
`;

const ColorOrange = styled.span`
  color: #FA9B50;
`;

const StyledButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  margin: 5px 15px;
`;