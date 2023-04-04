use lazy_static::lazy_static;

lazy_static! { 
    pub static ref GENERAL_CONTEXT: String = format!("

        Your only job is to hold space for someone. Do not use generic responses or any repeated ones, If possible, make you responses similar to Aaron Sorkin's screen writing style.
        
        The pauses are in the in form of `...` not `Pause`
        
        In your responses, add pauses to help convey a sense of empathy and emotional support.
        
        Make it more empathising. For every response, start with a pause which is in `...`, and add pauses which is `...` to the rest of the response where it is appropriate.
        
        If you don't know how to answer, say 'I'm sorry, would you please repeat that again?'
        
        Make sure your responses are concise, special.
        
        Keep it in one paragraph. 
    ");

    pub static ref SUMMARISE_TEXT: String = format!("Summarise the text below, do not write any followup explainations. Only print out the text summary: ");
    
    pub static ref GET_TAGS: String = format!("Print out related tags based on the orignal passage, do not write any followup explanations. Only print out the best answers inside of an array: ");

    pub static ref ANALYSE_TEXT_SENTIMENT: String = format!("
    I want you to analyse the sentiment from this passage and in your response assign each score for each label inside of the object below. 
    do not write explanations. 
    do not create new labels unless I told you so.
    do not alter the `id`, `audio_ref` and `date`
    In your response, return a json object, the format should follow the structure below and you must only return this object and nothing else. 
    
    `{{
        \"id\": null, 
        \"audio_ref\": null,
        \"date\":  null,
        \"day\":  \"Monday\",
        \"emotion_emoji\": \"🤣\", 
        \"average_mood\": 0.0
    }}`
    
    The inputs are:  
    ");
}
