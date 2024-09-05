import { ObjectId, Types } from 'mongoose'

export interface Buy {
  _id?: Types.ObjectId
  estado: string
  user: ObjectId
  proveedor: string
  total: number
  createdAt: string
  itemsBuy: ItemBuy[]
}

export interface ItemBuy {
  _id?: Types.ObjectId
  idBuy?: Types.ObjectId
  idProducto?: Types.ObjectId
  cantidad: number
  total: number
  precio: number
  estado: boolean
}

export interface ExtendItemBuy extends ItemBuy {
  descripcion?: string
  NameCategoria?: string
}
