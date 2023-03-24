import React, { useRef, useEffect } from 'react';

interface AudioVisualizerProps {
  width: number;
  height: number;
}

const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ width, height }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const context = canvas.getContext('2d')!;
    const audioContext = new AudioContext();

    // Request access to user's microphone
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      source.connect(analyser);

      // Configure analyser
      analyser.fftSize = 512 * 8 ;
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      // Initialize time variables
      let startTime = performance.now();
      let lastFrameTime = startTime;
      let offset = 0;

      // Render loop
      const renderFrame = () => {
        requestAnimationFrame(renderFrame);

        // Get audio data and render spectrum
        analyser.getByteFrequencyData(dataArray);

        // Calculate offset based on elapsed time
        let elapsedTime = performance.now() - startTime;
        offset = (elapsedTime / 1000) * width;
        let deltaOffset = offset - (elapsedTime - 16) / 1000 * width;

        // Clear canvas
        context.clearRect(0, 0, width, height);

        // Draw bars
        const barWidth = width / bufferLength * 10
        // let x = -offset % (barWidth + 8);
        let x = (barWidth + 10) -offset % width;

        for (let i = 0; i < bufferLength; i++) {
          const amplitude = dataArray[i] / 255;
          context.beginPath();
          context.moveTo(x, height);
          context.lineTo(x, height - amplitude * height);
          context.lineWidth = barWidth;
          context.strokeStyle = `#[424242]`;
          context.stroke();
          x += barWidth + 8;
        }

        // Update time variables
        lastFrameTime = performance.now() ;
        offset = deltaOffset;
      };

      renderFrame();
    });
  }, [canvasRef, width, height]);

  return <canvas ref={canvasRef} width={width} height={height} />;
};

export default AudioVisualizer;
