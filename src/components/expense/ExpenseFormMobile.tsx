/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import React, { useState } from 'react'
import styled from 'styled-components'
import Button from '@/components/Button'
import Input from '@/components/Input'
import { ExpenseFormData, ExpenseFormErrors, ExpenseType, PaymentMethod, CreateExpenseDTO } from '@/interfaces/expense.interface'
import { expenseService } from '@/services/expense.service'
import { useAppDispatch } from '@/redux/hook'
import { setLoading } from '@/redux/loadingSlice'
import { setAlert } from '@/redux/alertSlice'
import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import { getUser } from '@/redux/userSlice'
import { trackExpenseCreated, trackExpenseCreationError } from '@/utils/analytics'
import { addExpense } from '@/redux/expenseSlice'

const ExpenseFormMobile = () => {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const user = useSelector(getUser)

  // Categorías sugeridas
  const [categorySuggestions] = useState<string[]>([
    'Combustible',
    'Sueldos',
    'Mantenimiento',
    'Alquiler',
    'Servicios',
    'Insumos',
    'Impuestos',
    'Transporte',
    'Otros',
  ])

  // Fecha por defecto: hoy
  const getToday = () => new Date().toISOString().split('T')[0]

  // Estado del formulario
  const [formData, setFormData] = useState<ExpenseFormData>({
    date: getToday(),
    amount: '',
    category: '',
    type: ExpenseType.OPERATIVO,
    paymentMethod: '',
    description: '',
  })

  const [formErrors, setFormErrors] = useState<ExpenseFormErrors>({})
  const [showCategorySuggestions, setShowCategorySuggestions] = useState(false)

  // Validación del formulario
  const validateForm = (): { isValid: boolean; errors: ExpenseFormErrors } => {
    const errors: ExpenseFormErrors = {}

    if (!formData.date) {
      errors.date = 'La fecha es obligatoria'
    } else if (new Date(formData.date) > new Date()) {
      errors.date = 'No se puede cargar una fecha futura'
    }

    const amount = parseFloat(formData.amount)
    if (!formData.amount || isNaN(amount)) {
      errors.amount = 'El monto es obligatorio'
    } else if (amount <= 0) {
      errors.amount = 'El monto debe ser mayor a cero'
    } else if (!/^\d+(\.\d{1,2})?$/.test(formData.amount)) {
      errors.amount = 'Máximo 2 decimales permitidos'
    }

    if (!formData.category || formData.category.trim().length < 2) {
      errors.category = 'La categoría es obligatoria (mínimo 2 caracteres)'
    }

    if (!formData.type) {
      errors.type = 'El tipo de egreso es obligatorio'
    }

    if (!formData.paymentMethod) {
      errors.paymentMethod = 'El medio de pago es obligatorio'
    }

    if (formData.description && formData.description.length > 500) {
      errors.description = 'Máximo 500 caracteres permitidos'
    }

    return { isValid: Object.keys(errors).length === 0, errors }
  }

  // Manejar submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const { isValid, errors } = validateForm()
    setFormErrors(errors)

    if (!isValid) {
      dispatch(setAlert({ message: 'Por favor, corrige los errores en el formulario', type: 'error' }))
      return
    }

    try {
      dispatch(setLoading(true))

      const payload: CreateExpenseDTO = {
        date: formData.date,
        amount: parseFloat(formData.amount),
        category: formData.category.trim(),
        type: formData.type as ExpenseType,
        paymentMethod: formData.paymentMethod as PaymentMethod,
        ...(formData.description && { description: formData.description.trim() }),
      }

      const newExpense = await expenseService.create(payload)

      trackExpenseCreated({
        type: newExpense.type,
        category: newExpense.category,
        paymentMethod: newExpense.paymentMethod,
        amount: newExpense.amount,
        date: newExpense.date,
        user: user.nickname,
      })

      dispatch(addExpense(newExpense))
      dispatch(setAlert({ message: 'Egreso registrado exitosamente', type: 'success' }))
      router.push('/expense')

    } catch (error: any) {
      trackExpenseCreationError({
        errorType: error.response?.status === 400 ? 'validation_error' : 'server_error',
        errorMessage: error.response?.data?.message || error.message,
        user: user.nickname,
      })

      if (error.response?.status === 400) {
        const backendErrors = error.response.data?.errors || {}
        setFormErrors({
          date: backendErrors.date || '',
          amount: backendErrors.amount || '',
          category: backendErrors.category || '',
          type: backendErrors.type || '',
          paymentMethod: backendErrors.paymentMethod || '',
          description: backendErrors.description || '',
        })
        dispatch(setAlert({ message: 'Revisa los campos marcados', type: 'error' }))
      } else if (error.response?.status === 403) {
        dispatch(setAlert({ message: 'No tienes permisos para crear egresos', type: 'error' }))
      } else {
        dispatch(setAlert({ message: 'Error al guardar el egreso. Intenta nuevamente.', type: 'error' }))
      }
    } finally {
      dispatch(setLoading(false))
    }
  }

  const handleInputChange = (field: keyof ExpenseFormData, value: string) => {
    setFormData({ ...formData, [field]: value })
    if (formErrors[field]) {
      setFormErrors({ ...formErrors, [field]: '' })
    }
  }

  const filteredCategories = categorySuggestions.filter(cat =>
    cat.toLowerCase().includes(formData.category.toLowerCase())
  )

  return (
    <MobileContainer>
      <MobileTitle>Nuevo Egreso</MobileTitle>
      <MobileForm onSubmit={handleSubmit}>
        <Input
          label="Fecha"
          type="date"
          value={formData.date}
          onChange={(e) => handleInputChange('date', e.target.value)}
          width="100%"
          name="date"
        />
        {formErrors.date && <ErrorText>{formErrors.date}</ErrorText>}

        <Input
          label="Monto ($)"
          type="number"
          value={formData.amount}
          onChange={(e) => handleInputChange('amount', e.target.value)}
          width="100%"
          name="amount"
        />
        {formErrors.amount && <ErrorText>{formErrors.amount}</ErrorText>}

        <InputWrapper>
          <Input
            label="Categoría"
            type="text"
            value={formData.category}
            onChange={(e) => {
              handleInputChange('category', e.target.value)
              setShowCategorySuggestions(true)
            }}
            width="100%"
            name="category"
          />
          {showCategorySuggestions && filteredCategories.length > 0 && formData.category && (
            <SuggestionsList>
              {filteredCategories.map((cat, idx) => (
                <SuggestionItem
                  key={idx}
                  onClick={() => {
                    handleInputChange('category', cat)
                    setShowCategorySuggestions(false)
                  }}
                >
                  {cat}
                </SuggestionItem>
              ))}
            </SuggestionsList>
          )}
          {formErrors.category && <ErrorText>{formErrors.category}</ErrorText>}
        </InputWrapper>

        <SelectWrapper>
          <Label>Tipo de Egreso *</Label>
          <MobileSelect
            value={formData.type}
            onChange={(e) => handleInputChange('type', e.target.value)}
          >
            <option value={ExpenseType.OPERATIVO}>Operativo</option>
            <option value={ExpenseType.PERSONAL}>Personal</option>
            <option value={ExpenseType.OTRO_NEGOCIO}>Otro Negocio</option>
          </MobileSelect>
          {formErrors.type && <ErrorText>{formErrors.type}</ErrorText>}
        </SelectWrapper>

        <SelectWrapper>
          <Label>Medio de Pago *</Label>
          <MobileSelect
            value={formData.paymentMethod}
            onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
          >
            <option value="">Seleccionar...</option>
            <option value={PaymentMethod.EFECTIVO}>Efectivo</option>
            <option value={PaymentMethod.TRANSFERENCIA}>Transferencia</option>
            <option value={PaymentMethod.TARJETA}>Tarjeta</option>
            <option value={PaymentMethod.CHEQUE}>Cheque</option>
            <option value={PaymentMethod.OTRO}>Otro</option>
          </MobileSelect>
          {formErrors.paymentMethod && <ErrorText>{formErrors.paymentMethod}</ErrorText>}
        </SelectWrapper>

        <TextAreaWrapper>
          <Label>Descripción (opcional)</Label>
          <MobileTextArea
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Detalles adicionales..."
            maxLength={500}
          />
          <CharCounter>{formData.description.length}/500</CharCounter>
          {formErrors.description && <ErrorText>{formErrors.description}</ErrorText>}
        </TextAreaWrapper>

        <MobileButtonRow>
          <Button text="Cancelar" onClick={() => router.push('/expense')} width="100%" />
          <MobileSubmitButton type="submit">Guardar</MobileSubmitButton>
        </MobileButtonRow>
      </MobileForm>
    </MobileContainer>
  )
}

