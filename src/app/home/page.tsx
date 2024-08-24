'use client'
import React, { useEffect, useState } from 'react'
import { BarChart } from '@mui/x-charts/BarChart';
import { PieChart } from '@mui/x-charts';
import styled from 'styled-components';
import apiClient from '@/utils/client';
import { useDispatch } from 'react-redux';
import { setLoading } from '@/redux/loadingSlice';

interface Response {
  id: number
  totalSales: number;
  salesCount: number;
  label: string
}

const getTotalCardData = (dataSet: Response[], label: string) => {
  const data = dataSet.find((item: Response)=>item.label === label)
  return data
};

const formatBarChartData = (data: { sales: Response[], buy: Response[] }) => {
  // Suponiendo que quieres mostrar `sales` y `buy` en las series del gráfico de barras
  const salesData = data.sales.map(item => item.totalSales);
  const buyData = data.buy.map(item => item.totalSales);
  
  // Extraer etiquetas del primer conjunto de datos
  const labels = data.sales.map(item => item.label);

  console.log(labels)

  return {
    series: [
      { data: salesData },
      { data: buyData },
    ],
    xAxis: labels,
  };
};

const transformData = (data: Response[]): { id: number; value: number; label: string }[] => {
  return data.map(item => ({
    id: item.id,
    value: item.totalSales, // O usa salesCount si prefieres ese valor
    label: item.label === "sale" ? 'VENTAS' : 'COMPRAS',
  }));
};

export default function Home() {
  const [interval, setInterval] = useState<string>('DIARIO');
  const [dataSet, setDataSet] = useState<{simple: Response[], graph: {sales: Response[], buy: Response[]}}>({simple: [], graph: {sales: [], buy: []}})
  const dispatch = useDispatch()
  const salesData = getTotalCardData(dataSet.simple, 'sale')
  const buyData = getTotalCardData(dataSet.simple, 'buy')
  const pieChartData = transformData(dataSet.simple);
  const barChartData = formatBarChartData(dataSet.graph);

  console.log(barChartData)

  useEffect(() => {

    const getData = ()=> {
      dispatch(setLoading(true))
      const set = translateIntervalToEnglish(interval)
      apiClient.get(`/dataset/${set}`)
      .then(r=>{
        setDataSet(r.data);
        dispatch(setLoading(false))
        console.log("response",r.data)
      })
      .catch(e=>{console.log(e);dispatch(setLoading(false))})
    }
  
    getData()
  }, [interval])

  return (
    <Container>
      <MainContent>
        <IntervalContainer>
          <IntervalContainerOption>
            <IntervalOption $isActive={interval === 'DIARIO'} onClick={()=>setInterval('DIARIO')}>DIARIO</IntervalOption>
            <IntervalOption $isActive={interval === 'SEMANAL'} onClick={()=>setInterval('SEMANAL')}>SEMANAL</IntervalOption>
            <IntervalOption $isActive={interval === 'MENSUAL'} onClick={()=>setInterval('MENSUAL')}>MENSUAL</IntervalOption>
            <IntervalOption $isActive={interval === 'ANUAL'} onClick={()=>setInterval('ANUAL')}>ANUAL</IntervalOption>
            <IntervalOption $isActive={interval === 'PERSONALIZADA'} /* onClick={()=>setInterval('PERSONALIZADA')} */>PERSONALIZADA</IntervalOption>
          </IntervalContainerOption>
        </IntervalContainer>
        <CardsContainer>
          <Card $bgColor="#99BC85">
            <CardTitle>Ventas</CardTitle>
            <CardData>{salesData ? salesData.salesCount : 0} ventas</CardData>
            <CardData>$ {salesData ? salesData.totalSales : 0}</CardData>
          </Card>
          <Card $bgColor="#DC8686">
            <CardTitle>Compras</CardTitle>
            <CardData>{buyData ? buyData.salesCount : 0} compras</CardData>
            <CardData>$ {buyData ? buyData.totalSales : 0}</CardData>
          </Card>
        </CardsContainer>
        <ChartsContainer>
          {dataSet.simple.length === 0 ? (
            <NoDataMessage>No hay datos para mostrar en el gráfico</NoDataMessage>
          ) : (
            <div style={{ display: 'flex', flex: 1 }}>
              <PieChart
                series={[
                  {
                    data: pieChartData,
                  },
                ]}
                width={400}
                height={200}
              /> 
            </div>
          )}
          <div style={{ display: 'flex', flex: 1 }}>
          <BarChart
            series={barChartData.series}
            height={290}
            xAxis={[{ data: barChartData.xAxis, scaleType: 'band' }]}
            margin={{ top: 10, bottom: 30, left: 40, right: 10 }}
          />
          </div>
        </ChartsContainer>
        <MovementsContainer>
          <MovementsTitle>Ultimos movimientos :</MovementsTitle>
          <MovementsList>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((item, index) => (
              <MovementItem key={index}>
                <MovementText>Venta</MovementText>
                <MovementText color="#b33b3b">CREATE</MovementText>
                <MovementText>25/5/2025 - 13:13</MovementText>
              </MovementItem>
            ))}
          </MovementsList>
        </MovementsContainer>
      </MainContent>
      <NotesContainer>
        <NotesTitle>Notas de actualizacion</NotesTitle>
        <NoteItem>
          <NoteTitle>Parche 20/08</NoteTitle>
          <NoteText>- Guardar en el borrador la creación de nuevos productos, nueva venta y edición de ventas.</NoteText>
          <NoteText>- Inicio de sesión sin necesidad de que se ingrese el nombre con mayúsculas o minúsculas.</NoteText>
          <NoteText>- Corrección de errores: creación múltiple ventas, tipo de datos en creación de productos.</NoteText>
        </NoteItem>
      </NotesContainer>
    </Container>
  );
}


