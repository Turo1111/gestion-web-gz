import React, { useEffect, useState } from 'react'
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
import Confirm from '../Confirm'

let initialValue: Product = {
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
}

export default function NewProduct({open, handleClose}:{open: boolean, handleClose: ()=>void}) {
    const [valueStorage , setValue] = useLocalStorage("user", "")
    const loading = useSelector(getLoading)
    const dispatch = useAppDispatch();
    const [openConfirm, setOpenConfirm] = useState<boolean>(false)
    const [newProductStorage, setProductStorage, clearProduct] = useLocalStorage("newProduct", "")

    const isDifferentFromInitial = (values: Product, initial: Product) => {
      return Object.keys(initial).some(key => values[key as keyof Product] !== initial[key as keyof Product]);
    };

    const formik = useFormik({
      initialValues: initialValue,
      onSubmit: (formValue:Product) => {
        
        
        if (formValue.descripcion === '' || formValue.stock <= 0 || formValue.precioUnitario <= 0){
          dispatch(setAlert({
            message: `Falta descripcion o stock o precio unitario o son menor a 0`,
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
        dispatch(setLoading(true))
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

    useEffect(()=>{
      if (isDifferentFromInitial(formik.values, initialValue)) {
        console.log('guardando')
        setProductStorage({...formik.values})
        return
      }
    },[formik.values]) 
  
    useEffect(() => {
      if (newProductStorage) {
        console.log(newProductStorage)
        setOpenConfirm(true)
      }
    }, [])
  
    return (
      <Modal open={open} title={'Nuevo producto'} eClose={handleClose} height='85%' >
        <Input label={'Descripcion'} name={'descripcion'} value={formik.values.descripcion} onChange={formik.handleChange} type='text' />
        {/* <Input label={'Codigo de barra'} name={'codigoBarra'} value={formik.values.codigoBarra} onChange={formik.handleChange} type='text' />
        <Input label={'Precio bulto'} name={'precioBulto'} value={formik.values.precioBulto} onChange={formik.handleChange} type='text' /> */}
        <Input label={'Precio compra'} name={'precioCompra'} value={formik.values.precioCompra} onChange={formik.handleChange} type='number' />
        <Input label={'Precio unitario'} name={'precioUnitario'} value={formik.values.precioUnitario} onChange={formik.handleChange} type='number' />
        <Input label={'Stock'} name={'stock'} value={formik.values.stock} onChange={formik.handleChange} type='number' />
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
        {
        openConfirm &&
        <Confirm open={openConfirm} message='Hay elementos en el borrador, ¿Quieres continuar con el borrador?' handleClose={()=>{setOpenConfirm(false);clearProduct()}} handleConfirm={()=>{
          formik.setFieldValue('descripcion', newProductStorage.descripcion);
          formik.setFieldValue('codigoBarra', newProductStorage.codigoBarra);
          formik.setFieldValue('precioBulto', newProductStorage.precioBulto);
          formik.setFieldValue('precioCompra', newProductStorage.precioCompra);
          formik.setFieldValue('precioUnitario', newProductStorage.precioUnitario);
          formik.setFieldValue('stock', newProductStorage.stock);
          formik.setFieldValue('sabor', newProductStorage.sabor);
          formik.setFieldValue('bulto', newProductStorage.bulto);
          formik.setFieldValue('categoria', newProductStorage.categoria);
          formik.setFieldValue('marca', newProductStorage.marca);
          formik.setFieldValue('proveedor', newProductStorage.proveedor);
          setOpenConfirm(false)
        }} />
      }
      </Modal>
    )
}
