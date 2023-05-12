
export function getWeekStartAndEndDates(date: Date): { startDate: Date, endDate: Date } {
    // Clone the input date to avoid mutating it
    const clonedDate = new Date(date.getTime());
  
    // Get the day of the week (0-6, where 0 is Sunday)
    const dayOfWeek = clonedDate.getUTCDay();
  
    // Calculate the start date of the week (Sunday)
    const startDate = new Date(clonedDate);
    startDate.setUTCDate(startDate.getUTCDate() - dayOfWeek);
  
    // Calculate the end date of the week (Saturday)
    const endDate = new Date(startDate);
    endDate.setUTCDate(endDate.getUTCDate() + 6);
  
    return { startDate, endDate };
  }