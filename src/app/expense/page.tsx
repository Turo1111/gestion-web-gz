/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import Button from '@/components/Button'
import { useAppDispatch } from '@/redux/hook'
import { useSelector } from 'react-redux'
import { getUser } from '@/redux/userSlice'
import useLocalStorage from '@/hooks/useLocalStorage'
import { useRouter } from 'next/navigation'
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'
import { setLoading } from '@/redux/loadingSlice'
import { Expense } from '@/interfaces/expense.interface'
import { expenseService } from '@/services/expense.service'
import { setExpenses, getExpenses, removeExpense } from '@/redux/expenseSlice'
import { setAlert } from '@/redux/alertSlice'
import { MdEdit, MdDelete } from 'react-icons/md'
import Confirm from '@/components/Confirm'
import { trackExpenseDeleted } from '@/utils/analytics'

export default function ExpenseScreen() {
  const [valueStorage] = useLocalStorage("user", "")
  const router: AppRouterInstance = useRouter()
  const dispatch = useAppDispatch()
  const user = useSelector(getUser)
  const expenses = useSelector(getExpenses)
  
  const [data, setData] = useState<Expense[]>([])
  const [total, setTotal] = useState(0)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [expenseToDelete, setExpenseToDelete] = useState<Expense | null>(null)

  useEffect(() => {
    if (!valueStorage || !valueStorage.token) {
      router.push('/')
      return
    }
    fetchExpenses()
  }, [])

  const fetchExpenses = async () => {
    try {
      dispatch(setLoading(true))
      const response = await expenseService.getAll({ skip: 0, limit: 50 })
      
      // Transformar amountCents a amount (pesos)
      const expensesWithAmount = response.expenses.map(expense => ({
        ...expense,
        amount: expense.amountCents / 100
      }))
      
      setData(expensesWithAmount)
      setTotal(response.total)
      dispatch(setExpenses({ expenses: expensesWithAmount, total: response.total }))
    } catch (error: any) {
      console.error('Error al cargar egresos:', error)
      dispatch(setAlert({ message: 'Error al cargar los egresos', type: 'error' }))
    } finally {
      dispatch(setLoading(false))
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' })
  }

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(amount)
  }

  const openDeleteConfirm = (expense: Expense) => {
    setExpenseToDelete(expense)
    setConfirmOpen(true)
  }

  const closeDeleteConfirm = () => {
    setConfirmOpen(false)
    setExpenseToDelete(null)
  }

  const handleDeleteExpense = async () => {
    if (!expenseToDelete) return

    try {
      dispatch(setLoading(true))
      await expenseService.delete(expenseToDelete._id.toString())
      
      // Actualizar estado Redux
      dispatch(removeExpense(expenseToDelete._id.toString()))
      
      // Actualizar estado local
      setData(prev => prev.filter(exp => exp._id !== expenseToDelete._id))
      setTotal(prev => prev - 1)
      
      // Analytics
      trackExpenseDeleted({
        usuario: user.nickname || 'unknown',
        timestamp: Date.now(),
        id_egreso: expenseToDelete._id.toString(),
        monto: expenseToDelete.amount,
        tipo_egreso: expenseToDelete.type,
        categoria: expenseToDelete.category,
        medio_pago: expenseToDelete.paymentMethod,
      })
      
      dispatch(setAlert({ message: 'Egreso eliminado exitosamente', type: 'success' }))
      closeDeleteConfirm()
    } catch (error: any) {
      console.error('Error al eliminar egreso:', error)
      
      // Manejo de errores específicos
      if (error.response?.status === 403) {
        dispatch(setAlert({ message: 'No tiene permisos para eliminar egresos', type: 'error' }))
      } else if (error.response?.status === 404) {
        dispatch(setAlert({ message: 'El egreso no existe o ya fue eliminado', type: 'error' }))
      } else {
        dispatch(setAlert({ message: 'Error al eliminar el egreso', type: 'error' }))
      }
    } finally {
      dispatch(setLoading(false))
    }
  }

  return (
    <Container>
      <Header>
        <Title>Egresos</Title>
        <Button text="Nuevo Egreso" onClick={() => {}} to="/expense/newExpense" />
      </Header>

      <Content>
        {data.length === 0 ? (
          <EmptyState>
            <EmptyIcon>📋</EmptyIcon>
            <EmptyText>No hay egresos registrados</EmptyText>
            <EmptySubText>Comienza creando tu primer egreso</EmptySubText>
          </EmptyState>
        ) : (
          <>
            <Stats>
              <StatCard>
                <StatLabel>Total de Egresos</StatLabel>
                <StatValue>{total}</StatValue>
              </StatCard>
              <StatCard>
                <StatLabel>Monto Total</StatLabel>
                <StatValue>
                  {formatAmount(data.reduce((sum, exp) => sum + exp.amount, 0))}
                </StatValue>
              </StatCard>
            </Stats>

            <TableContainer>
              <Table>
                <thead>
                  <tr>
                    <Th>Fecha</Th>
                    <Th>Categoría</Th>
                    <Th>Tipo</Th>
                    <Th>Monto</Th>
                    <Th>Medio de Pago</Th>
                    <Th>Acciones</Th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((expense) => (
                    <tr key={expense._id.toString()}>
                      <Td>{formatDate(expense.date)}</Td>
                      <Td>{expense.category}</Td>
                      <Td>
                        <TypeBadge type={expense.type}>
                          {expense.type === 'operativo' ? 'Operativo' : 
                           expense.type === 'personal' ? 'Personal' : 'Otro Negocio'}
                        </TypeBadge>
                      </Td>
                      <Td><Amount>{formatAmount(expense.amount)}</Amount></Td>
                      <Td>{expense.paymentMethod}</Td>
                      <Td>
                        <ActionContainer>
                          <ActionButton onClick={() => router.push(`/expense/${expense._id}/edit`)}>
                            <MdEdit size={18} />
                          </ActionButton>
                          <ActionButton onClick={() => openDeleteConfirm(expense)} $variant="danger">
                            <MdDelete size={18} />
                          </ActionButton>
                        </ActionContainer>
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </TableContainer>
          </>
        )}
      </Content>

      <Confirm
        open={confirmOpen}
        message={`¿Está seguro que desea eliminar el egreso de ${expenseToDelete?.category || ''} por ${formatAmount(expenseToDelete?.amount ?? 0)}? Esta acción no se puede deshacer.`}
        handleClose={closeDeleteConfirm}
        handleConfirm={handleDeleteExpense}
      />
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 20px;
  background: #f5f5f5;
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;

  @media only screen and (max-width: 600px) {
    flex-direction: column;
    gap: 15px;
  }
`

const Title = styled.h1`
  color: #3764A0;
  font-size: 32px;
  margin: 0;
`

const Content = styled.div`
  background: white;
  border-radius: 10px;
  padding: 30px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
`

const EmptyIcon = styled.div`
  font-size: 64px;
  margin-bottom: 20px;
`

const EmptyText = styled.h2`
  color: #666;
  font-size: 24px;
  margin-bottom: 10px;
`

const EmptySubText = styled.p`
  color: #999;
  font-size: 16px;
`

const Stats = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 30px;

  @media only screen and (max-width: 600px) {
    flex-direction: column;
  }
`

const StatCard = styled.div`
  flex: 1;
  background: linear-gradient(135deg, #8294C4 0%, #637195 100%);
  padding: 20px;
  border-radius: 10px;
  color: white;
`

const StatLabel = styled.div`
  font-size: 14px;
  opacity: 0.9;
  margin-bottom: 8px;
`

const StatValue = styled.div`
  font-size: 28px;
  font-weight: bold;
`

const TableContainer = styled.div`
  overflow-x: auto;
`

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`

const Th = styled.th`
  text-align: left;
  padding: 12px;
  border-bottom: 2px solid #e0e0e0;
  color: #666;
  font-weight: 600;
  font-size: 14px;
`

const Td = styled.td`
  padding: 12px;
  border-bottom: 1px solid #f0f0f0;
  font-size: 14px;
`

const TypeBadge = styled.span<{ type: string }>`
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  background: ${props => 
    props.type === 'operativo' ? '#B6E2A1' : 
    props.type === 'personal' ? '#EA906C' : '#F7A4A4'};
  color: ${props => 
    props.type === 'operativo' ? '#2d5016' : 
    props.type === 'personal' ? '#5c2d0f' : '#5c0f0f'};
`

const Amount = styled.span`
  font-weight: 600;
  color: #8294C4;
`

const ActionContainer = styled.div`
  display: flex;
  gap: 8px;
`

const ActionButton = styled.button<{ $variant?: 'danger' }>`
  background: transparent;
  border: none;
  color: ${props => props.$variant === 'danger' ? '#d32f2f' : '#8294C4'};
  cursor: pointer;
  padding: 5px 10px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.$variant === 'danger' ? '#ffebee' : '#f0f0f0'};
    color: ${props => props.$variant === 'danger' ? '#b71c1c' : '#637195'};
  }

  &:active {
    transform: scale(0.95);
  }
`
