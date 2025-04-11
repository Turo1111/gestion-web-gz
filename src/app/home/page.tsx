'use client'
import React, { useEffect, useState } from 'react'
/* import { BarChart } from '@mui/x-charts/BarChart'; */
import { PieChart } from '@mui/x-charts';
import styled from 'styled-components';
import apiClient from '@/utils/client';
import { useDispatch } from 'react-redux';
import { setLoading } from '@/redux/loadingSlice';
import { useDate } from '@/hooks/useDate';
import useInternetStatus from '@/hooks/useInternetStatus';
import CustomDataSet from '@/components/CustomDataSet'
import { setAlert } from '@/redux/alertSlice';
import { AiOutlineDollar } from 'react-icons/ai';
import { MdOutlineListAlt } from 'react-icons/md';
import { motion, AnimatePresence, Variants } from "framer-motion";
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AnimatedNumber } from '@/components/AnimatedNumber';
import Button from '@/components/Button';
import ButtonUI from '@/components/ButtonUI';
import { addHours, endOfDay, startOfDay } from 'date-fns';

const containerVariants: Variants = {
  sales: { backgroundColor: "#99BC85", transition: { duration: 0.5 } },
  purchases: { backgroundColor: "#DC8686", transition: { duration: 0.5 } },
};

const itemVariants: Variants = {
  visible: { y: 0, opacity: 1, transition: { duration: 0.2 } },
  hidden: { y: 10, opacity: 0 },
}

interface Response {
  id: number
  totalSales: number;
  salesCount: number;
  label: string,
  date: string,
  totalSalesDifference: string,
  salesCountDifference: string
}

const getTotalCardData = (dataSet: Response[], label: string) => {
  const data = dataSet.find((item: Response)=>item.label === label)
  return data
};

const formatBarChartData = (data: { sales: Response[], buy: Response[] }) => {
  const salesData = data.sales.map(item => item.totalSales);
  const buyData = data.buy.map(item => item.totalSales);

  
  const labels = data.sales.map(item => item.label);

  return {
    series: [
      { data: salesData, color: '#99BC85' }, 
      { data: buyData, color: '#DC8686' },   
    ],
    xAxis: labels,
  };
};

const transformData = (value: number) => {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
  return value;
}

const intervals = ['DIARIO', 'SEMANAL', 'MENSUAL', 'ANUAL', 'CUSTOM'];

