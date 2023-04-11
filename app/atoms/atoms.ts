import { atom } from "recoil";
import { AudioData } from "../typings";

export const TimerState = atom({
    key: 'TimerState',
    default: 0,
})

export const RecordingState = atom({
    key: 'RecordingState',
    default: false,
})

export const AudioUrl = atom<string | null>({ 
    key: 'AudioUrl',
    default: null
})


export const AudioSummaryAtom = atom<AudioData | null>({ 
    key: 'AudioSummaryAtom',
    default: null
})

export const AverageWeeklyIndex = atom<string | null>({
    key: 'AverageWeeklyIndex',
    default: null
})