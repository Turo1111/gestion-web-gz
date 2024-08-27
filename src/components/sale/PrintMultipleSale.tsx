/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import styled, { CSSProperties } from 'styled-components';
import Table from '../Table';
import apiClient from '@/utils/client';
import useLocalStorage from '@/hooks/useLocalStorage';
import { useAppDispatch } from '@/redux/hook';
import { setLoading } from '@/redux/loadingSlice';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Logo from '../Logo';
import { Sale } from '@/interfaces/sale.interface';
import { ItemSale } from '../../interfaces/sale.interface';
import Button from '../Button';
import Modal from '../Modal';

interface ResponseSale {
  r: Sale
  itemsSale: ItemSale[]
}

interface Column {
  label: string
  field: string
  width: string
  align?: CSSProperties['textAlign']
  price?: boolean
  date?: boolean
}

export default function PrintMultipleSale({open, handleClose, salesIds}:{open:boolean, handleClose: ()=>void, salesIds:Sale[]}) {
    const [sales, setSales] = useState<ResponseSale[]>([]);
    const [valueStorage , setValue] = useLocalStorage("user", "")
    const dispatch = useAppDispatch();
  
    const getSales = () => {
      dispatch(setLoading(true));
      const requests = salesIds.map((item: Sale) => 
        apiClient.get(`/sale/${item._id}`, {
          headers: {
            Authorization: `Bearer ${valueStorage.token}`
          },
        })
      );
  
      Promise.all(requests)
        .then((responses) => {
          const data = responses.map(({data}) => data);
          setSales(data);
          dispatch(setLoading(false));
        })
        .catch((e) => {console.log(e); dispatch(setLoading(false))});
    }

    useEffect(()=>console.log("sales",sales),[sales]) 
  
    const generatePdf = async () => {
        dispatch(setLoading(true));
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        
        const boletasPorFila = 2; // Número de boletas por fila
        const boletasPorColumna = 2; // Número de boletas por columna
        const boletaWidth = pageWidth / boletasPorFila; // Ajustar para que quepan 2 boletas en una fila
        const boletaHeight = pageHeight / boletasPorColumna; // Ajustar para que quepan 3 boletas en una columna
      
        let xOffset = 0;
        let yOffset = 0;
      
        for (let saleIndex = 0; saleIndex < sales.length; saleIndex++) {
          const sale = sales[saleIndex];
      
          for (let index = 0; index < [...Array(totalParts[saleIndex])].length; index++) {
            const element: any = document.getElementById(`print-${saleIndex}-${index}`);
            
            await html2canvas(element).then((canvas) => {
              const imgData = canvas.toDataURL('image/png');
      
              // Agregar imagen en la posición calculada
              pdf.addImage(imgData, 'PNG', xOffset, yOffset, boletaWidth, boletaHeight);
      
              // Calcular la siguiente posición
              xOffset += boletaWidth;
              if (xOffset + boletaWidth > pageWidth) {
                xOffset = 0;
                yOffset += boletaHeight;
              }
      
              // Si la siguiente boleta no cabe en la misma página, agregar una nueva página
              if (yOffset + boletaHeight > pageHeight) {
                pdf.addPage();
                xOffset = 0;
                yOffset = 0;
              }
            });
          }
        }
      
        const pdfName = `ventas.pdf`;
        pdf.save(pdfName);
        dispatch(setLoading(false));
      };
      
  
    useEffect(() => {
      getSales();
    }, [salesIds]);
  
    // Definir el número máximo de elementos por parte
    const elementsPerPart = 28;
  
    // Calcular el número total de partes necesarias por venta
    const totalParts = sales.map(sale => 
      sale.itemsSale.length !== 0 ? Math.ceil(sale.itemsSale.length / elementsPerPart) : 0
    );
  
    if (!sales.length) {
      return null;
    }
  
    return (
    <Modal open={open} title='Imprimir venta' eClose={handleClose} height='90%' width='60%' >

      <Container>
        <div style={{ display: 'flex', justifyContent: 'end' }}>
          <Button text={'Imprimir'} onClick={generatePdf} />
        </div>
        {sales.map((sale, saleIndex) => (
          [...Array(totalParts[saleIndex])].map((_, index) => {
            const startIndex = index * elementsPerPart;
            const endIndex = (index + 1) * elementsPerPart;
            const currentPart = sale.itemsSale.slice(startIndex, endIndex);
  
            return (
              <WrapperPrint key={`${saleIndex}-${index}`}>
                <ContainerPrint id={`print-${saleIndex}-${index}`}>
                  <Logo />
                  <h2 style={{ fontSize: 18, color: '#252525' }}>Presupuesto</h2>
                  <div>
                    <Tag>CLIENTE : {sale.r.cliente}</Tag>
                    <Tag>FECHA : {sale.r.createdAt.split("T")[0]}</Tag>
                  </div>
                  <div>
                    <Table
                      data={currentPart}
                      columns={columns}
                      maxHeight={false}
                      onClick={() => ''}
                      print={true}
                    />
                  </div>
                  <Tag style={{ textAlign: 'end' }}>TOTAL : $ {sale.r.total}</Tag>
                  <p style={{ fontSize: 18, color: '#252525', fontWeight: 600 }}>*No valido como factura</p>
                  <p style={{ fontSize: 18, color: '#252525', textAlign: 'end', fontWeight: 500 }}>
                    Pagina {index + 1} de {totalParts[saleIndex]}
                  </p>
                </ContainerPrint>
              </WrapperPrint>
            );
          })
        ))}
      </Container>
    </Modal>
    );
}



const columns: Column[] = [
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
    font-weight: 400;
    margin: 10px 0;
    color: ${process.env.TEXT_COLOR};
  `;

const Boleta = styled.div`
  width: 100mm;  /* Ancho fijo */
  height: 200mm; /* Alto fijo */
  margin: 5mm;   /* Margen entre boletas */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border: 1px solid #ddd; /* Añadir un borde para visibilidad */
`;
  