import { ObjectId, Types } from 'mongoose'

export interface Product {
  _id?: Types.ObjectId | string
  descripcion: string
  stock: number
  codigoBarra?: string
  peso?: Peso
  bulto?: number
  sabor?: string
  precioCompra?: number
  precioUnitario: number
  precioDescuento?: number
  precioBulto?: number
  categoria: string | Types.ObjectId | undefined
  marca: string | Types.ObjectId | undefined
  proveedor: string | Types.ObjectId | undefined
  path?: string
  NameCategoria?: string
  NameMarca?: string
  NameProveedor?: string
}

interface Peso {
  cantidad: number
  unidad: string 
}
export interface Categorie {
  descripcion: string
}

export interface Brand {
  descripcion: string
}

export interface Provider {
  descripcion: string
}
