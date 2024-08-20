import React from 'react'
import Modal from '../Modal'
import Input from '../Input'
import InputSelectAdd from '../InputSelectAdd'
import Button from '../Button'
import { useFormik } from 'formik'
import apiClient from '@/utils/client'
import useLocalStorage from '@/hooks/useLocalStorage'
import { useSelector } from 'react-redux'
import { getLoading, setLoading } from '@/redux/loadingSlice'
import { useAppDispatch } from '@/redux/hook'
import { setAlert } from '@/redux/alertSlice'
import { Product } from '@/interfaces/product.interface'

export default function NewProduct({open, handleClose}:{open: boolean, handleClose: ()=>void}) {
    const [valueStorage , setValue] = useLocalStorage("user", "")
    const loading = useSelector(getLoading)
    const dispatch = useAppDispatch();

    const formik = useFormik({
      initialValues: {
        descripcion: '',
        codigoBarra: '',
        precioBulto: 0,
        precioCompra: 0,
        precioUnitario: 0,
        stock: 0,
        sabor: '',
        bulto: 0,
        categoria: '',
        marca: '',
        proveedor: ''
      },
      onSubmit: (formValue:Product) => {
        
        dispatch(setLoading(true))
        if (formValue.descripcion === '' || formValue.stock <= 0 || formValue.precioUnitario <= 0){
          dispatch(setAlert({
            message: `Falta descripcion o stock o precio unitario`,
            type: 'error'
          }))
          return
        }
        if (formValue.categoria === '' || formValue.proveedor === '' || formValue.marca === ''){
          dispatch(setAlert({
            message: `Falta categoria o proveedor o marca`,
            type: 'error'
          }))
          return
        }
        apiClient.post(`/product`, formValue,
        {
          headers: {
            Authorization: `Bearer ${valueStorage.token}` // Agregar el token en el encabezado como "Bearer {token}"
          }
        })
        .then(async (r)=>{
          dispatch(setLoading(false))
          dispatch(setAlert({
            message: `Producto creado correctamente`,
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
      <Modal open={open} title={'Nuevo producto'} eClose={handleClose} height='85%' >
        <Input label={'Descripcion'} name={'descripcion'} value={formik.values.descripcion} onChange={formik.handleChange} type='text' />
        {/* <Input label={'Codigo de barra'} name={'codigoBarra'} value={formik.values.codigoBarra} onChange={formik.handleChange} type='text' />
        <Input label={'Precio bulto'} name={'precioBulto'} value={formik.values.precioBulto} onChange={formik.handleChange} type='text' /> */}
        <Input label={'Precio compra'} name={'precioCompra'} value={formik.values.precioCompra} onChange={formik.handleChange} type='text' />
        <Input label={'Precio unitario'} name={'precioUnitario'} value={formik.values.precioUnitario} onChange={formik.handleChange} type='text' />
        <Input label={'Stock'} name={'stock'} value={formik.values.stock} onChange={formik.handleChange} type='text' />
        <Input label={'Sabor'} name={'sabor'} value={formik.values.sabor} onChange={formik.handleChange} type='text' />
    {/*     <Input label={'Bulto'} name={'bulto'} value={formik.values.bulto} onChange={formik.handleChange} type='text' /> */}
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
          <Button text='Crear' onClick={formik.handleSubmit} />
        </div>
      </Modal>
    )
}