export default ExpenseFormMobile

// Styled Components optimizados para mobile
const MobileContainer = styled.div`
  padding: 15px;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
`

const MobileTitle = styled.h1`
  color: #3764A0;
  font-size: 24px;
  margin-bottom: 20px;
  text-align: center;
`

const MobileForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
`

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
`

const SelectWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`

const Label = styled.label`
  font-size: 14px;
  color: #666;
  margin-bottom: 5px;
  font-weight: 500;
`

const MobileSelect = styled.select`
  height: 50px;
  padding: 12px;
  border: 1px solid #B4B4B8;
  border-radius: 5px;
  font-size: 16px;
  color: #000;
  background: white;
  cursor: pointer;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #8294C4;
  }
`

const TextAreaWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`

const MobileTextArea = styled.textarea`
  min-height: 120px;
  padding: 12px;
  border: 1px solid #B4B4B8;
  border-radius: 5px;
  font-size: 16px;
  color: #000;
  font-family: inherit;
  resize: vertical;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #8294C4;
  }
`

const CharCounter = styled.span`
  font-size: 12px;
  color: #999;
  text-align: right;
  margin-top: 5px;
`

const ErrorText = styled.span`
  color: #F7A4A4;
  font-size: 12px;
  margin-top: 5px;
`

const MobileButtonRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;
`

const MobileSubmitButton = styled.button`
  border: 0;
  background-color: #8294C4;
  padding: 10px 25px;
  border-radius: 10px;
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  width: 100%;
  margin: 10px 0;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #637195;
  }
  
  @media only screen and (max-width: 500px) {
    padding: 10px 15px;
    margin: 5px 0;
  }
`

const SuggestionsList = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #B4B4B8;
  border-radius: 5px;
  max-height: 200px;
  overflow-y: auto;
  z-index: 1000;
  list-style: none;
  padding: 0;
  margin: 5px 0 0 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`

const SuggestionItem = styled.li`
  padding: 12px 15px;
  cursor: pointer;
  transition: background 0.2s;
  font-size: 16px;

  &:hover {
    background: #f0f0f0;
  }
`
