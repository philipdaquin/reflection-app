import React, { useMemo, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  Label, Line, ResponsiveContainer,  ReferenceDot, ReferenceLine, Brush } from 'recharts';
import { FilterOptions, WeeklyData } from '../typings';
import { useRecoilValue } from 'recoil';
import { SelectedFilterOption } from '../atoms/atoms';
import { AxisInterval } from 'recharts/types/util/types';
import { eachDayOfInterval, formatISO } from 'date-fns';

// const CustomizedLabel: React.FC = () => (
//   <text x={250} y={40} fontSize={14} fill="#000" textAnchor="middle">
//     {`Max UV: ${maxValue}`}
//   </text>
// );

interface CustomXAxisTickProps {
  x: number;
  y: number;
  payload: { value: string };
}

const CustomXAxisTick = ({ x, y, payload }: CustomXAxisTickProps) => {
  return (
    <text x={x} y={y} dy={16} textAnchor="middle" fill="#666" fontSize={12}>
      {payload.value}
    </text>
  );
};

// interface CustomizedBrushProps {
//   handleBrushChange: (data: WeeklyData[]) => void;
// }

// const CustomizedBrush: React.FC<CustomizedBrushProps> = ({ handleBrushChange }) => {
//   return (
//     <Brush
//       dataKey="date"
//       height={30}
//       stroke="#8884d8"
//       onChange={handleBrushChange}
//     />
//   );
// };


// Fix empty X axis when there's no data 
// - Get current Time now 
// - Set Min and Max Data 
function getHourData(data: WeeklyData[]) { 
  const selectedFilter = useRecoilValue(SelectedFilterOption)


  if (selectedFilter.label === '24H') {
    let timeNow = new Date()
  
    let minData: WeeklyData = { 
      date: new Date( timeNow.getFullYear(), timeNow.getMonth(), timeNow.getDate(), 0, 0, 0),
      mood: 0
    }
    let maxData: WeeklyData = { 
      date: new Date( timeNow.getFullYear(), timeNow.getMonth(), timeNow.getDate(), 23, 59, 59),
      mood: 0
    }
    // data.push(minData)
    data.push(maxData)
  }
  return data
}


const TickFormatter = (value: any, filter: FilterOptions) => { 
  try { 
    const date = new Date(value);
    if (filter.interval === 'hour') {
      return date.getHours().toString().padStart(2, '0') + ':00';
    } else {
      return new Intl.DateTimeFormat('en-US', {
        month: filter.format ? 'long' : undefined,
        day:  'numeric',
      }).format(date);
    }
  } catch (e) { 
    console.error(e)
    return value 
  }
} 

function fillMissingDate(data: WeeklyData[]): WeeklyData[] { 
  let startDate = new Date(data[0].date)
  let endDate = new Date(data[data.length - 1].date)

  const dateRange = eachDayOfInterval({start: startDate, end: endDate})
    .map(date => formatISO(date, { representation: 'date'}))


  let dataMood: Map<Date, number> = new Map(data.map(({date,mood}, i) => [date, mood]))
  let allData: WeeklyData[] = []
  // If there is no date under a date, insert a default
  // const chartData = dateRange.map((date) => {
  //   const dateString = new Date(date);
  //   const mood = dataMood.get(dateString) ?? 0; // Use mood from data if available, otherwise use 0
  //   return { date: dateString, mood };
  // });
  console.log(dataMood)
  console.log(dateRange)

  // Create a new array with default values for any missing dates in input data 
  // for (const date in dateRange) {
  //   let matchingData = data.i

  //   if (matchingData) { 
  //     allData.push(matchingData)
  //   } else  { 
  //     let defaultValue: WeeklyData = { 
  //       date: new Date(date),
  //       mood: 0
  //     }
  //     allData.push(defaultValue)
  //   }
    
  // }

  console.log(dateRange)

  return allData
}

interface Props { 
 data: WeeklyData[]
}

function MoodAreaChart({data}: Props) {
    
    const selectedFilter = useRecoilValue(SelectedFilterOption)

    let maxValue: number = Math.max(...data.map((v) => v.mood))
    let maxData = data.find((v) => v.mood == maxValue)


    let minValue = Math.min(...data.map((v) => v.mood))
    let minData = data.find((v) => v.mood === minValue)
    
    const [minDate, maxDate] = useMemo(() => {
      const dates = data.map((d) => new Date(d.date).getTime());
      return [new Date(Math.min(...dates)), new Date(Math.max(...dates))];
    }, [data]);

    let test = getHourData(data)
    // let allData = fillMissingDate(data)


    return (
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart
                width={390}
                height={300}
                data={
                  selectedFilter.label === '24' ? test : data
                }
                margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
            >
                <defs>
                  <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ff7d45" stopOpacity={0.91}/>
                    <stop offset="95%" stopColor="rgba(255, 184, 0, 0.38)" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ff7d45" stopOpacity={0.91}/>
                    <stop offset="95%" stopColor="rgba(255, 184, 0, 0.38)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
            <Brush dataKey='date' height={30} stroke="#8884d8"/>


                {/* <XAxis 
                  dataKey="date" 
                  tick={CustomXAxisTick} 
                  domain={[minDate.toString(), maxDate.toString()]} 
                /> */}
                <XAxis 
                  dataKey="date" 
                  interval={selectedFilter.interval as AxisInterval} 
                  domain = {['auto', 'auto']}               
                  tickCount={
                    selectedFilter.interval === 'hour'
                    ? 24
                    : undefined
                  }
              
                  tickFormatter={(value) => TickFormatter(value, selectedFilter)}
                  // tickFormatter={(value) => new Intl.DateTimeFormat('en-US', { 
                  //   month: selectedFilter.format ? 'long' : undefined , 
                  //   day: selectedFilter.format?.includes('MMM') ? undefined : 'numeric', 
                  //   hour: selectedFilter.interval === 'hour' ? 'numeric' : undefined 
                  // }).format(new Date(value))} 
                />


                <Tooltip />

                {/* MAX DATA */}
                <ReferenceDot x={maxData?.date.toString()} y={maxData?.mood} r={7} fill="#000" className=''  
                  isFront={true}>
                  <Label x={maxData?.date.toString()} value="MAX" position={"top"}className="font-bold text-sm"/>
                </ReferenceDot >
                <ReferenceLine 
                    x={maxData?.date.toString()} 
                    x2={maxData?.date.toString()} 
                    r={7} 
                    stroke="#000" 
                    strokeDasharray=" 3 3 "
                    label={undefined}
                  />

                {/* MIN DATA */}
                <ReferenceDot x={minData?.date.toString()} y={minData?.mood} r={7} fill="#000" 
                isFront={true}>
                  <Label x={maxData?.date.toString()} value="SEVERE" position={"top"} className="font-bold text-sm"/>
                </ReferenceDot>
                <ReferenceLine 
                  x={minData?.date.toString()}
                  x2={minData?.date.toString()}
                  r={7} 
                  stroke="#000" 
                  strokeDasharray="3 3" />

                <Area type="monotone" dataKey="mood" stroke="#FFA500" fillOpacity={1} fill="url(#colorUv)" />
            </AreaChart>
        </ResponsiveContainer>
    )
}

export default MoodAreaChart;