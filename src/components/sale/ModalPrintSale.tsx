import React from 'react'
import Modal from '../Modal'
import PrintSale from './PrintSale'

export default function ModalPrintSale({open, handleClose, id}:{open:boolean, handleClose: any, id:any}) {
  return (
    <Modal open={open} title='Imprimir venta' eClose={handleClose} height='90%' width='60%' >
        <PrintSale id={id} />
    </Modal>
  )
}
