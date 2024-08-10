import React, { useEffect, useState } from 'react'
import styled from 'styled-components';
import Table from '../Table';
import apiClient from '@/utils/client';
import useLocalStorage from '@/hooks/useLocalStorage';
import Logo from '../Logo';
import Modal from '../Modal';

export default function InfoBuy({open, handleClose, id}:{open:boolean, handleClose: any, id:any}) {

  const [buy, setBuy] = useState<any>(undefined)
  const [valueStorage , setValue] = useLocalStorage("user", "")

  const getBuy = () => {
    apiClient(`/buy/${id}`,{
      headers: {
          Authorization: `Bearer ${valueStorage.token}`
      },
  })
    .then((r:any)=>{setBuy(r.data)})
    .catch((e:any)=>console.log(e))
  }

  useEffect(()=> {
    getBuy()
  },[id])

  return (
    <Modal open={open} title={'Info de la compra'} eClose={handleClose} height='auto' width='60%' >
      <div>
        <div id={`print`}>
        {
          buy && 
          <>
          <Logo/>
          <div>
              <Tag>Proveedor : {buy.r.proveedor}</Tag>
              <Tag>FECHA : {buy.r.createdAt.split("T")[0]}</Tag>
            </div>
            <div>
              <Table
                data={buy.itemsBuy}
                columns={columns}
                maxHeight={false}
                onClick={() => ''}
              />
            </div>
            <Tag style={{ textAlign: 'end' }}>TOTAL : $ {buy.r.total}</Tag> 
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