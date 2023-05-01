import React, { useEffect, useState } from 'react'
import { Bar, BarChart, CartesianGrid, Label, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { DEFAULT_EMOTION } from '../typings'

function MoodCompositionChart() {
 // A state to hold the color mapping for each emotion
 const [colors, setColors] = useState({});

 // A function to generate a random color for each emotion
 const generateColors = () => {
   const newColors = {};
   Object.keys(DEFAULT_EMOTION[0]).forEach((key) => {
     if (key !== "date") {
       newColors[key] = "#" + Math.floor(Math.random() * 16777215).toString(16);
     }
   });
   setColors(newColors);
 };

 // Call the generateColors function once when the component mounts
 useEffect(() => {
   generateColors();
 }, []);

 // Create a new array with the total count of each emotion for each date
 const stackedData = DEFAULT_EMOTION.map(({ date, ...emotions }) => {
  const totalCount = Object.values(emotions).reduce((sum, count) => sum + count, 0);
  return { date, totalCount, ...emotions };
});


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

  

  let day = new Date().getDay()

    return (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            width={600} 
            height={400} 
            data={stackedData}
            margin={{ top: 10, right: -40, left: 0, bottom: 0 }}
            >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={CustomXAxisTick} />
            <YAxis 
              axisLine={false}  
              tickLine={false}
              dataKey="totalCount" 
              tick={CustomYAxisTick} 
              allowDataOverflow={true}
              orientation='right' 
              domain={[0, 50]}

              tickFormatter={(value) => `$${value}`}
            >
              
            </YAxis>
            <Tooltip />
            <Legend />
            {Object.keys(colors).map((emotion) => (
              <Bar key={emotion} dataKey={emotion} stackId="a" fill={colors[emotion]} />
            ))}
          </BarChart>
        </ResponsiveContainer>
    )
}

export default MoodCompositionChart