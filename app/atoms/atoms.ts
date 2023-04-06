import { atom } from "recoil";
import { AudioData, TextClassification } from "../pages";

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


export const AudioSummaryAtom = atom<AudioData>({ 
    key: 'AudioSummaryAtom',
    default: null
})