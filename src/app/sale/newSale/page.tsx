'use client'
import React, { useEffect, useState } from 'react'
import { getUser, setUser } from '@/redux/userSlice';
import { useAppDispatch } from '@/redux/hook';
import { useSelector } from 'react-redux';
import useLocalStorage from '@/hooks/useLocalStorage';
import styled from 'styled-components';
import { useRouter } from 'next/navigation';
import FindProductSale from '@/components/sale/FindProductSale';
import LineaVenta from '@/components/sale/LineaVenta';
import { useResize } from '@/hooks/useResize';

export default function NewSale() {

    const [valueStorage , setValue] = useLocalStorage("user", "")
    const [newSaleStorage, setValueStorage] = useLocalStorage("newSale", "")
    const [lineaVenta, setLineaVenta] = useState<any>([])
    const [total, setTotal] = useState(0)
    const router = useRouter()
    let {ancho, alto} = useResize()
    const [openLVMobile, setOpenLVMobile] = useState(false)
    const [cliente, setCliente] = useState<any>('')

    const user = useSelector(getUser)
    const dispatch = useAppDispatch();

    useEffect(() => {
      if (!user && valueStorage) {
        dispatch(setUser(valueStorage))
      }
      if (!valueStorage) {
        router.push('/')
      }
    }, [valueStorage, user, dispatch])

  useEffect(()=>{
    const sumWithInitial = lineaVenta.reduce(
        (accumulator:any, currentValue: any) => parseFloat(accumulator) + parseFloat(currentValue.total),
        0,
    );
    setTotal(prevData=>parseFloat(parseFloat(sumWithInitial).toFixed(2)))
  },[lineaVenta])

  /* useEffect(()=>{
    if (lineaVenta.length !== 0 || cliente !== '' || total !== 0) {
      setValueStorage({lineaVenta:lineaVenta, cliente:cliente, total:total})
    }
  },[lineaVenta, cliente, total])

  useEffect(() => {
    if (newSaleStorage) {
      setLineaVenta((prevData:any)=>newSaleStorage.lineaVenta)
      setCliente((prevData:any)=>newSaleStorage.cliente)
      setTotal((prevData:any)=>newSaleStorage.total)
    }
  }, [newSaleStorage]) */

  return (
    <Container>
      {
        ancho > 940 ?
        <div style={{display: 'flex', flex: 1}}>
          <ContainerListProduct>
            <FindProductSale
              onClickItem={(item:any)=>{
                setLineaVenta((prevData:any)=>{
                    const exist = prevData.find((elem:any)=>elem._id===item._id)
                    if (exist) {
                        return prevData.map((elem: any) =>
                            elem._id === item._id ? {...item, cantidad: 1, total: item.precioUnitario} : elem
                        )
                    }
                    return [...prevData, {...item, cantidad: 1, total: item.precioUnitario, idProducto: item._id}]
                })
            } }
            />
          </ContainerListProduct>
          <LineaVenta lineaVenta={lineaVenta} total={total} cliente={cliente} onChangeCliente={(value:any)=>setCliente((prevData:any)=>value)}
            onClick={(item:any)=>setLineaVenta((prevData:any)=>prevData.filter((elem:any)=>elem._id!==item._id))}
            upQTY={(id:any)=>setLineaVenta((prevData:any)=>prevData.map((elem:any)=>{
              return elem._id===id ? {...elem, cantidad: elem.cantidad+1, total: (elem.precioUnitario*(elem.cantidad+1)).toFixed(2)} : elem
            }))}
            downQTY={(id:any)=>setLineaVenta((prevData:any)=>prevData.map((elem:any)=>{
              if (elem._id===id) {
                if (elem.cantidad-1 > 1 ) {
                  return {...elem, cantidad: elem.cantidad-1, total: (elem.precioUnitario*(elem.cantidad-1)).toFixed(2)}
                }
                return {...elem, cantidad: 1, total: elem.precioUnitario}
              }
              return elem
            }))}
            upQTY10={(id:any)=>setLineaVenta((prevData:any)=>prevData.map((elem:any)=>{
              return elem._id===id ? {...elem, cantidad: elem.cantidad+10, total: (elem.precioUnitario*(elem.cantidad+10)).toFixed(2)} : elem
            }))}
            downQTY10={(id:any)=>setLineaVenta((prevData:any)=>prevData.map((elem:any)=>{
              if (elem._id===id) {
                if (elem.cantidad > 10 ) {
                  return {...elem, cantidad: elem.cantidad-10, total: (elem.precioUnitario*(elem.cantidad-10)).toFixed(2)}
                }
                return elem
              }
              return elem
            }))}
          />
        </div>:
        <ContainerMobile>
          <FindProductSale
              onClickItem={(item:any)=>{
                setLineaVenta((prevData:any)=>{
                    const exist = prevData.find((elem:any)=>elem._id===item._id)
                    if (exist) {
                        return prevData.map((elem: any) =>
                            elem._id === item._id ? {...item, cantidad: 1, total: item.precioUnitario} : elem
                        )
                    }
                    return [...prevData, {...item, cantidad: 1, total: item.precioUnitario, idProducto: item._id}]
                })
            } }
            />
          <WrapperLineaVenta $openLVMobile={openLVMobile}>
            {
              openLVMobile && 
              <div>
                <LineaVenta lineaVenta={lineaVenta} total={total} cliente={cliente} onChangeCliente={(value:any)=>console.log(value)}
                  onClick={(item:any)=>setLineaVenta((prevData:any)=>prevData.filter((elem:any)=>elem._id!==item._id))}
                  upQTY={(id:any)=>setLineaVenta((prevData:any)=>prevData.map((elem:any)=>{
                    return elem._id===id ? {...elem, cantidad: elem.cantidad+1, total: (elem.precioUnitario*(elem.cantidad+1)).toFixed(2)} : elem
                  }))}
                  downQTY={(id:any)=>setLineaVenta((prevData:any)=>prevData.map((elem:any)=>{
                    if (elem._id===id) {
                      if (elem.cantidad-1 > 1 ) {
                        return {...elem, cantidad: elem.cantidad-1, total: (elem.precioUnitario*(elem.cantidad-1)).toFixed(2)}
                      }
                      return {...elem, cantidad: 1, total: elem.precioUnitario}
                    }
                    return elem
                  }))}
                  upQTY10={(id:any)=>setLineaVenta((prevData:any)=>prevData.map((elem:any)=>{
                    return elem._id===id ? {...elem, cantidad: elem.cantidad+10, total: (elem.precioUnitario*(elem.cantidad+10)).toFixed(2)} : elem
                  }))}
                  downQTY10={(id:any)=>setLineaVenta((prevData:any)=>prevData.map((elem:any)=>{
                    if (elem._id===id) {
                      if (elem.cantidad > 10 ) {
                        return {...elem, cantidad: elem.cantidad-10, total: (elem.precioUnitario*(elem.cantidad-10)).toFixed(2)}
                      }
                      return elem
                    }
                    return elem
                  }))}
                />
              </div>
            }
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}} >
              <h2 style={{fontSize: 18}} > {lineaVenta.length} Productos </h2>
              <h2 style={{fontSize: 18}} >Total: $ {total} </h2>
              <h2 style={{fontSize: 18, color: '#3764A0'}} onClick={()=>setOpenLVMobile(!openLVMobile)} >{openLVMobile ? 'CERRAR':'ABRIR'}</h2>
            </div>
          </WrapperLineaVenta>
        </ContainerMobile>
      }
    </Container>
  )
}

const WrapperLineaVenta = styled.div<{$openLVMobile: boolean;}> `
  position: absolute;
  bottom: ${({ $openLVMobile }) => ($openLVMobile ? 'none' : '15px')};
  top: ${({ $openLVMobile }) => ($openLVMobile ? '-25px' : 'none')};
  width: 100%;
  background-color: #F7F7F8;
  border: 1px solid #d9d9d9;
  border-radius: 15px;
  padding: 15px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  min-height: 80%;
`

const ContainerMobile = styled.div `
  position:relative;
  display: flex;
  flex: 1;
  flex-direction: column;
`

const ContainerListProduct = styled.div `
  width: 50%;
  @media only screen and (max-width: 940px) {
    width: 100%;
  }
`


const Container = styled.div`
  display: flex;
  flex: 1;
  @media only screen and (max-width: 940px) {
    flex-direction: column;
  }
`

const ContainerListLineaVenta = styled.div`
  display: flex;
  flex: 1;
  width: 50%;
  flex-direction: column;
  @media only screen and (max-width: 940px) {
    width: 100%;
  }
`


const ListProduct = styled.ul `
  display: flex;
  flex: 1;
  width: 100%;
  flex-direction: column;
  padding: 0 15px;
  overflow-y: scroll;
`