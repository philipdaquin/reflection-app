import React, { useEffect, useState } from 'react'
import { Bar, BarChart, CartesianGrid, Label, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { TextClassification } from '../typings'



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
  emotion: string, 
  avgMood: number, 
  date: string 
}

interface Props { 
  entries: TextClassification[] | null
}

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