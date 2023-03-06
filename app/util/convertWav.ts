import { createFFmpeg, fetchFile,  } from '@ffmpeg/ffmpeg';


// Convert the blob to WAV format 
export async function convertWav(webmBlob: Blob): Promise<Blob> {
  console.log("Converting blob into WAV....")
  const ffmpeg = createFFmpeg({
    mainName: 'main',
    corePath: 'https://unpkg.com/@ffmpeg/core-st@0.11.1/dist/ffmpeg-core.js',
  });
  await ffmpeg.load();

  const inputName = 'input.webm';
  const outputName = 'output.wav';

  ffmpeg.FS('writeFile', inputName, await fetchFile(webmBlob));
  await ffmpeg.run('-i', inputName, outputName);

  const outputData = ffmpeg.FS('readFile', outputName);
  const outputBlob = new Blob([outputData.buffer], { type: 'audio/wav' });

  return outputBlob;
};

