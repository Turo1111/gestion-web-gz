'use client';

import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { getAnalysis, getItemLinks } from '@/redux/purchaseDocSlice';
import { LinkingStatus } from '@/interfaces/purchaseDoc.interface';
import ItemLinkingCell from './ItemLinkingCell';
import { formatCurrency } from '@/utils/validators';
import { MdCheckCircle, MdAddCircle, MdRadioButtonUnchecked } from 'react-icons/md';

export default function ItemsReviewTable() {
  const analysis = useSelector(getAnalysis);
  const itemLinks = useSelector(getItemLinks);
  
  if (!analysis) return null;
  
  const { items } = analysis;
  
  const getStatusIcon = (lineId: string) => {
    const link = itemLinks[lineId];
    if (!link) return <MdRadioButtonUnchecked size={20} color="#999" />;
    
    switch (link.status) {
      case LinkingStatus.LINKED:
        return <MdCheckCircle size={20} color="#4CAF50" />;
      case LinkingStatus.NEW_PRODUCT:
        return <MdAddCircle size={20} color="#2196F3" />;
      default:
        return <MdRadioButtonUnchecked size={20} color="#999" />;
    }
  };
  
  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + (item.subtotal || 0), 0);
  };
  
  return (
    <Card>
      <Header>
        <Title>Ítems del Comprobante</Title>
      </Header>
      
      <TableContainer>
        <Table>
          <thead>
            <tr>
              <Th style={{ width: '40px' }}>Estado</Th>
              <Th style={{ width: '60px' }}>#</Th>
              <Th>Descripción Detectada</Th>
              <Th style={{ width: '100px' }}>Cantidad</Th>
              <Th style={{ width: '120px' }}>Precio Unit.</Th>
              <Th style={{ width: '120px' }}>Subtotal</Th>
              <Th style={{ width: '300px' }}>Vinculación</Th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <Tr key={item.lineId}>
                <Td center>
                  {getStatusIcon(item.lineId)}
                </Td>
                <Td center>{index + 1}</Td>
                <Td>
                  <Description>{item.description || item.rawDescription}</Description>
                  {item.descriptionConfidence && item.descriptionConfidence < 0.7 && (
                    <LowConfidence>Baja confianza ({(item.descriptionConfidence * 100).toFixed(0)}%)</LowConfidence>
                  )}
                </Td>
                <Td right>{item.quantity?.toFixed(2) || '-'}</Td>
                <Td right>{item.unitPrice ? formatCurrency(item.unitPrice) : '-'}</Td>
                <Td right bold>{item.subtotal ? formatCurrency(item.subtotal) : '-'}</Td>
                <Td>
                  <ItemLinkingCell lineId={item.lineId} item={item} />
                </Td>
              </Tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <Th colSpan={5} style={{ textAlign: 'right' }}>Total</Th>
              <Th style={{ textAlign: 'right' }}>{formatCurrency(calculateTotal())}</Th>
              <Th></Th>
            </tr>
          </tfoot>
        </Table>
      </TableContainer>
    </Card>
  );
}

// Styled Components
const Card = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
`;

const Header = styled.div`
  margin-bottom: 16px;
`;

const Title = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
`;

const TableContainer = styled.div`
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
`;

const Th = styled.th`
  background: #f5f5f5;
  padding: 12px;
  text-align: left;
  font-weight: 600;
  color: #666;
  border-bottom: 2px solid #ddd;
`;

const Tr = styled.tr`
  &:hover {
    background: #fafafa;
  }
`;

const Td = styled.td<{ center?: boolean; right?: boolean; bold?: boolean }>`
  padding: 12px;
  border-bottom: 1px solid #eee;
  text-align: ${props => props.center ? 'center' : props.right ? 'right' : 'left'};
  font-weight: ${props => props.bold ? '600' : 'normal'};
  vertical-align: top;
`;

const Description = styled.div`
  color: #333;
  margin-bottom: 4px;
`;

const LowConfidence = styled.div`
  font-size: 12px;
  color: #ff9800;
  font-style: italic;
`;
