'use client';

import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import { getCurrentStep, resetWizard } from '@/redux/purchaseDocSlice';
import { useAppDispatch } from '@/redux/hook';
import UploadStep from '@/components/buy/smart-upload/UploadStep';
import ReviewStep from '@/components/buy/smart-upload/ReviewStep';
import { MdArrowBack } from 'react-icons/md';

export default function SmartUploadPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const currentStep = useSelector(getCurrentStep);
  
  useEffect(() => {
    // Reset wizard al montar
    return () => {
      dispatch(resetWizard());
    };
  }, [dispatch]);
  
  const handleGoBack = () => {
    router.push('/buy');
  };
  
  return (
    <Container>
      <Header>
        <BackButton onClick={handleGoBack}>
          <MdArrowBack size={24} />
          Volver al listado
        </BackButton>
        <Title>Carga Inteligente de Comprobantes</Title>
        <Subtitle>
          Sube tu factura, remito o presupuesto y deja que el sistema identifique los productos automáticamente
        </Subtitle>
      </Header>
      
      <StepIndicator>
        <Step active={currentStep === 'upload'} completed={currentStep === 'review'}>
          <StepNumber>1</StepNumber>
          <StepLabel>Subir Comprobante</StepLabel>
        </Step>
        <StepConnector />
        <Step active={currentStep === 'review'}>
          <StepNumber>2</StepNumber>
          <StepLabel>Revisar y Confirmar</StepLabel>
        </Step>
      </StepIndicator>
      
      <Content>
        {currentStep === 'upload' && <UploadStep />}
        {currentStep === 'review' && <ReviewStep />}
      </Content>
    </Container>
  );
}

// Styled Components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  color: #3764A0;
  font-size: 14px;
  cursor: pointer;
  padding: 8px 0;
  
  &:hover {
    text-decoration: underline;
  }
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 600;
  color: #333;
  margin: 0;
`;

const Subtitle = styled.p`
  font-size: 14px;
  color: #666;
  margin: 0;
`;

const StepIndicator = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 24px 0;
`;

const Step = styled.div<{ active?: boolean; completed?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  opacity: ${props => (props.active || props.completed ? 1 : 0.4)};
`;

const StepNumber = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #3764A0;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
`;

const StepLabel = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: #333;
`;

const StepConnector = styled.div`
  width: 100px;
  height: 2px;
  background: #ddd;
  margin-bottom: 24px;
`;

const Content = styled.div`
  flex: 1;
`;
