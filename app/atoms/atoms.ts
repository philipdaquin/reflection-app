import { atom } from "recoil";
import { AudioData } from "../typings";
import { ELEVEN_LABS_KEY, OPENAI_KEY } from "../components/SettingsButtons";

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
export const ElevenLabsApiKey = atom<string | null>({
    key: 'eleven_labs_api_key',
    default: null
})
export const OpenAIApiKey = atom<string | null>({
    key: 'openai_api_key',
    default: null
})
