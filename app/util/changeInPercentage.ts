import { useRecoilValue } from "recoil";
import { AverageWeeklyIndex } from "../atoms/atoms";

/*
    Calculate the change % in the user's emotion average 
    caused by each audio entry

    DEFAULT: WEEKLY weekly avg 



    RETURNS: String 
    Error: null 

*/
export default function changeInPercentage(rating: number): string | null { 
    // const currentWeeklyAvg = useRecoilValue(AverageWeeklyIndex);
    const currentWeeklyAvg = 0.88
    if (!currentWeeklyAvg) return null

    // Get from the database CurrentAvg 

    const changeIn = (rating - currentWeeklyAvg) / currentWeeklyAvg * 100 


    return changeIn.toFixed(2) 
}