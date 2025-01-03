import useLocalStorage from '@/hooks/useLocalStorage'
import { setAlert } from '@/redux/alertSlice'
import { useAppSelector } from '@/redux/hook'
import { getUser } from '@/redux/userSlice'
import apiClient from '@/utils/client'
import { useFormik } from 'formik'
import React from 'react'
import { useDispatch } from 'react-redux'
import Button from '../Button'
import Modal from '../Modal'
import InputSelect from '../InputSelect'
import Input from '../Input'
import { Brand, Categorie, Provider } from '@/interfaces/product.interface'
import { setLoading } from '@/redux/loadingSlice'
import ButtonUI from '../ButtonUI'

interface ValueUpdate {
  categoria: string,
  proveedor: string,
  marca: string,
  porcentaje: number
}

const initialValues:ValueUpdate = {
  categoria: '',
  proveedor: '',
  marca: '',
  porcentaje: 0
}

export default function UpdatePrice({open, handleClose}:{open: boolean, handleClose: ()=>void}) {

    const user = useAppSelector(getUser)
    const dispatch = useDispatch()
    const [valueStorage , setValue] = useLocalStorage("user", "")

    const formik = useFormik({
        initialValues: initialValues,
        validateOnChange: false,
        onSubmit: (formValue: ValueUpdate) => {
          dispatch(setLoading(true));
            if (formValue.porcentaje <= 0) {
              dispatch(setAlert({
                message: 'Porcentaje tiene que ser mayor a 0',
                type: 'error'
              }))
              return 
            }
            if (formValue.categoria !== '' || formValue.marca !== '' || formValue.proveedor !== '') {
              apiClient.patch(`/product`, formValue,
              {
                headers: {
                  Authorization: `Bearer ${valueStorage.token}` // Agregar el token en el encabezado como "Bearer {token}"
                }
              })
              .then(async(response)=>{
                formik.resetForm()
                handleClose()
                dispatch(setLoading(false));
              })
              .catch(e=>console.log("error", e))
            }else{
              dispatch(setAlert({
                message: 'Tiene que elegir algun filtro',
                type: 'error'
              }))
              dispatch(setLoading(false));
              return 
            }
        }
    })

  return (
    <Modal open={open} eClose={handleClose} title='Actualizar precios' height='auto' >
        <InputSelect
            value={formik.values.categoria}
            onChange={(id:string, item:Categorie)=>{
              formik.setFieldValue('categoria', id)
              formik.setFieldValue('NameCategoria', item.descripcion)
            }}
            name={'Categoria'} path={'categorie'}
        />
        <InputSelect
            value={formik.values.proveedor}
            onChange={(id:string, item:Provider)=>{
              formik.setFieldValue('proveedor', id)
              formik.setFieldValue('NameProveedor', item.descripcion)
            }}
            name={'Proveedor'} path={'provider'}
        />
        <InputSelect
            value={formik.values.marca}
            onChange={(id:string, item:Brand)=>{
              formik.setFieldValue('marca', id)
              formik.setFieldValue('NameMarca', item.descripcion)
            }}
            name={'Marca'} path={'brand'}
        />
        <Input label={'Porcentaje'} name={'porcentaje'} value={formik.values.porcentaje} onChange={formik.handleChange} type='number' />
        <div style={{display: 'flex', justifyContent: 'center'}} >
          <ButtonUI label='Actualizar' onClick={formik.handleSubmit}/>
        </div>
    </Modal>
  )
}
