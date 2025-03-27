import React from 'react';
import styled from 'styled-components';

interface SimpleCheckboxProps {
  isChecked?: boolean;
  toggleCheckbox: () => void;
  text?: string;
  small?: boolean;
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

const Checkbox = styled.div<{ isChecked: boolean, $small: boolean }>`
  width: ${({$small})=>$small ? '16px' : '24px'};
  height: ${({$small})=>$small ? '16px' : '24px'};
  border-radius: 3px;
  border: 1px solid #9098a9;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${({ isChecked }) => (isChecked ? '#506EEC' : 'transparent')};
  border-color: ${({ isChecked }) => (isChecked ? '#506EEC' : '#9098A9')};
`;

const Checkmark = styled.span<{ $small: boolean }>`
  color: #ffffff;
  font-size: ${({$small})=>$small ? '14px' : '16px'};;
`;

const Label = styled.span<{ $small: boolean }>`
  margin-left: 8px;
  font-size: ${({$small})=>$small ? '14px' : '18px'};
`;

const SimpleCheckbox: React.FC<SimpleCheckboxProps> = ({
  isChecked = false,
  small = false,
  toggleCheckbox,
  text = '',
}) => {
  return (
    <CheckboxWrapper>
      <CheckboxContainer onClick={toggleCheckbox}>
        <Checkbox $small={small} isChecked={isChecked}>
          {isChecked && <Checkmark $small={small}>✓</Checkmark>}
        </Checkbox>
        <Label $small={small}>{text}</Label>
      </CheckboxContainer>
    </CheckboxWrapper>
  );
};

export default SimpleCheckbox;