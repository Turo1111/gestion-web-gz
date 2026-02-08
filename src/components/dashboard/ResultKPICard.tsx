'use client'
import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import { Switch, FormControlLabel } from '@mui/material'
import { MdAttachMoney, MdInfo, MdRefresh } from 'react-icons/md'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import apiClient from '@/utils/client'
import { expenseService } from '@/services/expense.service'
import { ResultKPIProps, ResultKPIData } from '@/interfaces/dashboard.interface'
import { trackDashboardResultKPIViewed, trackDashboardResultFilterChanged } from '@/utils/analytics'

const ResultKPICard: React.FC<ResultKPIProps> = ({ period, interval }) => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<ResultKPIData | null>(null)
  const [operativosOnly, setOperativosOnly] = useState(false)
  
  const user = useSelector((state: RootState) => state.user)
  const lastAnalyticsRef = useRef<string>('')

  const fetchResultKPI = async () => {
    try {
      setLoading(true)
      setError(null)

      // Determinar el intervalo para el endpoint /dataset
      let datasetEndpoint = '/dataset/daily' // Default
      
      if (interval && interval !== 'CUSTOM') {
        const intervalMap: { [key: string]: string } = {
          'DIARIO': 'daily',
          'SEMANAL': 'weekly',
          'MENSUAL': 'monthly',
          'ANUAL': 'annually',
        }
        datasetEndpoint = `/dataset/${intervalMap[interval] || 'daily'}`
      } else {
        // Usar endpoint custom con fechas
        datasetEndpoint = `/dataset/custom/${period.from}/${period.to}`
      }

      // 4 llamadas en paralelo para obtener todas las métricas
      const [datasetRes, egresosRes, egresosOpRes, egresosPersonalRes] = await Promise.all([
        apiClient.get(datasetEndpoint),
        expenseService.getKPITotal({ from: period.from, to: period.to }),
        expenseService.getKPITotal({ from: period.from, to: period.to, type: 'operativo' as any }),
        expenseService.getKPITotal({ from: period.from, to: period.to, type: 'personal' as any }),
      ])

      // Extraer ventas y compras del dataset
      const salesData = datasetRes.data.simple?.find((item: any) => item.label === 'sale')
      const buyData = datasetRes.data.simple?.find((item: any) => item.label === 'buy')

      const ventas = salesData?.totalSales || 0
      const compras = buyData?.totalSales || 0
      const egresosTotal = egresosRes.total || 0
      const egresosOperativos = egresosOpRes.total || 0
      const gastosPersonales = egresosPersonalRes.total || 0

      // Calcular resultado según toggle
      const egresosUsados = operativosOnly ? egresosOperativos : egresosTotal
      const resultado = ventas - compras - egresosUsados

      setData({
        ventas,
        compras,
        resultado,
        gastosPersonales,
      })

      // Analytics con guard anti-duplicados
      const analyticsKey = `${period.from}-${period.to}-${operativosOnly}`
      if (lastAnalyticsRef.current !== analyticsKey) {
        trackDashboardResultKPIViewed({
          usuario: user.nickname || 'desconocido',
          periodo: { from: period.from, to: period.to, interval },
          operativosOnly,
          ventas,
          compras,
          egresosUsados,
          resultado,
          gastosPersonales,
        })
        lastAnalyticsRef.current = analyticsKey
      }

      setLoading(false)
    } catch (err: any) {
      console.error('Error fetching result KPI:', err)
      
      const status = err.response?.status
      let errorMessage = 'Error de conexión. Verifica tu internet'

      switch (status) {
        case 400:
          errorMessage = 'Parámetros de fecha inválidos'
          break
        case 401:
          errorMessage = 'Sesión expirada. Recarga la página'
          break
        case 403:
          errorMessage = 'Sin permisos para ver métricas del Dashboard'
          break
        case 500:
          errorMessage = 'Error del servidor. Intenta más tarde'
          break
      }

      setError(errorMessage)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchResultKPI()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [period.from, period.to, operativosOnly])

  const handleToggleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.checked
    
    // Analytics de cambio de filtro
    trackDashboardResultFilterChanged({
      usuario: user.nickname || 'desconocido',
      valorAnterior: operativosOnly,
      valorNuevo: newValue,
      periodo: { from: period.from, to: period.to },
    })
    
    setOperativosOnly(newValue)
  }

  const formatAmount = (amount: number): string => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  const getResultColor = (resultado: number): string => {
    if (resultado > 0) return '#99BC85' // Verde (positivo)
    if (resultado < 0) return '#DC8686' // Rojo (negativo)
    return '#666' // Gris (cero)
  }

  // Loading state
  if (loading) {
    return (
      <KPIContainer>
        <KPIHeader>
          <TitleContainer>
            <IconWrapper>
              <MdAttachMoney />
            </IconWrapper>
            <KPITitle>Resultado del Período</KPITitle>
          </TitleContainer>
        </KPIHeader>
        <KPIBody>
          <SkeletonAmount />
          <SkeletonText />
          <SkeletonText width="60%" />
        </KPIBody>
      </KPIContainer>
    )
  }

  // Error state
  if (error) {
    return (
      <KPIContainer>
        <KPIHeader>
          <TitleContainer>
            <IconWrapper>
              <MdAttachMoney />
            </IconWrapper>
            <KPITitle>Resultado del Período</KPITitle>
          </TitleContainer>
        </KPIHeader>
        <KPIBody>
          <ErrorContainer>
            <ErrorText>{error}</ErrorText>
            <RetryButton onClick={fetchResultKPI}>
              <MdRefresh /> Reintentar
            </RetryButton>
          </ErrorContainer>
        </KPIBody>
      </KPIContainer>
    )
  }

  // Success state
  return (
    <KPIContainer>
      <KPIHeader>
        <TitleContainer>
          <IconWrapper>
            <MdAttachMoney />
          </IconWrapper>
          <KPITitle>Resultado del Período</KPITitle>
        </TitleContainer>
        <ToggleContainer>
          <StyledFormControlLabel
            control={
              <StyledSwitch
                checked={operativosOnly}
                onChange={handleToggleChange}
                size="small"
              />
            }
            label="Solo egresos operativos"
          />
        </ToggleContainer>
      </KPIHeader>
      <KPIBody>
        <KPIAmount color={getResultColor(data?.resultado || 0)}>
          {formatAmount(data?.resultado || 0)}
        </KPIAmount>
        <KPIFormula>Ventas - Compras - Egresos</KPIFormula>
        <PersonalExpensesInfo>
          <MdInfo style={{ fontSize: '16px', marginRight: '5px' }} />
          Gastos personales: {formatAmount(data?.gastosPersonales || 0)}
        </PersonalExpensesInfo>
      </KPIBody>
    </KPIContainer>
  )
}

