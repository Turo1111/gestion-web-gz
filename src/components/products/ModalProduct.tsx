import React, { useState } from 'react'
import Modal from '../Modal'
import Button from '../Button'
import { useFormik } from 'formik'
import Input from '../Input'
import InputSelectAdd from '../InputSelectAdd'
import useLocalStorage from '@/hooks/useLocalStorage'
import apiClient from '@/utils/client'
import { useSelector } from 'react-redux'
import { getLoading, setLoading } from '@/redux/loadingSlice'
import { useAppDispatch } from '@/redux/hook'
import { setAlert } from '@/redux/alertSlice'
import { Product } from '@/interfaces/product.interface'

export default function ModalProduct({open, handleClose, product}:{open: boolean, handleClose: ()=>void, product: Product}) {

  const [valueStorage , setValue] = useLocalStorage("user", "")
  const loading = useSelector(getLoading)
  const dispatch = useAppDispatch();
  
  const formik = useFormik({
    initialValues: product,
    onSubmit: (formValue:Product) => {
      dispatch(setLoading(true))
      if (formValue.descripcion === '' || formValue.stock <= 0 || formValue.precioUnitario <= 0){
        console.log('error')
        return
      }
      if (formValue.categoria === '' || formValue.proveedor === '' || formValue.marca === ''){
        console.log('error')
        return
      }
      apiClient.patch(`/product/${product._id}`, formValue,
      {
        headers: {
          Authorization: `Bearer ${valueStorage.token}` // Agregar el token en el encabezado como "Bearer {token}"
        }
      })
      .then(async (r)=>{
        dispatch(setLoading(false))
        dispatch(setAlert({
          message: `Producto modificado correctamente`,
          type: 'success'
        }))
        handleClose()
      })
      .catch((e)=>{
        console.log(e.response)
        dispatch(setLoading(false))
        dispatch(setAlert({
        message: `${e.response.data.error}`,
        type: 'error'
        }))
      })
    }
  }) 

  return (
    <Modal open={open} title={product.descripcion} eClose={handleClose} height='85%' >
      <Input label={'Descripcion'} name={'descripcion'} value={formik.values.descripcion} onChange={formik.handleChange} type='text' />
      {/*  <Input label={'Codigo de barra'} name={'codigoBarra'} value={formik.values.codigoBarra} onChange={formik.handleChange} type='text' />
      <Input label={'Precio bulto'} name={'precioBulto'} value={formik.values.precioBulto} onChange={formik.handleChange} type='text' />*/}
      <Input label={'Precio compra'} name={'precioCompra'} value={formik.values.precioCompra} onChange={formik.handleChange} type='number' />
      <Input label={'Precio unitario'} name={'precioUnitario'} value={formik.values.precioUnitario} onChange={formik.handleChange} type='number' />
      <Input label={'Stock'} name={'stock'} value={formik.values.stock} onChange={formik.handleChange} type='number' />
      <Input label={'Sabor'} name={'sabor'} value={formik.values.sabor} onChange={formik.handleChange} type='text' />
      {/* <Input label={'Bulto'} name={'bulto'} value={formik.values.bulto} onChange={formik.handleChange} type='text' /> */}
      <InputSelectAdd type={'text'} label={'Categoria'} name={'NameCategoria'} path={'categorie'} idSelect={formik.values.categoria} value={formik.values.NameCategoria} onChange={(id:any, item:any)=>{
          formik.setFieldValue('categoria', id)
          formik.setFieldValue('NameCategoria', item.descripcion)
        }} />
      <InputSelectAdd type={'text'} label={'Marca'} name={'NameMarca'} path={'brand'} idSelect={formik.values.marca} value={formik.values.NameMarca} onChange={(id:any, item:any)=>{
          formik.setFieldValue('marca', id)
          formik.setFieldValue('NameMarca', item.descripcion)
        }} />
      <InputSelectAdd type={'text'} label={'Proveedor'} name={'NameProveedor'} path={'provider'} idSelect={formik.values.proveedor} value={formik.values.NameProveedor} onChange={(id:any, item:any)=>{
          formik.setFieldValue('proveedor', id)
          formik.setFieldValue('NameProveedor', item.descripcion)
        }} />
      <div style={{display: 'flex', justifyContent: 'center'}}>
        <Button text='Guardar' onClick={formik.handleSubmit} />
      </div>
    </Modal>
  )
}
