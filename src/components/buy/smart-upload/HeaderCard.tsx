'use client';

import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { useAppDispatch } from '@/redux/hook';
import { getAnalysis, updateHeaderEdit } from '@/redux/purchaseDocSlice';
import { TextField } from '@mui/material';
import { MdEdit, MdSave, MdClose, MdWarning } from 'react-icons/md';
import { formatCurrency, formatDate } from '@/utils/validators';

export default function HeaderCard() {
  const dispatch = useAppDispatch();
  const analysis = useSelector(getAnalysis);
  const [editMode, setEditMode] = useState(false);
  const [tempValues, setTempValues] = useState({
    date: '',
    documentNumber: '',
    total: '',
  });
  
  if (!analysis) return null;
  
  const { header } = analysis;
  
  const handleStartEdit = () => {
    setTempValues({
      date: header.date || '',
      documentNumber: header.documentNumber || '',
      total: header.total?.toString() || '',
    });
    setEditMode(true);
  };
  
  const handleSave = () => {
    const edits: any = {};
    
    if (tempValues.date !== header.date) {
      edits.date = tempValues.date;
    }
    if (tempValues.documentNumber !== header.documentNumber) {
      edits.documentNumber = tempValues.documentNumber;
    }
    if (parseFloat(tempValues.total) !== header.total) {
      edits.total = parseFloat(tempValues.total);
    }
    
    if (Object.keys(edits).length > 0) {
      dispatch(updateHeaderEdit(edits));
    }
    
    setEditMode(false);
  };
  
  const handleCancel = () => {
    setEditMode(false);
  };
  
  const getConfidenceColor = (confidence?: number) => {
    if (!confidence) return '#999';
    if (confidence >= 0.9) return '#4CAF50';
    if (confidence >= 0.7) return '#FFA726';
    return '#FF5722';
  };
  
  const getConfidenceLabel = (confidence?: number) => {
    if (!confidence) return 'Desconocido';
    if (confidence >= 0.9) return 'Alta';
    if (confidence >= 0.7) return 'Media';
    return 'Baja';
  };
  
  const hasLowConfidence = 
    (header.dateConfidence && header.dateConfidence < 0.7) ||
    (header.documentNumberConfidence && header.documentNumberConfidence < 0.7) ||
    (header.totalConfidence && header.totalConfidence < 0.7);
  
  return (
    <Card>
      <Header>
        <Title>Datos del Comprobante</Title>
        {!editMode ? (
          <EditButton onClick={handleStartEdit}>
            <MdEdit size={20} />
            Editar
          </EditButton>
        ) : (
          <ButtonGroup>
            <SaveButton onClick={handleSave}>
              <MdSave size={20} />
              Guardar
            </SaveButton>
            <CancelButton onClick={handleCancel}>
              <MdClose size={20} />
              Cancelar
            </CancelButton>
          </ButtonGroup>
        )}
      </Header>
      
      {hasLowConfidence && (
        <WarningBox>
          <MdWarning size={20} />
          <WarningText>
            Algunos campos tienen baja confianza. Revisa y corrige si es necesario.
          </WarningText>
        </WarningBox>
      )}
      
      <Grid>
        <Field>
          <Label>Fecha</Label>
          {editMode ? (
            <TextField
              type="date"
              value={tempValues.date}
              onChange={(e) => setTempValues({ ...tempValues, date: e.target.value })}
              size="small"
              fullWidth
            />
          ) : (
            <>
              <Value>{formatDate(header.date)}</Value>
              <Confidence color={getConfidenceColor(header.dateConfidence)}>
                Confianza: {getConfidenceLabel(header.dateConfidence)} 
                {header.dateConfidence && ` (${(header.dateConfidence * 100).toFixed(0)}%)`}
              </Confidence>
            </>
          )}
        </Field>
        
        <Field>
          <Label>Número de Comprobante</Label>
          {editMode ? (
            <TextField
              value={tempValues.documentNumber}
              onChange={(e) => setTempValues({ ...tempValues, documentNumber: e.target.value })}
              size="small"
              fullWidth
              placeholder="0001-00001234"
            />
          ) : (
            <>
              <Value>{header.documentNumber || 'No detectado'}</Value>
              <Confidence color={getConfidenceColor(header.documentNumberConfidence)}>
                Confianza: {getConfidenceLabel(header.documentNumberConfidence)}
                {header.documentNumberConfidence && ` (${(header.documentNumberConfidence * 100).toFixed(0)}%)`}
              </Confidence>
            </>
          )}
        </Field>
        
        <Field>
          <Label>Total</Label>
          {editMode ? (
            <TextField
              type="number"
              value={tempValues.total}
              onChange={(e) => setTempValues({ ...tempValues, total: e.target.value })}
              size="small"
              fullWidth
              inputProps={{ step: '0.01' }}
            />
          ) : (
            <>
              <Value>{formatCurrency(header.total)}</Value>
              <Confidence color={getConfidenceColor(header.totalConfidence)}>
                Confianza: {getConfidenceLabel(header.totalConfidence)}
                {header.totalConfidence && ` (${(header.totalConfidence * 100).toFixed(0)}%)`}
              </Confidence>
            </>
          )}
        </Field>
      </Grid>
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
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const Title = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
`;

const EditButton = styled.button`
  background: none;
  border: 1px solid #3764A0;
  color: #3764A0;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  
  &:hover {
    background: #f0f7ff;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
`;

const SaveButton = styled.button`
  background: #4CAF50;
  border: none;
  color: white;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  
  &:hover {
    background: #45a049;
  }
`;

const CancelButton = styled.button`
  background: #f44336;
  border: none;
  color: white;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  
  &:hover {
    background: #da190b;
  }
`;

const WarningBox = styled.div`
  background: #fff3cd;
  border: 1px solid #ffc107;
  border-radius: 8px;
  padding: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  
  svg {
    color: #ff9800;
    flex-shrink: 0;
  }
`;

const WarningText = styled.span`
  font-size: 14px;
  color: #333;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: #666;
`;

const Value = styled.span`
  font-size: 16px;
  color: #333;
`;

const Confidence = styled.span<{ color: string }>`
  font-size: 12px;
  color: ${props => props.color};
  font-weight: 600;
`;
