import React, { useEffect, useState } from 'react'
import styled from 'styled-components';
import Table from '../Table';
import apiClient from '@/utils/client';
import useLocalStorage from '@/hooks/useLocalStorage';
import Logo from '../Logo';
import Modal from '../Modal';

export default function InfoSale({open, handleClose, id}:{open:boolean, handleClose: any, id:any}) {

  const [sale, setSale] = useState<any>(undefined)
  const [valueStorage , setValue] = useLocalStorage("user", "")

  const getSale = () => {
    apiClient(`/sale/${id}`,{
      headers: {
          Authorization: `Bearer ${valueStorage.token}`
      },
  })
    .then((r:any)=>{setSale(r.data)})
    .catch((e:any)=>console.log(e))
  }

  useEffect(()=> {
    getSale()
  },[id])

  return (
    <Modal open={open} title={'Info de la venta'} eClose={handleClose} height='auto' width='60%' >
      <div>
        <div id={`print`}>
        {
          sale && 
          <>
          <Logo/>
          <div>
              <Tag>CLIENTE : {sale.r.cliente}</Tag>
              <Tag>FECHA : {sale.r.createdAt.split("T")[0]}</Tag>
            </div>
            <div>
              <Table
                data={sale.itemsSale}
                columns={columns}
                maxHeight={false}
                onClick={() => ''}
              />
            </div>
            <Tag style={{ textAlign: 'end' }}>TOTAL : $ {sale.r.total}</Tag> 
          </>
        }
        </div>
      </div>
    </Modal>
  );
}

const columns = [
  { label: 'Producto', field: 'descripcion', width: '50%' },
  { label: 'Cantidad', field: 'cantidad', width: '20%', align: 'center' },
  { label: 'Total', field: 'total', width: '30%', align: 'center', price: true },
];



const Tag = styled.h5`
  font-size: 16px;
  padding: 0 15px;
  font-weight: 500;
  margin: 10px 0;
  color: ${process.env.TEXT_COLOR};
  @media only screen and (max-width: 768px) {
    font-size: 14px;
  }
`;