export default function Home() {
  const [interval, setInterval] = useState<string>('DIARIO');
  const [dataSet, setDataSet] = useState<{simple: Response[], graph: any}>({simple: [], graph: undefined})
  const dispatch = useDispatch()
  const salesData = getTotalCardData(dataSet.simple, 'sale')
  const buyData = getTotalCardData(dataSet.simple, 'buy')
  /* const pieChartData = transformData(dataSet.simple); */
  /* const barChartData = formatBarChartData(dataSet.graph); */
  const [openCustomDataSet, setOpenCustomDataSet] = useState(false)
  const [switchData, setSwitchData] = useState(true)

  const handleSubmit = (startDate: Date, endDate: Date ) => {
    startDate = addHours(startOfDay(startDate), 3)
    endDate = addHours(endOfDay(endDate), 3)
    if (startDate >= endDate) {
      dispatch(setAlert({
        message: `La fecha DESDE no puede ser posterior a Hasta`,
        type: 'warning'
      }))
      return
    }
    dispatch(setLoading(true))
    apiClient.get(`/dataset/custom/${startDate}/${endDate}`)
    .then(r=>{
      setDataSet(r.data);
      dispatch(setLoading(false))
      setOpenCustomDataSet(false)
      console.log("dataset",r.data)
    })
    .catch(e=>{console.log(e);dispatch(setLoading(false))})
  }

  useEffect(() => {

    const getData = ()=> {
      dispatch(setLoading(true))
      const set = translateIntervalToEnglish(interval)
      apiClient.get(`/dataset/${set}`)
      .then(r=>{
        setDataSet(r.data);
        dispatch(setLoading(false))
        console.log("dataset",r.data)
      })
      .catch(e=>{console.log(e);dispatch(setLoading(false))})
    }

    if (interval !== 'CUSTOM') {
      getData()
    }
  }, [interval, dispatch])



  return (
    <Container>
      <MainContent>
        <div style={{display: 'flex', justifyContent: 'center', marginTop: 15}} >
          <ContainerInterval>
            {intervals.map((label: string, index: number) => (
              <ButtonUI label={label} key={index} isActive={label===interval} onClick={() => {
                setInterval(label);
                if (label === 'CUSTOM') {
                  setOpenCustomDataSet(true);
                }
              }} />
            ))}
          </ContainerInterval>
        </div>
        <CardContainer>
          <WrapperContainer $switchData={switchData}>
              <ContainerSwitch>
                <IconWrapperCard style={{backgroundColor: '#99BC85', borderTopLeftRadius: 15}} $switchData={switchData}
                  onClick={()=>setSwitchData(true)}
                >
                  <AiOutlineDollar/>
                </IconWrapperCard>
                <IconWrapperCard style={{backgroundColor: '#DC8686', borderBottomLeftRadius: 15}} $switchData={switchData}
                  onClick={()=>setSwitchData(false)}
                >
                  <MdOutlineListAlt/>
                </IconWrapperCard>
              </ContainerSwitch>
              <ContainerCardData $switchData={switchData}>
                <WrapperContainerCardData $switchData={switchData}>
                  <Card>
                    <ContainerCardNumber>
                      <CardNumbers style={{color: '#000'}} >
                        {
                          switchData ?
                            salesData ? <AnimatedNumber  value={salesData.salesCount} /> : <AnimatedNumber value={0} />
                          :
                            buyData ? <AnimatedNumber value={buyData.salesCount} /> : <AnimatedNumber value={0} />

                        }

                      </CardNumbers>
                      <CardNumbers $porc={true} style={{color:`${salesData !== undefined && parseFloat(salesData?.salesCountDifference) < 0 ? '#DC8686': '#99BC85'}`}} >{salesData?.totalSalesDifference} %</CardNumbers>
                    </ContainerCardNumber>
                    <CardData style={{color: '#181C14', fontSize: 14}} >CANTIDAD</CardData>
                  </Card>
                  <Card>
                    <ContainerCardNumber>
                      <CardNumbers style={{color: '#000'}}>$ 
                        {
                          switchData ?
                            salesData ? <AnimatedNumber value={salesData.totalSales} />  : <AnimatedNumber value={0} />
                          :
                            buyData ? <AnimatedNumber value={buyData.totalSales} />: <AnimatedNumber value={0} />
                        }
                      </CardNumbers>
                      <CardNumbers $porc={true} style={{color:`${salesData !== undefined && parseFloat(salesData?.salesCountDifference) < 0 ? '#DC8686': '#99BC85'}`}} > {salesData?.salesCountDifference} %</CardNumbers>
                    </ContainerCardNumber>
                    <CardData style={{color: '#181C14', fontSize: 14}} >TOTAL</CardData>
                  </Card>
                  <Card>
                    <ContainerCardNumber>
                      <CardNumbers style={{color: '#000'}}  >
                        {
                          switchData ?
                            salesData ? salesData.date : ''
                          :
                           buyData ? buyData.date : ''
                        }
                      </CardNumbers>
                    </ContainerCardNumber>
                    <CardData style={{color: '#181C14', fontSize: 14}} >INTERVALO</CardData>
                  </Card>
                </WrapperContainerCardData>
              </ContainerCardData>
          </WrapperContainer>
        </CardContainer>
        <ChartsContainer>
          <div style={{ display: 'flex', flex: 1, justifyContent: 'center', overflowX: 'scroll' }}>
            <BarChart width={730} height={350} data={dataSet.graph?.data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis  
                tickFormatter={(value) => {
                  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
                  if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
                  return value;
                }} 
              />
              <Tooltip 
                formatter={(value: number) => {
                  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
                  if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
                  return value;
                }}
              />
              <Legend />
              <Bar dataKey="ventas" fill="#99BC85" />
              <Bar dataKey="compras" fill="#DC8686" />
            </BarChart>
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
      {
        openCustomDataSet &&
        <CustomDataSet open={openCustomDataSet} handleClose={()=>setOpenCustomDataSet(false)} handleSubmit={handleSubmit} />
      }
    </Container>
  );
}

const ContainerCardNumber = styled.div `
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  @media only screen and (max-width: 780px) {
  }
`

const ContainerSwitch = styled.div`
  max-width: 15%;
  @media only screen and (max-width: 780px) {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
`

const ContainerInterval = styled.div `
  display: flex;
  padding: 15px;
  border-radius: 25px;
  border: 2px solid #d9d9d9;
  box-shadow: inset 2px 2px 5px #9d9d9d,
            inset -2px -2px 5px #ffffff;
  @media only screen and (max-width: 780px) {
    padding: 10px;
  }
  @media only screen and (max-width: 450px) {
    overflow-x: scroll;
  }
`

const CardContainer = styled.div `
  display: flex;
  justify-content: center;
  @media only screen and (max-width: 780px) {
    margin: 0 5px;
  }
`

const WrapperContainer = styled.div<{$switchData: boolean}>`
  margin-top: 15px;
  border-radius: 15px;
  background-color: ${({ $switchData }) => ($switchData ? '#99BC85' : '#DC8686')};
  border: 1px solid #d9d9d9;
  display: flex;
  z-index: 1;
  transition: background-color ease-in .5s ;
  @media only screen and (max-width: 780px) {
    flex: 1;
  }
`

const IconWrapperCard = styled.div<{$switchData: boolean}>`
  font-size: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 15px;
  color: #fff;
  border-top-right-radius: ${({ $switchData }) => ($switchData ? '15px' : '0px')};
  border-bottom-right-radius: ${({ $switchData }) => (!$switchData ? '15px' : '0px')};
  cursor: pointer;
  @media only screen and (max-width: 780px) {
    flex: 1;
  }
`

const ContainerCardData = styled.div<{$switchData: boolean}> `
  display: flex;
  flex: 1;
  background-color: ${({ $switchData }) => ($switchData ? '#DC8686' : '#99BC85')};
  border-top-right-radius: 15px;
  border-bottom-right-radius: 15px;
  align-items: center;
  justify-content: space-around;
  transition: background-color ease-in .5s ;
`

const WrapperContainerCardData = styled.div<{$switchData: boolean}>`
   display: flex;
  flex: 1;
  background-color: ${({ $switchData }) => ($switchData ? '#99BC85' : '#DC8686')};
  border-top-right-radius: 15px;
  border-bottom-right-radius: 15px;
  align-items: center;
  padding: 15px;
  justify-content: space-around;
  border-top-left-radius: ${({ $switchData }) => (!$switchData ? '15px' : '0')};
  border-bottom-left-radius: ${({ $switchData }) => ($switchData ? '15px' : '0')};
  height: 100%;
  transition: background-color ease-in .5s ;
  @media only screen and (max-width: 780px) {
    flex-direction: column;
  }
`

const Card = styled.div `
  background: #fff;
  border-radius: 10px;
  margin: 0 15px;
  padding: 0px 15px;
  align-items: center;  
  height: 90px;
  border: 2px solid #d9d9d9;
  background-image: url('/bgcircle.jpg');
  background-size: 800px;
  background-position: 20%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
  min-width: 180px;
  @media only screen and (max-width: 780px) {
    width: 75%;
    margin: 5px 0;
  }
`

const CardData = styled.h2`
  font-size: 18px;
  font-weight: 500;
  margin: 0;
  color: white;
  z-index: 1;
  @media only screen and (max-width: 780px) {
    margin: 0px;
  }
`;

const CardNumbers = styled(CardData)<{$porc?: boolean}> `
  font-weight: bold;
  font-size: ${({ $porc }) => ($porc ? '14px' : '18px')};
  @media only screen and (max-width: 780px) {
    font-size: ${({ $porc }) => ($porc ? '14px' : '18px')};
  }
  @media only screen and (max-width: 400px) {
    font-size: ${({ $porc }) => ($porc ? '14px' : '16px')};
  }
`

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
  flex-direction: column;
  flex: 1;
  @media only screen and (max-width: 500px) {
    width: 100%;
  }
`;


const ChartsContainer = styled.div`
  display: flex;
  justify-content: space-around;
  padding: 15px;
  flex: 1;
  max-width: 95vw;
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
