import React from 'react'
import Modal from '../Modal'
import Input from '../Input'
import InputSelectAdd from '../InputSelectAdd'
import Button from '../Button'
import { useFormik } from 'formik'
import apiClient from '@/utils/client'
import useLocalStorage from '@/hooks/useLocalStorage'

export default function NewProduct({open, handleClose}:{open: boolean, handleClose: any}) {
    const [valueStorage , setValue] = useLocalStorage("user", "")

    const formik = useFormik({
      initialValues: {
        descripcion: '',
        codigoBarra: '',
        precioBulto: '',
        precioCompra: '',
        precioUnitario: '',
        stock: '',
        sabor: '',
        bulto: '',
      },
      onSubmit: (formValue:any) => {
        console.log(formValue)
        if (formValue.descripcion === '' || formValue.stock <= 0 || formValue.precioUnitario <= 0){
          console.log('error')
          return
        }
        if (formValue.categoria === '' || formValue.proveedor === '' || formValue.marca === ''){
          console.log('error')
          return
        }
        apiClient.post(`/product`, formValue,
        {
          headers: {
            Authorization: `Bearer ${valueStorage.token}` // Agregar el token en el encabezado como "Bearer {token}"
          }
        })
        .then(async (r)=>{
          handleClose()
        })
        .catch(e=>{
            console.log('error', e);
        })
      }
    }) 
  
    return (
      <Modal open={open} title={'Nuevo producto'} eClose={handleClose} height='auto' >
        <Input label={'Descripcion'} name={'descripcion'} value={formik.values.descripcion} onChange={formik.handleChange} type='text' />
        <Input label={'Codigo de barra'} name={'codigoBarra'} value={formik.values.codigoBarra} onChange={formik.handleChange} type='text' />
        <Input label={'Precio bulto'} name={'precioBulto'} value={formik.values.precioBulto} onChange={formik.handleChange} type='text' />
        <Input label={'Precio compra'} name={'precioCompra'} value={formik.values.precioCompra} onChange={formik.handleChange} type='text' />
        <Input label={'Precio unitario'} name={'precioUnitario'} value={formik.values.precioUnitario} onChange={formik.handleChange} type='text' />
        <Input label={'Stock'} name={'stock'} value={formik.values.stock} onChange={formik.handleChange} type='text' />
        <Input label={'Sabor'} name={'sabor'} value={formik.values.sabor} onChange={formik.handleChange} type='text' />
        <Input label={'Bulto'} name={'bulto'} value={formik.values.bulto} onChange={formik.handleChange} type='text' />
        <InputSelectAdd type={'text'} label={'Categoria'} name={'NameCategoria'} path={'categorie'} value={formik.values.NameCategoria} onChange={(id:any, item:any)=>{
            formik.setFieldValue('categoria', id)
            formik.setFieldValue('NameCategoria', item.descripcion)
          }} />
        <InputSelectAdd type={'text'} label={'Marca'} name={'NameMarca'} path={'brand'} value={formik.values.NameMarca} onChange={(id:any, item:any)=>{
            formik.setFieldValue('marca', id)
            formik.setFieldValue('NameMarca', item.descripcion)
          }} />
        <InputSelectAdd type={'text'} label={'Proveedor'} name={'NameProveedor'} path={'provider'} value={formik.values.NameProveedor} onChange={(id:any, item:any)=>{
            formik.setFieldValue('proveedor', id)
            formik.setFieldValue('NameProveedor', item.descripcion)
          }} />
        <div style={{display: 'flex', justifyContent: 'center'}}>
          <Button text='Crear' onClick={formik.handleSubmit} />
        </div>
      </Modal>
    )
}