const Container = styled.div`
  display: flex;
  flex: 1;
  padding: 5px;
  overflow-y: scroll;
  @media only screen and (max-width: 500px) {
    flex-direction: column;
  }
`;

const MainContent = styled.div`
  display: flex;
  width: 70%;
  flex-direction: column;
  @media only screen and (max-width: 500px) {
    width: 100%;
  }
`;

const IntervalContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const IntervalContainerOption = styled.div `
   display: flex;
  justify-content: center;
  align-items: center;
  overflow-x: scroll;
`

const IntervalLabel = styled.h2`
  font-size: 18px;
  font-weight: bold;
  margin: 5px 15px;
  color: #252525;
  @media only screen and (max-width: 1025px) {
    font-size: 14px;
  }
`;

const IntervalOption = styled.h2<{$isActive: boolean}>`
  font-size: 16px;
  font-weight: 500;
  /* margin: 5px 15px; */
  padding: 5px;
  /* border-radius: ${({ $isActive }) => ($isActive ? '10px' : '0px')};; */
  color: ${({ $isActive }) => ($isActive ? 'white' : '#252525')};
  background-color: ${({ $isActive }) => ($isActive ? '#3764A0' : 'white')};
 /*  border: ${({ $isActive }) => ($isActive ? '1px solid #d9d9d9' : 'none')}; */
  border-right: ${({ $isActive }) => ($isActive ? 'none' : '3px solid #d9d9d9')};
  cursor: pointer;
  &:hover{
    color: white;
    background-color: #3764A0;
    border: 1px solid #d9d9d9;
  }
  @media only screen and (max-width: 1025px) {
    font-size: 12px;
  }
`;

const CardsContainer = styled.div`
  display: flex;
  justify-content: space-evenly;
  margin: 15px 0;
`;

const Card = styled.div<{$bgColor: string}>`
  background-color: ${({ $bgColor }) => $bgColor};
  border-radius: 15px;
  border: 1px solid #d9d9d9;
  min-width: 150px;
  text-align: center;
`;

const CardTitle = styled.h2`
  font-size: 22px;
  font-weight: bold;
  color: #252525;
  padding: 5px;
  background-color: white;
  text-align: center;
  border: 1px solid #d9d9d9;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
`;

const CardData = styled.h2`
  font-size: 18px;
  font-weight: 500;
  margin: 10px 15px;
  color: white;
`;

const ChartsContainer = styled.div`
  display: flex;
  justify-content: space-around;
  padding: 15px;
  flex: 1;
  @media only screen and (max-width: 1025px) {
    flex-direction: column;
  }
`;

const MovementsContainer = styled.div`
  display: flex;
  padding: 15px;
  flex-direction: column;
  max-height: 380px;
`;

const MovementsTitle = styled.h2`
  font-size: 18px;
  font-weight: bold;
  margin: 5px 15px;
  color: #252525;
`;

const MovementsList = styled.ul`
  display: flex;
  flex-direction: column;
  background-color: #f1f1f1;
  border-radius: 15px;
  padding: 15px;
  overflow-y: scroll;
`;

const MovementItem = styled.li`
  display: flex;
  border-bottom: 2px solid #fff;
  justify-content: space-around;
  padding: 15px;
`;

const MovementText = styled.h2`
  font-size: 18px;
  font-weight: 500;
  color: ${({ color }) => color || '#252525'};
`;

const NotesContainer = styled.div`
  display: flex;
  background-color: #f1f1f1;
  width: 30%;
  padding: 15px;
  border-radius: 15px;
  overflow-y: scroll;
  flex-direction: column;
  @media only screen and (max-width: 500px) {
    display: none;
  }
`;

const NotesTitle = styled.h2`
  font-size: 18px;
  text-align: center;
  font-weight: bold;
  margin-bottom: 15px;
`;

const NoteItem = styled.div`
  border-bottom: 1px solid #fff;
  padding: 5px 0;
`;

const NoteTitle = styled.h2`
  font-size: 16px;
  font-weight: 600;
  margin: 5px 0;
`;

const NoteText = styled.p`
  font-size: 14px;
  font-weight: 500;
  margin: 5px 0;
`;

const NoDataMessage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
 `

function translateIntervalToEnglish(interval: string): string {
  switch (interval.toUpperCase()) {
    case 'DIARIO':
      return 'daily';
    case 'SEMANAL':
      return 'weekly';
    case 'MENSUAL':
      return 'monthly';
    case 'ANUAL':
      return 'annually';
    default:
      throw new Error('Invalid interval');
  }
}