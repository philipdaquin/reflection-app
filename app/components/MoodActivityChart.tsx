import React from 'react'
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

type MoodDataPoint = { 
    id: string,
    emotion: string, 
    avgMood: number, 
    date: Date 
}


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

interface CustomXAxisTickProps {
    x: number;
    y: number;
    payload: { value: string };
  }
const CustomYAxisTick = ({ x, y, payload }: CustomXAxisTickProps) => {
    return (
      <text x={x} y={y} dy={16} textAnchor="middle" fill="#666" fontSize={12}>
        {payload.value}
      </text>
    );
  };
  
function MoodActivityChart() {

    const data: MoodDataPoint[] = [
        { id: '1', emotion: 'Happy', avgMood: 0.8, date: new Date('2023-05-02T08:30:00Z') },
        { id: '2', emotion: 'Sad', avgMood: 0.2, date: new Date('2023-05-02T11:45:00Z') },
        { id: '3', emotion: 'Angry', avgMood: 0.5, date: new Date('2023-05-02T14:20:00Z') },
        { id: '4', emotion: 'Excited', avgMood: 0.9, date: new Date('2023-05-02T17:10:00Z') },
        { id: '5', emotion: 'Tired', avgMood: 0.3, date: new Date('2023-05-02T20:00:00Z') },
        { id: '5', emotion: 'Tired', avgMood: 0.8, date: new Date('2023-06-02T20:00:00Z') },
        { id: '5', emotion: 'Tired', avgMood: 0.3, date: new Date('2023-07-02T20:00:00Z') },
      ];
    
    // const formattedData = data.map(({ id, emotion, avgMood, date }) => ({
    //   id,
    //   emotion,
    //   avgMood,
    //   date: new Date(date).toLocaleDateString()
    // }));

    const now = new Date();
    const MIN_DATE = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0)
        .getTime()
        .toLocaleString();
    const MAX_DATE = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 24, 59, 59)
        .getTime()
        .toLocaleString();
    const TICK_VALUES = [MIN_DATE, MIN_DATE + 6 * 3600 * 1000, MIN_DATE + 12 * 3600 * 1000, MIN_DATE + 18 * 3600 * 1000];

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
                ticks={TICK_VALUES} 
                tickCount={4}
                domain={['auto', 'auto']} 
                tick={CustomXAxisTick}
                interval={"preserveStartEnd"}
                // scale={'time'}
                includeHidden={true}
            />


            <YAxis 
               axisLine={false}  
               tickLine={false}
               dataKey="avgMood" 
               tick={CustomYAxisTick} 

               allowDataOverflow={true}
               orientation='right' 
               domain={[0, 2]}
             />
            <Tooltip />
            <Bar barSize={20}  dataKey="avgMood" fill="#8884d8" />
            </BarChart>
        </ResponsiveContainer>
    )
}

export default MoodActivityChart