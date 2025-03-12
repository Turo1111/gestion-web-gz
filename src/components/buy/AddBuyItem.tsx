import React, { useEffect } from 'react'
import Modal from '../Modal'
import { Product } from '@/interfaces/product.interface'
import { ExtendItemBuy, ItemBuy } from '@/interfaces/buy.interface'
import { useFormik } from 'formik'
import Input from '../Input'
import Button from '../Button'
import { useAppDispatch } from '@/redux/hook'
import { setAlert } from '@/redux/alertSlice'
import ButtonUI from '../ButtonUI'
import { AnimatedNumber } from '../AnimatedNumber'

export default function AddBuyItem({open, handleClose, item, onClickItem}:{open: boolean, handleClose: ()=>void, item: Product, onClickItem: (item:ExtendItemBuy)=>void}) {

    const initialValue: ExtendItemBuy = {
        idProducto: item._id,
        cantidad: 0,
        total: 0,
        precio: 0,
        descripcion: item.descripcion,
        NameCategoria: item.NameCategoria,
        estado: true
    }

    const dispatch = useAppDispatch();

    const formik = useFormik({
        initialValues: initialValue,
        onSubmit: (formValue:ExtendItemBuy) => {
            if (formValue.cantidad <= 0 && formValue.precio <= 0) {
                dispatch(setAlert({
                    message: `Falta ingresar cantida o precio`,
                    type: 'warning'
                }))
                return
            }
            onClickItem(formValue)
        }
    })
    
    useEffect(()=>{
        formik && formik.setFieldValue('total', formik.values.cantidad * formik.values.precio)
    },[formik.values.cantidad, formik.values.precio])

  return (
    <Modal open={open} eClose={handleClose} title='Agregar producto a la compra' width='40%' height='auto'  >
        <h2 style={{fontSize: 16, color: '#252525', margin: '15px 0'}}>{item.descripcion}</h2>
        <Input label={'Cantidad'} name={'cantidad'} value={formik.values.cantidad} onChange={formik.handleChange} type='number' />
        <Input label={'Precio compra'} name={'precio'} value={formik.values.precio} onChange={formik.handleChange} type='number' />
        <h2 style={{fontSize: 16, color: '#252525'}}>Total: $<AnimatedNumber value={formik.values.total} /></h2>
        <div style={{display: 'flex', justifyContent: 'space-around', marginTop: 15}}>
            <ButtonUI label='Cancelar' onClick={handleClose} />
            <ButtonUI label='Agregar' onClick={formik.handleSubmit}/>
        </div>
    </Modal>
  )
}
