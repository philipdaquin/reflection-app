


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
    percentage: float
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