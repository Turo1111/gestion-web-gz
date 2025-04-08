import useLocalStorage from '@/hooks/useLocalStorage';
import { Buy, ExtendItemBuy, ItemBuy } from '@/interfaces/buy.interface';
import { Product } from '@/interfaces/product.interface';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Types } from 'mongoose';
const initialState: Buy = {
  _id: '',
  estado: '',
  proveedor: '',
  total: 0,
  createdAt: '',
  itemsBuy: []
};

const buySlice = createSlice({
  name: 'buy',
  initialState,
  reducers: { 
    addItemBuy: (state, action: PayloadAction<{ item: Product }>) => {
      const item = action.payload.item
      const exist = state.itemsBuy.find((elem:ExtendItemBuy)=>elem.idProducto===item._id)
      if (exist) {
         return
      }
      const newItem: ExtendItemBuy = {...item, cantidad: 1, total: item.precioCompra ? item.precioCompra : item.precioUnitario, idProducto: item._id, precio: item.precioCompra ? item.precioCompra : item.precioUnitario, estado: true}
      state.itemsBuy = [...state.itemsBuy, newItem]
      state.total = calculateTotal(state.itemsBuy)
    },
    deleteItemBuy: (state, action: PayloadAction<{ id: Types.ObjectId | string  }>) => {
        const id = action.payload.id
        state.itemsBuy = state.itemsBuy.filter((elem:ExtendItemBuy)=>elem.idProducto!==id)
        state.total = calculateTotal(state.itemsBuy)
    },
    onChangePrecioUnitarioBuy: (state, action: PayloadAction<{ value:string; idProducto: Types.ObjectId | string }>) => {
      const value = action.payload.value
      const idProducto = action.payload.idProducto
      let parseValue = parseFloat(value)
      if (value === '') {
        parseValue = 0
      }
      const itemsBuy = state.itemsBuy.find(elem=>elem.idProducto === idProducto)
      if(!itemsBuy){
        return
      }
      const newItemBuy = {...itemsBuy, precio: parseValue, total: itemsBuy?.cantidad*parseValue}
      const prevFiltered = state.itemsBuy.map((elem:ExtendItemBuy)=>elem.idProducto===idProducto ? newItemBuy : elem)
      state.itemsBuy = prevFiltered
      state.total = calculateTotal(state.itemsBuy)
    },
    upQTYBuy: (state, action: PayloadAction<{ id: Types.ObjectId | string }>) => {
      const id = action.payload.id
      state.itemsBuy=state.itemsBuy.map((elem:ExtendItemBuy)=>{
        return elem.idProducto===id ? {...elem, cantidad: elem.cantidad+1, total: parseFloat((elem.precio*(elem.cantidad+1)).toFixed(2))} : elem
      })
      state.total = calculateTotal(state.itemsBuy)
    },
    downQTYBuy: (state, action: PayloadAction<{ id: Types.ObjectId | string }>) => {
      const id = action.payload.id
      state.itemsBuy=state.itemsBuy.map((elem:ExtendItemBuy)=>{
        if (elem.idProducto===id) {
          if (elem.cantidad-1 > 1 ) {
            return {...elem, cantidad: elem.cantidad-1, total: parseFloat((elem.precio*(elem.cantidad-1)).toFixed(2))}
          }
          return {...elem, cantidad: 1, total: elem.precio}
        }
        return elem
      })
      state.total = calculateTotal(state.itemsBuy)
    },
    upQTY10Buy: (state, action: PayloadAction<{ id: Types.ObjectId | string }>) => {
      const id = action.payload.id
      state.itemsBuy=state.itemsBuy.map((elem:ExtendItemBuy)=>{
        return elem.idProducto===id ? {...elem, cantidad: elem.cantidad+10, total: parseFloat((elem.precio*(elem.cantidad+10)).toFixed(2))} : elem
      })
      state.total = calculateTotal(state.itemsBuy)
    },
    downQTY10Buy: (state, action: PayloadAction<{ id: Types.ObjectId | string }>) => {
      const id = action.payload.id
      state.itemsBuy=state.itemsBuy.map((elem:ExtendItemBuy)=>{
        if (elem.idProducto===id) {
          if (elem.cantidad > 10 ) {
            return {...elem, cantidad: elem.cantidad-10, total: parseFloat((elem.precio*(elem.cantidad-10)).toFixed(2))}
          }
          return elem
        }
        return elem
      })
      state.total = calculateTotal(state.itemsBuy)
    },
    onChangeProveedor: (state, action: PayloadAction<{ proveedor: string }>) => {
        const proveedor = action.payload.proveedor
        state.proveedor = proveedor
        state.total = calculateTotal(state.itemsBuy)
    },
    setItemsBuy: (state, action: PayloadAction<{ itemsBuy: ExtendItemBuy[] }>) => {
      const itemsBuy = action.payload.itemsBuy
      state.itemsBuy=itemsBuy
      state.total = calculateTotal(state.itemsBuy)
    },
    resetBuy: (state, action) => {
      state._id= '',
      state.estado= '',
      state.proveedor= '',
      state.total= 0,
      state.createdAt= '',
      state.itemsBuy= []
    },
    setBuy: (state, action: PayloadAction<{ buy: Buy }>) => {
      const buyData = action.payload.buy
      state._id= buyData._id,
      state.estado= buyData.estado,
      state.proveedor= buyData.proveedor,
      state.total= buyData.total,
      state.createdAt= buyData.createdAt,
      state.itemsBuy= buyData.itemsBuy
    },
  },
});

const calculateTotal = (items: ExtendItemBuy[]) =>items.reduce((accumulator:number, currentValue: ItemBuy) =>accumulator + currentValue.total,0)

export const getBuy = (state: { buy: Buy }) => state.buy
export const getItemBuy = (state: { buy: Buy }) => state.buy.itemsBuy
export const { addItemBuy, deleteItemBuy, onChangePrecioUnitarioBuy, upQTYBuy, downQTYBuy, upQTY10Buy, downQTY10Buy, onChangeProveedor, setItemsBuy, resetBuy, setBuy } = buySlice.actions;
export default buySlice.reducer;
