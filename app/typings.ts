


export type TextClassification = { 
    _id: string,
    audio_ref: string,
    date: string,
    day: string,
    emotion: string, 
    emotion_emoji: string | null,
    average_mood: number 
  }
  
export class AudioData { 
    _id: string;
    title: string | null;
    transcription: string;
    summary: string | null;
    text_classification: TextClassification;
    tags: string[] | null;
  
  constructor(
      _id: string,
      title: string | null,
      transcription: string,
      summary: string | null,
      text_classification: TextClassification,
      tags: string[] | null,
    ) {
      this._id = _id;
      this.title = title;
      this.transcription = transcription;
      this.summary = summary;
      this.text_classification = text_classification;
      this.tags = tags;
    }
  }
export type AudioEntryType = { 
    id: number,
    title: string,
    subtitle: string,
    date: string,
    duration: number,
    thumbnailUrl: string,
    audioUrl: string
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
    name: string;
    mood: number;

    constructor(item: TextClassification) { 
        this.name = item.day;
        this.mood = item.average_mood
    }
}

export type WeeklySummary = {
    _id: string
    start_week: Date | null
    end_week: Date | null
    common_mood: CommonMoodData[] | null
    inflection: AudioData | null
    min: AudioData | null
    max: AudioData | null
    important_events: EventData[] | null
    recommendations: RecommendedActivity[] | null
}


// DEFAULT SAMPLESc
export const DEFAULT_RECENT_SAMPLES: AudioEntryType[] = [
    {
      id: 1,
      title: 'Intro to JavaScript',
      subtitle: '',
      date: '',
      duration: 1200,
      thumbnailUrl: 'https://images.unsplash.com/photo-1675746799064-d9bfa131e9e5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1yZWxhdGVkfDF8fHxlbnwwfHx8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
      audioUrl: 'https://www.youtube.com/watch?v=of6MnTR_nYo'
    },
    {
      id: 2,
      title: 'React for Beginners',
      subtitle: '',
      date: '',
      duration: 1800,
      thumbnailUrl: 'https://images.unsplash.com/photo-1486915309851-b0cc1f8a0084?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8aG90fGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
      audioUrl: 'https://www.youtube.com/watch?v=Ke90Tje7VS0'
    }
  ];