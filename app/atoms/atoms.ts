import { atom } from "recoil";
import { AudioData, DefaultFilterOption, MoodFrequency, MoodTriggerType, WeeklySummary } from "../typings";
import { ELEVEN_LABS_KEY, OPENAI_KEY } from "../components/SettingsButtons";
import { MutableRefObject } from "react";
import ReactPlayer from "react-player";

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

export const AverageWeeklyIndex = atom<number | null>({
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

export const AddEntryToggle = atom({
    key: 'AddEntryToggle',
    default: false,
})

export const SelectedFilterOption = atom({
    key: 'SelectedFilterOption',
    default: DefaultFilterOption
})


export const CurrentWeekSummary = atom<WeeklySummary | null>({
    key: 'CurrentWeekSummary',
    default: null
})

export const MoodTriggerPage = atom<MoodFrequency | null>({ 
    key: 'MoodTriggerPage',
    default: null
})

export const SelectedAudioPlayer = atom<AudioData | null>({ 
    key: 'SelectedAudioPlayer',
    default: null
})

export const ShowAudioPlayer = atom<boolean>({ 
    key: 'ShowAudioPlayer',
    default: false
})
export const AudioPlayerSource = atom<string | null>({ 
    key: 'AudioPlayerSource',
    default: null
})
