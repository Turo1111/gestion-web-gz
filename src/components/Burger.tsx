import React from 'react';
import styled from 'styled-components';

const BurgerLabel = styled.label`
  position: relative;
  width: 25px;
  height: 20px;
  background: transparent;
  cursor: pointer;
  display: block;
`;

const BurgerSpan = styled.span<{open: boolean}>`
  display: block;
  position: absolute;
  height: 4px;
  width: 100%;
  background:#716A6A;
  border-radius: 9px;
  opacity: 1;
  left: 0;
  transform: rotate(0deg);
  transition: 0.5s ease-in-out;

  &:nth-of-type(1) {
    top: 0px;
    transform-origin: left center;
    ${({ open }) => open && `
      transform: rotate(45deg);
      top: 0px;
      left: 5px;
    `}
  }

  &:nth-of-type(2) {
    top: 50%;
    transform: translateY(-50%);
    transform-origin: left center;
    ${({ open }) => open && `
      width: 0%;
      opacity: 0;
    `}
  }

  &:nth-of-type(3) {
    top: 100%;
    transform: translateY(-100%);
    transform-origin: left center;
    ${({ open }) => open && `
      transform: rotate(-45deg);
      top: 18px;
      left: 5px;
    `}
  }
`;

const Burger = ({ open, toggle }: {open: boolean, toggle: ()=>void}) => (
  <BurgerLabel onClick={toggle}>
    <BurgerSpan open={open} />
    <BurgerSpan open={open} />
    <BurgerSpan open={open} />
  </BurgerLabel>
);

export default Burger;