export default ResultKPICard

// Styled Components

const KPIContainer = styled.div`
  background: #fff;
  border-radius: 10px;
  border-left: 5px solid #8294C4;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  display: flex;
  flex-direction: column;
  min-height: 200px;

  @media only screen and (max-width: 780px) {
    padding: 15px;
  }
`

const KPIHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 10px;

  @media only screen and (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`

const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`

const IconWrapper = styled.div`
  font-size: 24px;
  color: #3764A0;
  display: flex;
  align-items: center;
`

const KPITitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #3764A0;
  margin: 0;

  @media only screen and (max-width: 780px) {
    font-size: 16px;
  }
`

const ToggleContainer = styled.div`
  display: flex;
  align-items: center;

  @media only screen and (max-width: 768px) {
    width: 100%;
  }
`

const StyledFormControlLabel = styled(FormControlLabel)`
  margin: 0 !important;
  
  .MuiFormControlLabel-label {
    font-size: 14px;
    color: #666;
    
    @media only screen and (max-width: 768px) {
      font-size: 13px;
    }
  }
`

const StyledSwitch = styled(Switch)`
  .MuiSwitch-switchBase.Mui-checked {
    color: #8294C4;
  }
  
  .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track {
    background-color: #8294C4;
  }
`

const KPIBody = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  gap: 10px;
`

const KPIAmount = styled.div<{ color: string }>`
  font-size: 32px;
  font-weight: bold;
  color: ${props => props.color};
  margin: 10px 0;

  @media only screen and (max-width: 780px) {
    font-size: 28px;
  }
`

const KPIFormula = styled.div`
  font-size: 14px;
  color: #666;
  text-align: center;
`

const PersonalExpensesInfo = styled.div`
  display: flex;
  align-items: center;
  font-size: 13px;
  color: #EA906C;
  background: #FFF4F0;
  padding: 8px 15px;
  border-radius: 20px;
  margin-top: 10px;

  @media only screen and (max-width: 780px) {
    font-size: 12px;
    padding: 6px 12px;
  }
`

// Loading skeleton
const SkeletonAmount = styled.div`
  width: 200px;
  height: 40px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 5px;
  margin: 10px 0;

  @keyframes loading {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
`

const SkeletonText = styled.div<{ width?: string }>`
  width: ${props => props.width || '150px'};
  height: 16px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 5px;
  margin: 5px 0;

  @keyframes loading {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
`

// Error state
const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  padding: 20px;
`

const ErrorText = styled.p`
  font-size: 14px;
  color: #d32f2f;
  text-align: center;
  margin: 0;
`

const RetryButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: #8294C4;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: #637195;
  }

  svg {
    font-size: 18px;
  }
`
