import React, { useEffect, useState } from 'react'
import styled from 'styled-components';
import Table from '../Table';
import apiClient from '@/utils/client';
import useLocalStorage from '@/hooks/useLocalStorage';
import { useDate } from '@/hooks/useDate';
import Button from '../Button';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Logo from '../Logo';

export default function PrintSale({id}:{id: any}) {

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

  const generatePdf = async () => {
    const pdf = new jsPDF('p', 'mm', 'a4');
      const element: any = document.getElementById(`print`);
      await html2canvas(element).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = pdfWidth;
        const imgHeight = pdfHeight;
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      });
    const pdfName = `venta-${sale.r.cliente}-${sale.r.createdAt.split("T")[0]}.pdf`;
    pdf.save(pdfName);
  };

  useEffect(()=> {
    getSale()
  },[id])

  useEffect(()=> {
    console.log("sale",sale?.itemsSale)
  },[sale])

  return (
    <div>
      <WrapperPrint>
        <ContainerPrint id={`print`}>
        {
          sale && 
          <>
            <Logo/>
            <h2 style={{fontSize: 18, color: '#252525'}}>Presupuesto</h2>
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
            <p>*No valido como factura</p>
          </>
        }
        </ContainerPrint>
      </WrapperPrint>
      <div style={{ display: 'flex', justifyContent: 'end' }}>
        <Button text={'Imprimir'} onClick={generatePdf} />
      </div>
    </div>
  );
}

const columns = [
  { label: 'Producto', field: 'descripcion', width: '50%' },
  { label: 'Cantidad', field: 'cantidad', width: '20%', align: 'center' },
  { label: 'Total', field: 'total', width: '30%', align: 'center', price: true },
];

const WrapperPrint = styled.div`
  overflow: scroll;
  max-height: 500px;
`;

const ContainerPrint = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  width: 210mm; /* Tamaño A4 */
  height: 297mm;
  margin: 0 auto;
  padding: 10mm; /* Márgenes de 10mm */
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: 16px; /* Tamaño de fuente fijo */
`;

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