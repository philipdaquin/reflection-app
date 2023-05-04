
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

export class AudioData { 
    _id: string;
    title: string | null;
    date: Date ;
    day: string | null;
    transcription: string;
    summary: string | null;
    text_classification: TextClassification;
    tags: string[] | null;
  
  constructor(
      _id: string,
      title: string | null,
      date: Date ,
      day: string | null,
      transcription: string,
      summary: string | null,
      text_classification: TextClassification,
      tags: string[] | null,
    ) {
      this._id = _id;
      this.title = title;
      this.date = date;
      this.day = day;
      this.transcription = transcription;
      this.summary = summary;
      this.text_classification = text_classification;
      this.tags = tags;
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

export type TopMood = { 
    emotion: string | null, 
    emotion_emoji: string | null, 
    percentage: string | null
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



export type CommonMoodData = {  
    emotion: string,
    emotion_emoji: string, 
    percentage: number
}

export class WeeklyData {
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
    weekly_avg: number | null
    total_entries: number | null
    start_week: Date | null
    end_week: Date | null
    common_mood: CommonMoodData[] | null
    inflection: AudioData | null
    min: AudioData | null
    max: AudioData | null
    important_events: EventData[] | null
    recommendations: RecommendedActivity[] | null
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




export const DEFAULT_IMAGE_URL: string = 'https://www.telegraph.co.uk/content/dam/news/2021/06/04/UFO_trans_NvBQzQNjv4BqECnBSB4T3tw7hRvCORLehcLZq-j_VIcNfiYtpwBx7zI.jpg?imwidth=680'
