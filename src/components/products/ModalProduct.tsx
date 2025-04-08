import React, { useEffect, useState } from 'react'
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

  console.log('product edit', product)

  const formik = useFormik<Product>({
    initialValues: initialValues(product),
    enableReinitialize: true,
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
      if (!valueStorage) {
        console.log('error value storage')
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

  useEffect(() => {
    formik.resetForm({ values: initialValues(product) })
  }, [product])

  return (
    <Modal open={open} title={product.descripcion} eClose={handleClose} height='auto' >
      <Input label={'Descripcion'} name={'descripcion'} value={formik.values.descripcion} onChange={formik.handleChange} type='text' />
      {/*  <Input label={'Codigo de barra'} name={'codigoBarra'} value={formik.values.codigoBarra} onChange={formik.handleChange} type='text' />
      <Input label={'Precio bulto'} name={'precioBulto'} value={formik.values.precioBulto} onChange={formik.handleChange} type='text' />*/}
      <Input label={'Precio compra'} name={'precioCompra'} value={formik.values.precioCompra} onChange={formik.handleChange} type='number' />
      <Input label={'Precio unitario'} name={'precioUnitario'} value={formik.values.precioUnitario} onChange={formik.handleChange} type='number' />
      <Input label={'Precio descuento'} name={'precioDescuento'} value={formik.values.precioDescuento} onChange={formik.handleChange} type='number' />
      <Input label={'Stock'} name={'stock'} value={formik.values.stock} onChange={formik.handleChange} type='number' />
      <Input label={'Sabor'} name={'sabor'} value={formik.values.sabor} onChange={formik.handleChange} type='text' />
      {/* <Input label={'Bulto'} name={'bulto'} value={formik.values.bulto} onChange={formik.handleChange} type='text' /> */}
      <InputSelectAdd type={'text'} label={'Categoria'} name={'NameCategoria'} path={'categorie'} idSelect={formik.values.categoria as string} value={formik.values.NameCategoria} onChange={(id:any, item:any)=>{
          formik.setFieldValue('categoria', id)
          formik.setFieldValue('NameCategoria', item.descripcion)
        }} />
      <InputSelectAdd type={'text'} label={'Marca'} name={'NameMarca'} path={'brand'} idSelect={formik.values.marca as string} value={formik.values.NameMarca} onChange={(id:any, item:any)=>{
          formik.setFieldValue('marca', id)
          formik.setFieldValue('NameMarca', item.descripcion)
        }} />
      <InputSelectAdd type={'text'} label={'Proveedor'} name={'NameProveedor'} path={'provider'} idSelect={formik.values.proveedor as string} value={formik.values.NameProveedor} onChange={(id:any, item:any)=>{
          formik.setFieldValue('proveedor', id)
          formik.setFieldValue('NameProveedor', item.descripcion)
        }} />
      <div style={{display: 'flex', justifyContent: 'center'}}>
        <Button text='Guardar' onClick={formik.handleSubmit} />
      </div>
    </Modal>
  )
}

function initialValues(item?: Product): Product {
  return {
      _id: item?._id || '',
      descripcion: item?.descripcion || "",
      codigoBarra: item?.codigoBarra || undefined,
      stock: item?.stock || 0,
      bulto: item?.bulto || 0,
      peso: {
          cantidad: item?.peso?.cantidad || 0,
          unidad: item?.peso?.unidad || "unidad"
      },
      categoria: item?.categoria || '',
      marca: item?.marca || '',
      proveedor: item?.proveedor || '',
      NameCategoria: item?.NameCategoria || '',
      NameMarca: item?.NameMarca || '',
      NameProveedor: item?.NameProveedor || '',
      sabor: item?.sabor || undefined, 
      precioBulto: item?.precioBulto || 0,
      precioCompra: item?.precioCompra || 0,
      precioUnitario: item?.precioUnitario || 0,
      precioDescuento: item?.precioDescuento || undefined 
  }
}
