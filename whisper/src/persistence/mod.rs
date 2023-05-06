use bson::DateTime;
use chrono::{Utc, Duration, Datelike, TimeZone};

pub mod db;
pub mod audio_db;
pub mod audio_analysis;
pub mod weekly_db;
pub mod daily_db;



///
/// Helper function to get the start of the week and end date of the week in bson 
pub fn get_current_week() -> (DateTime, DateTime) { 
    // Get current start of the week and end of the week dates 
    let now = Utc::now().date_naive();
    let start_of_week = now - Duration::days(now.weekday().num_days_from_monday() as i64);
    let end_of_week = start_of_week + Duration::days(7);
    
    // Convert both values into naivedatetime and set to 00:00:00
    let start_date = start_of_week.and_hms_opt(0, 0, 0).unwrap();
    let end_date = end_of_week.and_hms_opt(0, 0, 0).unwrap();

     // Convert to DateTime in Chrono        
    let start_date_time: chrono::DateTime<Utc> =  Utc.from_utc_datetime(&start_date);
    let end_date_time: chrono::DateTime<Utc> =  Utc.from_utc_datetime(&end_date);

     // Convert to Bson DateTime  
    let bson_start_date = bson::DateTime::from_chrono(start_date_time);
    let bson_end_date = bson::DateTime::from_chrono(end_date_time);

     (bson_start_date, bson_end_date)
}

///
/// Helper function to generate start_day with time of `00:00:00` to end of the day with time `23:59:59`
pub fn get_current_day(date: &chrono::DateTime<Utc>) -> (bson::DateTime, bson::DateTime) { 
    
    let start_day = date
        .date_naive()
        .and_hms_opt(0, 0, 0)
        .unwrap();

     let end_day = date
        .date_naive() 
        .and_hms_opt(23, 59, 59)
        .unwrap();
    
    // Convert NaiveDateTime to DateTime<Utc>
    let start_time: chrono::DateTime<Utc> =  Utc.from_utc_datetime(&start_day);
    let end_time: chrono::DateTime<Utc> =  Utc.from_utc_datetime(&end_day);

     // Convert DateTime<Utc> to Bson DateTime 
    let bson_start_time = bson::DateTime::from_chrono(start_time);
    let bson_end_time = bson::DateTime::from_chrono(end_time);
    
    (bson_start_time, bson_end_time)
}