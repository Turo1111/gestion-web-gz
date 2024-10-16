import { ObjectId, Types } from 'mongoose'

export interface Product {
  _id?: Types.ObjectId
  descripcion: string
  stock: number
  codigoBarra?: String
  peso?: Peso
  bulto?: number
  sabor?: String
  precioCompra?: number
  precioUnitario: number
  precioBulto?: number
  categoria: string | ObjectId
  marca: string | ObjectId
  proveedor: string | ObjectId
  path?: string
  NameCategoria?: string
  NameMarca?: string
  NameProveedor?: string
}

interface Peso {
  cantidad: number
  unidad: String
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
