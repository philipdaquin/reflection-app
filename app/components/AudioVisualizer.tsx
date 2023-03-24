import React, { useRef, useEffect } from 'react';

interface AudioVisualizerProps {
  width: number;
  height: number;
}
const fillRoundRect = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number
  ) => {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.fill();
  };
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
      analyser.fftSize = 256;
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      // Render loop
      const renderFrame = () => {
        requestAnimationFrame(renderFrame);

        // Get audio data and render spectrum
        analyser.getByteFrequencyData(dataArray);
        context.clearRect(0, 0, width, height);
        const barWidth = width / bufferLength * 2;
        let x = 0;
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
      };

      renderFrame();
    });
  }, [canvasRef, width, height]);

  return <canvas ref={canvasRef} width={width} height={height} />;
};

export default AudioVisualizer;