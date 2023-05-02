import React, { useEffect, useState } from 'react'
import { Bar, BarChart, CartesianGrid, Label, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { TextClassification } from '../typings'


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
const CustomYAxisTick = ({ x, y, payload }: CustomXAxisTickProps) => {
  return (
    <text x={x} y={y} dy={16} textAnchor="middle" fill="#666" fontSize={12}>
      {payload.value}
    </text>
  );
};

  
// Assign a colour from 0 - 1 at each level 
export function generateColours(average: number): string { 
  let colour = ""
  
  // Red (indicating a very negative mood)
  if (average <= 0.2) {
    colour = "E84040";
  
  //  Orange (indicating a moderately negative mood)
  } else if (average <= 0.4) {
    colour = "FF7D45";
  
  // Yellow (indicating a neutral or mixed mood)
  } else if (average <= 0.6) {
    colour = "FFB800";

  // Light Green (indicating a moderately positive mood)
  } else if (average <= 0.8) {
    colour = "78FF75";
  } else {
    // Dark Green (indicating a very positive mood)
    colour = "43CB9C";
  }
  return colour
}

type MoodDataPoint = { 
  id: string,
  emotion: string, 
  avgMood: number, 
  date: string 
}

interface Props { 
  entries: TextClassification[] | null
}

function MoodCompositionChart({entries}: Props) {

  const moodData: MoodDataPoint[] = [
    {
      id: "1",
      emotion: "Anger",
      avgMood: 0.1,
      date: "2023-05-02T08:30:00Z"
    },
    {
      id: "2",
      emotion: "Happiness",
      avgMood: 0.9,
      date: "2023-05-02T09:15:00Z"
    },
    {
      id: "3",
      emotion: "Sadness",
      avgMood: 0.2,
      date: "2023-05-02T10:00:00Z"
    },
    {
      id: "4",
      emotion: "Excitement",
      avgMood: 0.8,
      date: "2023-05-02T11:30:00Z"
    },
    {
      id: "5",
      emotion: "Anxiety",
      avgMood: 0.3,
      date: "2023-05-02T13:00:00Z"
    },
    {
      id: "6",
      emotion: "Contentment",
      avgMood: 0.7,
      date: "2023-05-02T14:45:00Z"
    },
    {
      id: "7",
      emotion: "Frustration",
      avgMood: 0.4,
      date: "2023-05-02T15:30:00Z"
    },
    {
      id: "8",
      emotion: "Gratitude",
      avgMood: 0.6,
      date: "2023-05-02T16:15:00Z"
    },
    {
      id: "9",
      emotion: "Enthusiasm",
      avgMood: 0.9,
      date: "2023-05-02T17:00:00Z"
    },
    {
      id: "10",
      emotion: "Indifference",
      avgMood: 0.5,
      date: "2023-05-02T18:30:00Z"
    }
  ];

  let day = new Date().getDay()

    return (
        <ResponsiveContainer width="100%" height="100%">
           <BarChart 
             width={600} 
             height={400} 
             data={moodData}
             margin={{ top: 10, right: -40, left: 0, bottom: 0 }}
             >
             <CartesianGrid strokeDasharray="3 3" />
             <XAxis dataKey="date" tick={CustomXAxisTick} />
             <YAxis 
               axisLine={false}  
               tickLine={false}
               dataKey="avgMood" 
               tick={CustomYAxisTick} 
               allowDataOverflow={true}
               orientation='right' 
               domain={[0, 1]}
               tickFormatter={(value) => `$${value}`}
             >
             </YAxis>
             <Tooltip />
             <Legend />
            
           </BarChart>
     
        </ResponsiveContainer>
    )
}

export default MoodCompositionChart