import { createFFmpeg, fetchFile,  } from '@ffmpeg/ffmpeg';


// Convert the blob to WAV format 
export async function convertWav(blob: Blob): Promise<Blob> {
  console.log("Converting blob into WAV....")

  const buffer = await blob.arrayBuffer();

  const ffmpeg = createFFmpeg({
    mainName: 'main',
    corePath: 'https://unpkg.com/@ffmpeg/core-st@0.11.1/dist/ffmpeg-core.js',
  });
  await ffmpeg.load();

  const inputName = 'input.webm';
  const outputName = 'output.wav';

  ffmpeg.FS('writeFile', inputName, new Uint8Array(buffer));
  await ffmpeg.run(
      '-i',           // Input file flag
      inputName,      // Input file path
      "-acodec",      // Audio codec flag
      "libmp3lame",   // Audio codec value
      "-b:a",         // Audio bitrate flag
      "96k",          // Audio bitrate value
      "-ar",          // Audio sample rate flag
      "44100",        // Audio sample rate value
      // "16000",        // Audio sample rate value
      "-af",          // Audio filter flag
      "silenceremove=start_periods=0:stop_periods=-1:start_threshold=-50dB:stop_threshold=-60dB:start_silence=1.5:stop_silence=2",
                      // Audio filter value
      outputName      // Output file path
  );
  const outputData = ffmpeg.FS('readFile', outputName);
  
  // if (outputData.length <= 225) {
  //   ffmpeg.exit();
  //   console.log("too short");
  // }

  const outputBlob = new Blob([outputData.buffer], { type: 'audio/wav' });

  return outputBlob;
};

