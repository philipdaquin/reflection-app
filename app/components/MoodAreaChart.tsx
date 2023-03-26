import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  Label, Line, ResponsiveContainer,  ReferenceDot, ReferenceLine } from 'recharts';

type WeeklyData = {
  name: string,
  mood: number
}



// const gradientOffset = () => {
//   const dataMax = Math.max(...data.map((i) => i.mood));
//   const dataMin = Math.min(...data.map((i) => i.mood));

//   if (dataMax <= 0) {
//     return 0;
//   }
//   if (dataMin >= 0) {
//     return 1;
//   }

//   return dataMax / (dataMax - dataMin);
// };


interface Props { 
 data: WeeklyData[]
}

function MoodAreaChart({data}: Props) {

    let maxValue: number = Math.max(...data.map((v) => v.mood))
    let maxData = data.find((v) => v.mood == maxValue)


    let minValue = Math.min(...data.map((v) => v.mood))
    let minData = data.find((v) => v.mood === minValue)

    
const CustomizedLabel: React.FC = () => (
  <text x={250} y={40} fontSize={14} fill="#000" textAnchor="middle">
    {`Max UV: ${maxValue}`}
  </text>
);
    return (
        <ResponsiveContainer height={200}>
            <AreaChart
                width={390}
                height={200}
                data={data}
                margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
            >
                <defs>
                  <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ff7d45" stopOpacity={0.91}/>
                    <stop offset="95%" stopColor="rgba(255, 184, 0, 0.38)" stopOpacity={1}/>
                  </linearGradient>
                  <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ff7d45" stopOpacity={0.91}/>
                    <stop offset="95%" stopColor="rgba(255, 184, 0, 0.38)" stopOpacity={0}/>
                  </linearGradient>
                </defs>

                <XAxis dataKey="name" />
                <Tooltip />



                {/* MAX DATA */}
                <ReferenceDot x={maxData?.name} y={maxData?.mood} r={7} fill="#000" className=''  
                  isFront={true}>
                  <Label x={maxData?.name} value="MAX" position={"top"}className="font-bold text-sm"/>
                </ReferenceDot >
                <ReferenceLine 
                    x={maxData?.name} 
                    x2={maxData?.name} 
                    r={7} 
                    stroke="#000" 
                    strokeDasharray=" 3 3 "
                    label={undefined}
                  />

                {/* MIN DATA */}
                <ReferenceDot x={minData?.name} y={minData?.mood} r={7} fill="#000" 
                isFront={true}>
                  <Label x={maxData?.name} value="SEVERE" position={"top"} className="font-bold text-sm"/>
                </ReferenceDot>
                <ReferenceLine 
                  x={minData?.name}
                  x2={minData?.name}

                  r={7} 
                  stroke="#000" 
                  strokeDasharray="3 3" />





                <Area type="monotone" dataKey="mood" stroke="#FFA500" fillOpacity={1} fill="url(#colorUv)" />
            </AreaChart>
        </ResponsiveContainer>
    )
}

export default MoodAreaChart;