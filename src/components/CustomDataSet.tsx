import React, { useEffect, useState } from "react";
import Modal from './Modal'
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers';
import ButtonUI from "./ButtonUI";

export default function CustomDataSet({open, handleClose, handleSubmit}:{open:boolean, handleClose: ()=>void, handleSubmit: (startDate: Date, endDate: Date)=>void}) {

  
  const [startDate, setStartDate] = React.useState<Date>(new Date());
  const [endDate, setEndDate] = React.useState<Date>(new Date());

  return (
    <Modal open={open} title='Elegir fecha' eClose={handleClose} height='auto' width='auto' outside={false} >
        <div style={{padding: 15}}>
          <h2 style={{fontSize: 18, fontWeight: 500, marginBottom: 15}} >Selecciona un rango de fechas</h2>
          <div style={{display: "flex", justifyContent: 'space-around', alignItems: "center", marginBottom: 25}} >
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Desde"
                value={startDate}
                format="dd/MM/yyyy"
                onChange={(newValue) => {
                  if (newValue) {
                    setStartDate(newValue);
                  }
                }}
              />
            </LocalizationProvider>
            <label style={{fontSize: 18, fontWeight: 500, margin: '0 15px'}} >a</label>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Hasta"
                format="dd/MM/yyyy"
                value={endDate}
                onChange={(newValue) => {
                  if (newValue) {
                    setEndDate(newValue);
                  }
                }}
              />
            </LocalizationProvider>
          </div>
          <div style={{display: "flex", justifyContent: 'space-around', alignItems: "center"}}>
            <ButtonUI label="Cancelar" onClick={handleClose} />
            <ButtonUI label="Aplicar" onClick={()=>handleSubmit(startDate, endDate)} />
          </div>
        </div>
    </Modal>
  )
}
