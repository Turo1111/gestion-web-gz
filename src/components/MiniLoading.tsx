// LoadingEllipsis.tsx
import React from 'react';
import styled, { keyframes } from 'styled-components';

const ldsEllipsis1 = keyframes`
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
`;

const ldsEllipsis2 = keyframes`
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(24px, 0);
  }
`;

const ldsEllipsis3 = keyframes`
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(0);
  }
`;

const StyledLoadingEllipsis = styled.div`
  display: inline-block;
  position: relative;
  width: 80px;
  height: 100px; /* Increased height to accommodate text */

  div {
    box-sizing: border-box;
    position: absolute;
    top: 33.33333px;
    width: 13.33333px;
    height: 13.33333px;
    border-radius: 50%;
    animation-timing-function: cubic-bezier(0, 1, 1, 0);

    &:nth-child(1) {
      left: 8px;
      background: #3764A0;
      animation: ${ldsEllipsis1} 0.6s infinite;
    }

    &:nth-child(2) {
      left: 8px;
      background: #FA9B50;
      animation: ${ldsEllipsis2} 0.6s infinite;
    }

    &:nth-child(3) {
      left: 32px;
      background: #3764A0;
      animation: ${ldsEllipsis2} 0.6s infinite;
    }

    &:nth-child(4) {
      left: 56px;
      background: #FA9B50;
      animation: ${ldsEllipsis3} 0.6s infinite;
    }
  }

  p {
    margin-top: 60px; /* Adjust margin to position text below the animation */
    text-align: center;
    font-size: 16px;
    font-weight: bold;
  }

  .golo {
    color: #3764A0;
  }

  .zur {
    color: #FA9B50;
  }
`;

const MiniLoading: React.FC = () => (
  <StyledLoadingEllipsis>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <p><span className="golo">GOLO</span><span className="zur">ZUR</span></p>
  </StyledLoadingEllipsis>
);

export default MiniLoading;
