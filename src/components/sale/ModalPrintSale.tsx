import React from 'react'
import Modal from '../Modal'
import PrintSale from './PrintSale'
import { Types } from 'mongoose'

export default function ModalPrintSale({open, handleClose, id}:{open:boolean, handleClose: ()=>void, id:string | Types.ObjectId | undefined}) {
  return (
    <Modal open={open} title='Imprimir venta' eClose={handleClose} height='90%' width='60%' >
        <PrintSale id={id} />
    </Modal>
  )
}
