
import { ObjectId, Long, BSON } from 'bson';


export type TextClassification = { 
    _id: string,
    audio_ref: string,
    weekly_ref: string | null, 
    date: Date,
    day: string,
    emotion: string, 
    emotion_emoji: string | null,
    average_mood: number 
  }


export interface AudioData { 
    _id: string;
    title: string | null;
    image_url: string | null; 
    audio_url: string | null; 
    author: string | null;
    description: string | null;
    duration: number | null;
    favourite: boolean;
    date: Date ;
    day: string | null;
    transcription: string | null;
    summary: string | null;
    text_classification: TextClassification | null;
    tags: string[] | null;
}

export class AudioDataBuilder {
  private audioData: AudioData;

  constructor(_id: string, date: Date) {
    this.audioData = {
      _id,
      title: null,
      image_url: null,
      audio_url: null,
      author: null,
      description: null,
      duration: null,
      favourite: false,
      date,
      day: null,
      transcription: null, 
      summary: null,
      text_classification: null,
      tags: null
    };
  }

  public setTranscript(transcript: string | null) : AudioDataBuilder { 
    this.audioData.transcription = transcript;
    return this;
  }
  
  public setTitle(title: string | null): AudioDataBuilder {
    this.audioData.title = title;
    return this;
  }

  public setImageUrl(image_url: string | null): AudioDataBuilder {
    this.audioData.image_url = image_url;
    return this;
  }

  public setAudioUrl(audio_url: string | null): AudioDataBuilder {
    this.audioData.audio_url = audio_url;
    return this;
  }

  public setAuthor(author: string | null): AudioDataBuilder {
    this.audioData.author = author;
    return this;
  }

  public setDescription(description: string | null): AudioDataBuilder {
    this.audioData.description = description;
    return this;
  }

  public setDuration(duration: number | null): AudioDataBuilder {
    this.audioData.duration = duration;
    return this;
  }

  public setFavourite(favourite: boolean): AudioDataBuilder {
    this.audioData.favourite = favourite;
    return this;
  }

  public setDay(day: string | null): AudioDataBuilder {
    this.audioData.day = day;
    return this;
  }

  public setSummary(summary: string | null): AudioDataBuilder {
    this.audioData.summary = summary;
    return this;
  }

  public setTextClassification(
    text_classification: TextClassification  | null
  ): AudioDataBuilder {
    this.audioData.text_classification = text_classification;
    return this;
  }

  public setTags(tags: string[] | null): AudioDataBuilder {
    this.audioData.tags = tags;
    return this;
  }

  public build(): AudioData {
    return this.audioData;
  }
}

export class AudioEntryType { 
    id: string;
    title: string | null;
    subtitle: string | null;
    date: Date;
    duration: number | null;
    thumbnailUrl: string | null;
    audioUrl: string;

    constructor(data: AudioData) { 
      this.id = data._id
      this.title = data.title 
      this.subtitle = "" 
      this.date = data.date
      this.duration = 10 
      this.thumbnailUrl = ""
      this.audioUrl = ""
    }
}

export type MoodFrequency = { 
    emotion: string | null, 
    emotion_emoji: string | null, 
    count: number | null,
    percentage: string | null,
    _audio_ids: string[]
}
  

export type EventData = {
    emoji: string 
    title: string
    summary: string
}

export type RecommendedActivity = {
    title: string
    emoji: string 
    description: string
}




// export type CommonMoodData = {  
//     emotion: string,
//     emotion_emoji: string, 
//     percentage: number
// }

export class MoodDataPoint {
    date: Date;
    mood: number;

    constructor(item: TextClassification) { 
        this.date = item.date;
        this.mood = item.average_mood
    }
}

export type WeeklySummary = {
    _id: string
    week_number: number | null
    weekly_avg: number | null,
    previous_avg: number | null

    total_entries: number | null
    start_week: Date | null
    end_week: Date | null
    mood_frequency: MoodFrequency[] 
    inflection: AudioData | null
    min: AudioData | null
    max: AudioData | null
    important_events: EventData[] | null
    recommendations: RecommendedActivity[] | null
}

