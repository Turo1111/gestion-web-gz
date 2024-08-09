import React, { useEffect, useState } from 'react'
import styled from 'styled-components';
import apiClient from '@/utils/client';
import useLocalStorage from '@/hooks/useLocalStorage';
import Button from '../Button';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Modal from '../Modal';
import ItemsProducts from './ItemsProducts';
import Logo from '../Logo';

export default function PrintProduct({open, handleClose}:{open: boolean, handleClose: any}) {

  const [products, setProducts] = useState<any[]>([])
  const [valueStorage , setValue] = useLocalStorage("user", "")

  const getProducts = () => {
    apiClient.get(`/product`,{
      headers: {
          Authorization: `Bearer ${valueStorage.token}`
      },
  })
    .then((r:any)=> {
      const sortedProducts = sortProducts(r.data);
      setProducts(sortedProducts);
    })
    .catch((e:any)=>console.log(e))
  }

  const sortProducts = (products: any[]): any[] => {
    return products.sort((a, b) => {
      // Comparar por categoría
      if (a.NameCategoria < b.NameCategoria) return -1;
      if (a.NameCategoria > b.NameCategoria) return 1;
      
      // Si las categorías son iguales, comparar por descripción alfabéticamente
      return a.descripcion.localeCompare(b.descripcion);
    });
  }

  const generatePdf = async () => {
    const pdf = new jsPDF('p', 'mm', 'a4');
    for (let index = 0; index < [...Array(totalPartes)].length; index++) {
        const element:any = document.getElementById(`print-${index}`);
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
    const pdfName = `Lista-de-Productos-Golozur.pdf`;
    pdf.save(pdfName);
  };

  useEffect(()=> {
    getProducts()
  },[])

  // Definir el número máximo de elementos por parte
  const elementosPorParte = 12;

  // Calcular el número total de partes necesarias
  let totalPartes = 0

  if (products) {
      if (products?.length !== 0) {
        totalPartes = Math.ceil(products.length / elementosPorParte);
      }
  }

  return (
    <Modal open={open} eClose={handleClose} title='Imprimir productos' width='90%' height='90%' >
        {
            products.length !== 0 &&
            <Container>
            {[...Array(totalPartes)].map((_, index) => {
                // Calcular el índice de inicio y fin para cada parte
                const startIndex = index * elementosPorParte;
                const endIndex = (index + 1) * elementosPorParte;

                // Obtener los elementos de la parte actual
                const parteActual = products.slice(startIndex, endIndex);

                // Mantener un registro de la categoría ya impresa
                let lastPrintedCategory = '';

                return (
                <WrapperPrint key={index}>
                    <ContainerPrint id={`print-${index}`}>
                    <ListProduct>
                        {
                            parteActual.map((item: any, i: any, array: any) => {
                                // Mostrar el nombre de la categoría solo si no ha sido impreso en la parte actual
                                const showCategoryTitle = lastPrintedCategory !== item.NameCategoria;

                                if (showCategoryTitle) {
                                  lastPrintedCategory = item.NameCategoria;
                                }

                                return (
                                  <React.Fragment key={i}>
                                    {showCategoryTitle && (
                                      <CategoryTitle>{item.NameCategoria}</CategoryTitle>
                                    )}
                                    <ItemsProducts key={item._id} item={item} select={false} line={false}/>
                                  </React.Fragment>
                                );
                            })
                        }
                    </ListProduct>
                    <Logo small={true} />
                    </ContainerPrint>
                </WrapperPrint>
                );
            })}

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button text={'Imprimir'} onClick={generatePdf} />
                <Button text={'Aceptar'} onClick={handleClose} />
            </div>
            </Container>
        }
    </Modal>
  );
}

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
  /* Otros estilos fijos aquí */
`;

const ListProduct = styled.ul `
  display: flex;
  flex: 1;
  width: 100%;
  flex-direction: column;
  padding: 0 15px;
  overflow-y: scroll;
`;

const CategoryTitle = styled.h2`
  font-size: 18px;
  margin: 5px 0px;
  padding: 15px 0px;
  color: #3764A0;
  border-bottom: 1px solid #d1d1d1;
`;
