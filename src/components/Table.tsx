import { useDate } from '@/hooks/useDate'
import React from 'react'
import styled from 'styled-components'

export default function Table({data = [], columns, onClick, date=false, maxHeight = true, title}: {data: any, columns: any, onClick: any, date?: any, maxHeight: any, title?: any}) {
  return (
    <div>
      {title && <Tag>{title}</Tag>}
      <List maxHeight={maxHeight || true}>
          <TableHeader color={process.env.TEXT_COLOR}>
              {columns.map((column: any, index: any) => (
                <div key={index} style={{ flexBasis: column.width, textAlign: column.align }}>
                  {column.label}
                </div>
              ))}
          </TableHeader>
          {
              data.length === 0 ?
                  <TableRow>
                      <div style={{textAlign: 'center'}} data-label="Sucursal">NO HAY ELEMENTOS</div>
                  </TableRow>
              :
              data.map((item:any,index:any)=>{

                return(
                  <TableRow key={index} onClick={()=>onClick(item)} color={process.env.TEXT_COLOR} >
                      {columns.map((column: any, columnIndex: any) =>{ 
                        // eslint-disable-next-line
                        const fecha = useDate(item[column.field]).date;
                        return(
                          <div
                            key={columnIndex}
                            style={{ flexBasis: column.width, textAlign: column.align }}
                            data-label={column.label}
                          >
                            {column.date ? 
                              fecha
                              :
                              (column.price ? 
                                `$ ${item[column.field]?.toString()}` 
                                : 
                                item[column.field]?.toString())
                            }
                          </div>
                        )
                      })}
                  </TableRow>
                )
              })
          }
      </List>
    </div>
  )
}

const TableHeader = styled.li `
    border-radius: 3px;
    padding: 15px 30px;
    display: flex;
    justify-content: space-between;
    margin-bottom: 5px;
    color: ${props=>props.color};
    background-color: #F9F5F6;
    font-size: 18px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.03em;
`

const TableRow = styled.li `
    border-radius: 3px;
    padding: 5px 30px;
    display: flex;
    justify-content: space-between;
    margin-bottom: 5px;
    font-weight: 600;
    color: ${props=>props.color};
    font-size: 18px;
    background-color: #ffffff;
    cursor: ${props=>props.onClick && 'pointer'};
    :hover{
        background-color: ${props=>props.onClick && '#F9F5F6'};
    };
`

interface List {
  maxHeight?: any
}

const List = styled.ul<List> `
  max-height: ${props => !props.maxHeight ? 'none' : '800px' };
  padding: 0;
  overflow-y: scroll;
`

const Tag = styled.h5 `
    font-size: 18px;
    padding: 0 15px;
    font-weight: 600;
    margin: 5px 0;
    color: ${process.env.TEXT_COLOR};
`