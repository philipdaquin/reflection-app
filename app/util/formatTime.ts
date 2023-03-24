
function formatTime(seconds: number): string {
    const date = new Date(0);
    date.setSeconds(seconds);
    const timeString = date.toISOString().slice(11, 19);
    return timeString;
}

export default formatTime