import React from 'react'
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { FilterOptions, MoodDataPoint, TextClassification } from '../typings'
import { useRecoilValue } from 'recoil';
import { SelectedFilterOption } from '../atoms/atoms';

const CustomXAxisTick = (props: any) => {
    const { x, y, payload } = props;
    const date = new Date(payload.value);
  
    let label = '';
    if (date.getHours() === 0) {
      label = date.toLocaleString('default', { month: 'short', day: '2-digit' });
    }
    if (date.getHours() === 12) {
      label = '12 PM';
    }
    if (date.getHours() === 18) {
      label = '6 PM';
    }
    if (date.getHours() === 6) {
      label = '6 AM';
    }
    return (
        <text x={x} y={y + 15} textAnchor="middle" fill="#666" fontSize={12}>
          {label}
        </text>
    );
}

const MoodTickFormat  = (value: any, filter: FilterOptions) => { 
  //TypeError: value.toLocaleTimeString is not a function
  const date = new Date(value)

  if (filter.label === '24H') { 
    const timeString = date.toLocaleTimeString([], { hour: 'numeric', minute: 'numeric' });
    const formattedTimeString = `${timeString}`
    return formattedTimeString

  } 
  return new Intl.DateTimeFormat('en-US', {
    month: filter.format ? 'long' : undefined,
    day:  'numeric',
  }).format(date);


}

interface CustomXAxisTickProps {
    x: number;
    y: number;
    payload: { value: string };
  }
const CustomYAxisTick = ({ x, y, payload }: CustomXAxisTickProps) => {
    return (
      <text x={x + 4} y={y} dy={20 } textAnchor="middle" fill="#666" fontSize={12}>
        {payload.value}
      </text>
    );
  };

interface Props { 
  entries: TextClassification[] | null
}
  

function MoodActivityChart({entries}: Props) {

    const mockData: MoodDataPoint[] = [
        { mood: 0.8, date: new Date('2023-05-02T08:30:00Z') },
        { mood: 0.2, date: new Date('2023-05-02T11:45:00Z') },
        { mood: 0.5, date: new Date('2023-05-02T14:20:00Z') },
        { mood: 0.9, date: new Date('2023-05-02T17:10:00Z') },
        { mood: 0.3, date: new Date('2023-05-02T20:00:00Z') },
        { mood: 0.8, date: new Date('2023-06-02T20:00:00Z') },
        { mood: 0.3, date: new Date('2023-07-02T20:00:00Z') },
      ];
    
    // const data: MoodDataPoint[] | null | undefined = mood_graph?.map((i) => new MoodDataPoint(i))
    const data: MoodDataPoint[] | null | undefined = entries?.map((i) => new MoodDataPoint(i))
    let maxValue: number = Math.max(...data!.map((v) => v.mood))
    let maxData = data?.find((v) => v.mood == maxValue)


    const now = new Date();
    const MIN_DATE = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0)
        .getTime()
        .toLocaleString();
    const MAX_DATE = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 24, 59, 59)
        .getTime()
        .toLocaleString();
    const TICK_VALUES = [MIN_DATE, MIN_DATE + 6 * 3600 * 1000, MIN_DATE + 12 * 3600 * 1000, MIN_DATE + 18 * 3600 * 1000];
    const selectedFilter = useRecoilValue(SelectedFilterOption)

    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart 
                width={600} 
                height={400} 
                data={data}
                margin={{ top: 10, right: -40, left: 0, bottom: 0 }}
            >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
                dataKey="date" 
                // ticks={TICK_VALUES} 
                // tickCount={4}
                domain={['auto', 'auto']} 
                // tickFormatter={(value) => MoodTickFormat(value, selectedFilter)}

            />


            <YAxis 
               axisLine={false}  
               tickLine={false}
               dataKey="mood" 
               tick={CustomYAxisTick} 
               allowDataOverflow={true}
               orientation='right' 
               domain={['auto', maxValue]}
             />
            <Tooltip />
            <Bar barSize={20}  dataKey="mood" fill="#8884d8" />
            </BarChart>
        </ResponsiveContainer>
    )
}

export default MoodActivityChart