export type DailySummary = { 
  id: string,
  date: Date | null,
  total_entries: number,
  overall_mood: string | null,
  current_avg: number | null,
  previous_avg: number | null
  inflection: AudioData | null,
  min: AudioData | null,
  max: AudioData | null,
  mood_frequency: MoodFrequency[] 
}


// // DEFAULT SAMPLESc
// export const DEFAULT_RECENT_SAMPLES: AudioEntryType[] = [
//     {
//       id: "1",
//       title: 'Intro to JavaScript',
//       subtitle: '',
//       date: 123124124,
//       duration: 1200,
//       thumbnailUrl: 'https://images.unsplash.com/photo-1675746799064-d9bfa131e9e5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1yZWxhdGVkfDF8fHxlbnwwfHx8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
//       audioUrl: 'https://www.youtube.com/watch?v=of6MnTR_nYo'
//     },
//     {
//       id: "2",
//       title: 'React for Beginners',
//       subtitle: '',
//       date: 1241241241,
//       duration: 1800,
//       thumbnailUrl: 'https://images.unsplash.com/photo-1486915309851-b0cc1f8a0084?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8aG90fGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
//       audioUrl: 'https://www.youtube.com/watch?v=Ke90Tje7VS0'
//     }
//   ];
export type JobList = {
  title: string, 
  details: string
  isDone: boolean
}
export const DEFAULT_JOBLIST: JobList[] = [
  {
    title: 'Finish project',
    details: 'Complete all remaining tasks and submit it before the deadline',
    isDone: false,
  },
  {
    title: 'Buy groceries',
    details: 'Purchase items from the grocery list for the week',
    isDone: true,
  },
  {
    title: 'Go for a run',
    details: 'Run for 30 minutes around the park',
    isDone: false,
  },
];


export type ProgressData = { 
  progress: number | null
}

// Temporary Datatype for graph 
export type MoodTracker =  { 
  emotion: string,
  avgRating: number, 
  dateTime: Date
}


// export const DEFAULT_TEST_WEEKLY: WeeklyData[] = [
//     { name: 'M', mood: 4 },
//     { name: 'Tu', mood: 3 },
//     { name: 'W', mood: 0 },
//     { name: 'Th', mood: 10 },
//     { name: 'F', mood: 7 },
//     { name: 'Sa', mood: 4 },
//     { name: 'Su', mood: 10 },
// ];

export type FilterOptions = { 
  label: string, 
  value: string, 
  interval: string,
  format?: string 
}

export const DefaultFilterOption: FilterOptions = { label: 'All', value: 'all', interval: 'day', format: 'MMM D' }


export class EntryType { 
  id: string; 
  date: string;
  title: string; 
  emoji: string; 
  avgMood: number; 
  constructor(data: AudioData) {
      this.id = data._id
      this.date = data.date.toString()
      this.title = data.title || ""
      this.emoji = data.text_classification?.emotion_emoji || ""
      this.avgMood = data.text_classification?.average_mood || 0
  }
}
export type MoodTriggerType = { 
  id: number,
  mood_frequency: MoodFrequency
}


export const DEFAULT_IMAGE_URL: string = 'https://www.telegraph.co.uk/content/dam/news/2021/06/04/UFO_trans_NvBQzQNjv4BqECnBSB4T3tw7hRvCORLehcLZq-j_VIcNfiYtpwBx7zI.jpg?imwidth=680'

export const ALL_FILTER: FilterOptions[] = [
        { label: '24H', value: '1d', interval: 'hour' },
        { label: '1W', value: '1w', interval: 'day', format: 'MMM D' },
        // { label: '2W', value: '2w', interval: 'day', format: 'MMM D' },
        // { label: '1M', value: '1m', interval: 'day', format: 'MMM D' },
        // { label: '1Y', value: '1y', interval: 'month', format: 'MMM YY' },
        { label: 'All', value: 'all', interval: 'day', format: 'MMM D' }
    ];
    

export const MAIN_SERVER: string = "http://localhost:4001"
// export const MAIN_SERVER: string = `${process.env.MAIN_SERVER}`
export const CLIENT_SERVER: string = "http://localhost:3000"


