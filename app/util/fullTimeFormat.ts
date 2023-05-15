

export function fullTimeFormat(timestamp: string) : string { 

    if (timestamp === "") return ""
    
    const date = new Date(timestamp);
    const month = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(date);
    const year = date.getFullYear();
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const currDay = date.getDay()
    
    let day = daysOfWeek[currDay].slice(0, 3) 
    let strDate = `${day}, ${date.getDate()} ${month} ${year}`
    
    return strDate
}