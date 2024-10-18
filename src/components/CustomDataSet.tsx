import React, { useEffect, useState } from "react";
import Modal from './Modal'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function CustomDataSet({open, handleClose,}:{open:boolean, handleClose: ()=>void}) {

  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);

  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  useEffect(() => {
    if (dateRange[0]) {
      setStartDate(dateRange[0]);
    } else {
      setStartDate(undefined);
    }

    if (dateRange[1]) {
      setEndDate(dateRange[1]);
    } else {
      setEndDate(undefined);
    }
  }, [dateRange]);
  
  return (
    <Modal open={open} title='Elegir fecha' eClose={handleClose} height='auto' width='60%' >
        <div>
          <DatePicker
            selectsRange={true} // Date range selecting enabled
            startDate={startDate}
            endDate={endDate}
            onChange={(update) => {
              setDateRange(update);
            }}
            calendarStartDay={1} // Starts from Monday
          />
        </div>
    </Modal>
  )
}
