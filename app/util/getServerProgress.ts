

/*
    Send server side updates based on audio processing 
*/
function getServerUpdates() { 
    const eventSource = new EventSource('http://localhost:4000/api/audio/events')
        
}