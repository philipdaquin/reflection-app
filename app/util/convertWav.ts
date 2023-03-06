import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

export async function convertWav(webmBlob: Blob): Promise<Blob> {

  const ffmpeg = createFFmpeg({ log: false });
  await ffmpeg.load();

  const inputName = 'input.webm';
  const outputName = 'output.wav';

  ffmpeg.FS('writeFile', inputName, await fetchFile(webmBlob));

  await ffmpeg.run('-i', inputName, outputName);

  const outputData = ffmpeg.FS('readFile', outputName);
  const outputBlob = new Blob([outputData.buffer], { type: 'audio/wav' });

  return outputBlob;
};

