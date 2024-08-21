/* eslint-disable react-hooks/exhaustive-deps */
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
import { getLoading, setLoading } from '@/redux/loadingSlice';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '@/redux/hook';
import { Product } from '@/interfaces/product.interface';

export default function PrintProduct({open, handleClose}:{open: boolean, handleClose: ()=>void}) {

  const [products, setProducts] = useState<Product[]>([])
  const [valueStorage , setValue] = useLocalStorage("user", "")
  const {open: loading} = useSelector(getLoading)
  const dispatch = useAppDispatch();

  const getProducts = () => {
    dispatch(setLoading(true))
    apiClient.get(`/product`,{
      headers: {
          Authorization: `Bearer ${valueStorage.token}`
      },
  })
    .then(({data}:{data:Product[]})=> {
      const sortedProducts = sortProducts(data);
      setProducts(sortedProducts);
      dispatch(setLoading(false))
    })
    .catch((e)=>{console.log(e);dispatch(setLoading(false))})
  }

  const sortProducts = (products: Product[]): Product[] => {
    return products.sort((a:Product, b:Product) => {
      // Comparar por categoría
      if (a.NameCategoria !== undefined && b.NameCategoria !== undefined) {
        if (a.NameCategoria < b.NameCategoria) return -1;
        if (a.NameCategoria > b.NameCategoria) return 1;
      }
      
      // Si las categorías son iguales, comparar por descripción alfabéticamente
      return a.descripcion.localeCompare(b.descripcion);
    });
  }

  const generatePdf = async () => {
    dispatch(setLoading(true))
    const pdf = new jsPDF('p', 'mm', 'a4');
    for (let index = 0; index < [...Array(totalPartes)].length; index++) {
        const element:any = document.getElementById(`print-${index}`);
        await html2canvas(element, { scale: 1 }).then((canvas) => {
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
    dispatch(setLoading(false))
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
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                  <Button text={'Imprimir'} onClick={generatePdf} />
                  <Button text={'Aceptar'} onClick={handleClose} />
              </div>
              <Container>
              {[...Array(totalPartes)].map((_, index) => {
                  // Calcular el índice de inicio y fin para cada parte
                  const startIndex = index * elementosPorParte;
                  const endIndex = (index + 1) * elementosPorParte;

                  // Obtener los elementos de la parte actual
                  const parteActual = products.slice(startIndex, endIndex);

                  // Mantener un registro de la categoría ya impresa
                  let lastPrintedCategory:string|undefined = '';

                  return (
                  <WrapperPrint key={index}>
                      <ContainerPrint id={`print-${index}`}>
                      <ListProduct>
                          {
                              parteActual.map((item: Product, i: number) => {
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
                                      <ItemsProducts key={i} item={item} select={false} line={false}/>
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

              </Container>
            </div>
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
