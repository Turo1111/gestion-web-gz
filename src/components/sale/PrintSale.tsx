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
import { useAppDispatch } from '@/redux/hook';
import { setLoading } from '@/redux/loadingSlice';
import { Types } from 'mongoose';
import { Sale } from '@/interfaces/sale.interface';
import { ItemSale } from '../../interfaces/sale.interface';

interface ResponseSale {
  r: Sale
  itemsSale: ItemSale[]
}

export default function PrintSale({id}:{id: string | Types.ObjectId}) {

  const [sale, setSale] = useState<ResponseSale | undefined>(undefined)
  const [valueStorage , setValue] = useLocalStorage("user", "")
  const dispatch = useAppDispatch();

  const getSale = () => {
    dispatch(setLoading(true))
    apiClient.get(`/sale/${id}`,{
      headers: {
          Authorization: `Bearer ${valueStorage.token}`
      },
  })
    .then(({data}:{data: ResponseSale})=>{setSale(data);dispatch(setLoading(false));})
    .catch((e:any)=>{console.log(e);dispatch(setLoading(false))})
  }

  const generatePdf = async () => {
    
    const pdf = new jsPDF('p', 'mm', 'a4');
    for (let index = 0; index < [...Array(totalPartes)].length; index++) {
      const element: any = document.getElementById(`print-${index}`);
      await html2canvas(element).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = pdfWidth;
        const imgHeight = pdfHeight;
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      });
      if (index < [...Array(totalPartes)].length-1) {
        pdf.addPage()
      }
    }
    if (!sale) {
      return
    }
    const pdfName = `venta-${sale.r.cliente}-${sale.r.createdAt.split("T")[0]}.pdf`;
    pdf.save(pdfName);
  };

  useEffect(()=> {
    getSale()
  },[id])

  // Definir el número máximo de elementos por parte
  const elementosPorParte = 28;

  // Calcular el número total de partes necesarias
  let totalPartes = 0

  if (sale) {
      if (sale?.itemsSale.length !== 0) {
        totalPartes = Math.ceil(sale.itemsSale.length / elementosPorParte);
      }
  }

  if (!sale) {
    return
  }

  return (
    <Container>
      <div style={{ display: 'flex', justifyContent: 'end' }}>
        <Button text={'Imprimir'} onClick={generatePdf} />
      </div>
      {[...Array(totalPartes)].map((_, index) => {
        // Calcular el índice de inicio y fin para cada parte
        const startIndex = index * elementosPorParte;
        const endIndex = (index + 1) * elementosPorParte;

        // Obtener los elementos de la parte actual
        const parteActual = sale.itemsSale.slice(startIndex, endIndex);

        return (
          <WrapperPrint key={index}>
            <ContainerPrint id={`print-${index}`}>
            <Logo/>
            <h2 style={{fontSize: 18, color: '#252525'}}>Presupuesto</h2>
            <div>
                <Tag>CLIENTE : {sale.r.cliente}</Tag>
                <Tag>FECHA : {sale.r.createdAt.split("T")[0]}</Tag>
              </div>
              <div>
                <Table
                  data={parteActual}
                  columns={columns}
                  maxHeight={false}
                  onClick={() => ''}
                />
            </div>
            <Tag style={{ textAlign: 'end' }}>TOTAL : $ {sale.r.total}</Tag> 
            <p style={{fontSize: 18, color: '#252525', fontWeight: 600}}>*No valido como factura</p>
            <p style={{fontSize: 18, color: '#252525', textAlign: 'end', fontWeight: 500}}>Pagina {index+1} de {totalPartes}</p>
            </ContainerPrint>
          </WrapperPrint>
        );
      })}
    </Container>
  );
}

const columns = [
  { label: 'Producto', field: 'descripcion', width: '40%' },
  { label: 'Cantidad', field: 'cantidad', width: '20%', align: 'center' },
  { label: 'P. unitario', field: 'precioUnitario', width: '20%', align: 'center', price: true },
  { label: 'Total', field: 'total', width: '20%', align: 'center', price: true },
];

const Container = styled.div`
  overflow-y: scroll;
`;

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
  font-size: 18px;
  padding: 0 15px;
  font-weight: 600;
  margin: 10px 0;
  color: ${process.env.TEXT_COLOR};
`;