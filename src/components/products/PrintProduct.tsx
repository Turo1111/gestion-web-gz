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

interface CBP {
  _id: (string | number) 
  descripcion: string
}

export default function PrintProduct({open, handleClose}:{open: boolean, handleClose: ()=>void}) {

  const [categorie, setCategorie] = useState<CBP[]>([])
  const [selectCategorie, setSelectCategorie] = useState<CBP[]>([{
    _id: 0,
    descripcion: 'Todas'
  }])
  const dispatch = useAppDispatch();
  const [valueStorage , setValue] = useLocalStorage("user", "")

  useEffect(()=>{
    const getCategorie = () => {
      dispatch(setLoading(true));
      apiClient.get(`/categorie`)
      .then(function(response){
        console.log(response.data)
        setCategorie(prevData => [{
          _id: 0,
          descripcion: 'Todas'
        }, ...response.data])
        dispatch(setLoading(false));
      })
      .catch(function(error){
          console.log("get",error);
          dispatch(setLoading(false));
      })
    }

    if (open) {
      getCategorie()
    }
}, [open])

  return (
    <Modal open={open} eClose={handleClose} title='Imprimir productos' width='30%' height='auto' >
        <div style={{display: 'flex', flexWrap: 'wrap'}} >
          {
            categorie.map((item: CBP, index: number)=><ItemCategorie key={index} $active={selectCategorie.find(elem=>elem._id === item._id) ? true : false} 
              onClick={()=>{
                setSelectCategorie((prevData: CBP[])=>{
                  if (item._id !== 0) {
                    let clearPrev = prevData.filter((itemPrev)=>itemPrev._id !== 0 && itemPrev._id !== item._id)
                    return [...clearPrev, item]
                  }
                  return [item]
                  
                })
              }}
            >
              {item.descripcion}
            </ItemCategorie>)
          }
        </div>
        <div style={{display: 'flex', justifyContent: 'center'}} >
          <Button text='Imprimir' onClick={()=>{
            dispatch(setLoading(true))
            let filterCategorie = selectCategorie.map(item=>item._id !== 0 && item.descripcion)
            apiClient.post(`/product/print/print`, {categories: filterCategorie[0] !== false ? filterCategorie : undefined}, { responseType: 'blob',
              headers: {
                Authorization: `Bearer ${valueStorage.token}`
              },
             }) // Importante: usar 'blob' para recibir el PDF
            .then(response => {
              const blob = new Blob([response.data], { type: 'application/pdf' });
              const url = window.URL.createObjectURL(blob);

              // Crear un enlace temporal para descargar el archivo
              const link = document.createElement('a');
              link.href = url;
              link.setAttribute('download', `ListaDePrecios.pdf`); // Nombre del archivo descargado
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);

              // Liberar memoria
              window.URL.revokeObjectURL(url);
              dispatch(setLoading(false))
            })
            .catch(error => {
              console.error('Error descargando el PDF:', error);
              dispatch(setLoading(false))
            });
          }} />
        </div>
    </Modal>
  );
}

const ItemCategorie = styled.div <{$active: boolean}>`
  cursor: pointer;
  padding: 5px 15px;
  border: 1px solid #d9d9d9;
  margin: 15px;
  border-radius: 5px;
  color: ${({ $active }) => ($active ? '#fff' : '#black')};
  background-color: ${({ $active }) => ($active ? '#3764A0' : '#fff')};
  border: ${({ $active }) => ($active ? '2px solid #fff' : '2px solid #d9d9d9')};
  &:hover {
    color: ${({ $active }) => (!$active ? '#fff' : 'none')};
    background-color: ${({ $active }) => (!$active ? '#3764A0' : 'none')};
    border: ${({ $active }) => (!$active ? '2px solid #fff ' : 'none')};
  }
`