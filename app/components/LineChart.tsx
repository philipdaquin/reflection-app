import React from 'react'
import { TextClassification } from '../typings';

export class DataPoint { 
    date: string;
    mood: number;

    constructor(text: TextClassification) { 
      this.date = text.date;
      this.mood = text.average_mood;
    }
}

interface Props { 
    data: DataPoint[]
}

function LineChart({data}: Props) {

    console.log(data)

    let height = data.length > 7 ? 96 : 42; // adjust height based on number of data points
    let moodValues = data.map((item) => item.mood); // extract mood values from data
    let maxValue = Math.max(...moodValues); // find the maximum mood value
    let minValue = Math.min(...moodValues); // find the minimum mood value
    let trend = moodValues[moodValues.length - 1] - moodValues[0]; // calculate the trend
    
    const color = trend >= 0 ? "#6ABD8C" : "#FF585D"; // set color based on trend
    const gradientColor = trend >= 0 ? "#8AFFC7" : "#FAE9EA"; // set gradient color based on trend
  
    // calculate the y-coordinate for each data point based on the height and range of mood values
    const points = data.map((item, index) => {
      const y = ((item.mood - minValue) / (maxValue - minValue)) * height;
      return `${index * 12},${height - y}`;
    });
    

    // add starting and ending points to the points array to create a closed area graph
    points.unshift(`0,${height}`);
    points.push(`${(data.length - 1) * 12},${height}`);

    // create gradient definition
    const gradientId = "gradient-" + Math.random().toString(36).slice(2, 9);
    const gradient = (
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={gradientColor} />
            <stop offset="100%" stopColor="white" />
        </linearGradient>
    );
    // return (
    //   <svg viewBox={`0 0 ${data.length * 12} ${height}`} width="100%" height={height}>
    //     {gradient}
    //     <polyline fill={`url(#${gradientId})`} stroke={color} strokeWidth="3" points={points.join(" ")} />
    //   </svg>
    // );
    // create path definition for the area graph
    const path = `M${points[0]} C${points.join(" ")} L${points[points.length - 1]} Z`;

    return (
      <svg viewBox={`0 0 ${data.length * 11} ${height  }`} width="100%" height={height}>
        {gradient}
        <path d={path} fill={`url(#${gradientId})`} stroke={color} strokeWidth="2.5" />
      </svg>
    );
}

export default LineChart