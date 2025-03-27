import React, { useEffect, useState } from "react";
import Modal from '../Modal'
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers';
import ButtonUI from "../ButtonUI";
import SimpleCheckbox from "../SimpleCheckbox";

export default function ModalAutoGenerate({open, handleClose, handleSubmit}:{open:boolean, handleClose: ()=>void, handleSubmit: (startDate: Date, endDate: Date, isSelectRange: boolean)=>void}) {

  
  const [startDate, setStartDate] = React.useState<Date>(new Date());
  const [endDate, setEndDate] = React.useState<Date>(new Date());
  const [isSelectRange, setIsSelectRange] = useState(true)

  return (
    <Modal open={open} title='Elegir fecha' eClose={handleClose} height='auto' width='auto' outside={false} >
        <div style={{padding: 15, paddingTop: 0}}>
          <div style={{display: "flex", alignItems: "center"}} >
            <SimpleCheckbox small={true} isChecked={!isSelectRange} toggleCheckbox={()=>setIsSelectRange(!isSelectRange)} text="Promedio de 4 semanas anteriores" />
          </div>
          <div style={{display: "flex", alignItems: "center"}} >
            <SimpleCheckbox small={true} isChecked={isSelectRange} toggleCheckbox={()=>setIsSelectRange(!isSelectRange)} text="Selecciona un rango de fechas" />
          </div>
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
            <ButtonUI label="Aplicar" onClick={()=>handleSubmit(startDate, endDate, isSelectRange)} />
          </div>
        </div>
    </Modal>
  )
}
