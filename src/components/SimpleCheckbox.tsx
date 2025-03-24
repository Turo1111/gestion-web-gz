import React from 'react';
import styled from 'styled-components';

interface SimpleCheckboxProps {
  isChecked?: boolean;
  toggleCheckbox: () => void;
  text?: string;
}

const CheckboxWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 15px 0px;
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const Checkbox = styled.div<{ isChecked: boolean }>`
  width: 24px;
  height: 24px;
  border-radius: 3px;
  border: 1px solid #9098a9;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${({ isChecked }) => (isChecked ? '#506EEC' : 'transparent')};
  border-color: ${({ isChecked }) => (isChecked ? '#506EEC' : '#9098A9')};
`;

const Checkmark = styled.span`
  color: #ffffff;
  font-size: 16px;
`;

const Label = styled.span`
  margin-left: 8px;
  font-size: 18px;
`;

const SimpleCheckbox: React.FC<SimpleCheckboxProps> = ({
  isChecked = false,
  toggleCheckbox,
  text = '',
}) => {
  return (
    <CheckboxWrapper>
      <CheckboxContainer onClick={toggleCheckbox}>
        <Checkbox isChecked={isChecked}>
          {isChecked && <Checkmark>✓</Checkmark>}
        </Checkbox>
        <Label>{text}</Label>
      </CheckboxContainer>
    </CheckboxWrapper>
  );
};

export default SimpleCheckbox;