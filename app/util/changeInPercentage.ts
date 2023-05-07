import { useRecoilValue } from "recoil";
import { AverageWeeklyIndex } from "../atoms/atoms";

/*
    Calculate the change % in the user's emotion average 
    caused by each audio entry

    DEFAULT: WEEKLY weekly avg 



    RETURNS: String 
    Error: null 

*/
export default function changeInPercentage(rating: number, compareWith: number | null): number | null { 
    // const currentWeeklyAvg = useRecoilValue(AverageWeeklyIndex);
    if (!compareWith) return null

    // Get from the database CurrentAvg 

    const changeIn = (rating - compareWith) / compareWith * 100 
    console.log("asdasdkj woiefwei jewjfwoejf oije f[o", changeIn)

    return changeIn
}