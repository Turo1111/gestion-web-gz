'use client';

import styled from 'styled-components';
import { useRouter } from 'next/navigation';
import { MdLock, MdArrowBack, MdHome } from 'react-icons/md';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;
  background-color: #f5f5f5;
`;

const Card = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 40px;
  max-width: 500px;
  width: 100%;
  text-align: center;
`;

const IconWrapper = styled.div`
  color: #DC8686;
  font-size: 80px;
  margin-bottom: 20px;
  animation: shake 0.5s ease-in-out;

  @keyframes shake {
    0%, 100% { transform: rotate(0deg); }
    25% { transform: rotate(-10deg); }
    75% { transform: rotate(10deg); }
  }
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: #333;
  margin-bottom: 12px;
`;

const Subtitle = styled.p`
  font-size: 18px;
  font-weight: 600;
  color: #DC8686;
  margin-bottom: 20px;
`;

const Message = styled.p`
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  margin-bottom: 30px;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
`;

const Button = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  background-color: ${props => props.$variant === 'primary' ? '#8294C4' : '#E2E8F0'};
  color: ${props => props.$variant === 'primary' ? 'white' : '#333'};

  &:hover {
    background-color: ${props => props.$variant === 'primary' ? '#6B7FA8' : '#CBD5E0'};
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(0);
  }
`;

const InfoBox = styled.div`
  background-color: #FFF4E6;
  border-left: 4px solid #EA906C;
  padding: 16px;
  margin-top: 24px;
  text-align: left;
  border-radius: 4px;
`;

const InfoTitle = styled.p`
  font-size: 14px;
  font-weight: 600;
  color: #EA906C;
  margin-bottom: 8px;
`;

const InfoText = styled.p`
  font-size: 13px;
  color: #666;
  line-height: 1.5;
  margin: 0;
`;

interface AccessDeniedProps {
  /** Mensaje personalizado para mostrar al usuario */
  message?: string;
  /** Título personalizado (default: "Acceso Denegado") */
  title?: string;
  /** Mostrar botón de volver atrás (default: true) */
  showBackButton?: boolean;
  /** Mostrar botón de ir al inicio (default: true) */
  showHomeButton?: boolean;
  /** Mostrar información adicional sobre cómo obtener permisos (default: true) */
  showInfo?: boolean;
}

/**
 * Componente AccessDenied
 * 
 * Muestra una pantalla amigable cuando el usuario no tiene permisos para acceder a una página o acción.
 * Se utiliza en dos contextos:
 * 1. Como página completa cuando se detecta 403 en interceptor de Axios
 * 2. Como componente wrapper en ProtectedRoute cuando falta permiso
 * 
 * @example
 * ```tsx
 * // Como página completa
 * <AccessDenied 
 *   message="No tienes permisos para crear egresos"
 *   showBackButton={true}
 * />
 * 
 * // Personalizado sin botón de volver
 * <AccessDenied 
 *   title="Permiso Requerido"
 *   message="Solo administradores pueden acceder aquí"
 *   showBackButton={false}
 * />
 * ```
 */
export const AccessDenied: React.FC<AccessDeniedProps> = ({
  message = 'No tienes los permisos necesarios para acceder a esta página o realizar esta acción.',
  title = 'Acceso Denegado',
  showBackButton = true,
  showHomeButton = true,
  showInfo = true,
}) => {
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  const handleGoHome = () => {
    router.push('/home');
  };

  return (
    <Container>
      <Card>
        <IconWrapper>
          <MdLock />
        </IconWrapper>
        
        <Title>{title}</Title>
        <Subtitle>Error 403 - Forbidden</Subtitle>
        <Message>{message}</Message>

        <ButtonContainer>
          {showBackButton && (
            <Button onClick={handleGoBack} $variant="secondary">
              <MdArrowBack />
              Volver Atrás
            </Button>
          )}
          {showHomeButton && (
            <Button onClick={handleGoHome} $variant="primary">
              <MdHome />
              Ir al Inicio
            </Button>
          )}
        </ButtonContainer>

        {showInfo && (
          <InfoBox>
            <InfoTitle>¿Necesitas acceso?</InfoTitle>
            <InfoText>
              Si crees que deberías tener acceso a esta función, contacta a tu administrador del sistema 
              para que actualice tus permisos.
            </InfoText>
          </InfoBox>
        )}
      </Card>
    </Container>
  );
};

export default AccessDenied;
