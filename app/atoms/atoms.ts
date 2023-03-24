import { atom } from "recoil";

export const TimerState = atom({
    key: 'TimerState',
    default: 0,
})

export const RecordingState = atom({
    key: 'RecordingState',
    default: false,
})