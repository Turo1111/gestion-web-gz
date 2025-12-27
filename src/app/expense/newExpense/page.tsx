/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import React, { useEffect } from 'react'
import { useAppDispatch } from '@/redux/hook'
import { useSelector } from 'react-redux'
import { getUser } from '@/redux/userSlice'
import useLocalStorage from '@/hooks/useLocalStorage'
import styled from 'styled-components'
import { useRouter } from 'next/navigation'
import { useResize } from '@/hooks/useResize'
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'
import ExpenseForm from '@/components/expense/ExpenseForm'
import ExpenseFormMobile from '@/components/expense/ExpenseFormMobile'

export default function NewExpense() {
  const [valueStorage] = useLocalStorage("user", "")
  const router: AppRouterInstance = useRouter()
  let { ancho } = useResize()

  const user = useSelector(getUser)
  const dispatch = useAppDispatch()

  useEffect(() => {
    // Verificar autenticación
    if (!valueStorage || !valueStorage.token) {
      router.push('/')
    }
  }, [router, valueStorage])

  return (
    <Container>
      {ancho > 940 ? <ExpenseForm /> : <ExpenseFormMobile />}
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  flex: 1;
  background: #f5f5f5;
  
  @media only screen and (max-width: 940px) {
    flex-direction: column;
  }
`
