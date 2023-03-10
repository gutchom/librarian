import type { MouseEventHandler } from 'react';
import { useCallback, useRef } from 'react';

// const isBoundary = (prev: 0|1, curr: 0|1): boolean => prev !== curr;

/*
function calcWidths(widths: number[], index: number, array: (0|1)[]): number[] {
  if (index < array.length - 1) {
    if (isBoundary(array[index], array[index + 1])) {}
  } else {`

  }
}
*/

export default function useBarcodeScanner(width: number, height: number) {
  const scanner = useRef<HTMLCanvasElement>(null);
  const preview = useRef<HTMLCanvasElement>(null);

  const handleStart = useCallback<MouseEventHandler<HTMLButtonElement>>(() => {
    const video = document.createElement('video');
    video.muted = true;
    video.autoplay = true;
    video.playsInline = true;

    navigator.mediaDevices.getUserMedia({ audio: false, video: { width, height, facingMode: { exact: "environment" } } })
      .then((stream) => {
        video.srcObject = stream;
        video.play().catch(console.error);

        if (!scanner.current) return;
        scanner.current.width = width;
        scanner.current.height = height;
        const ctx = scanner.current.getContext('2d');

        if (!preview.current) return;
        preview.current.width = width/2;
        preview.current.height = 48;
        const ctx2 = preview.current.getContext('2d');

        setInterval(() => {
          if (!ctx) return;
          ctx.drawImage(video, 0, 0, width, height, 0, 0, width, height);
          const imageData = ctx.getImageData(width/4, height/2, width/2, 1);

          const pixels = [];
          for (let i = 0; i < imageData.data.length; i += 4) {
            const r = imageData.data[i];
            const g = imageData.data[i+1];
            const b = imageData.data[i+2];
            const brightness = Math.max(r, g, b);
            pixels.push(brightness);
          }
          const threshold = (Math.max(...pixels) - Math.min(...pixels)) / 2;
          const binaries = pixels.map((v) => v > threshold ? 1 : 0); // white is 1, black is 0.


          for (let i = 0; i < binaries.length; i++) {
            const color = binaries[i]*255;
            imageData.data[i*4] = color;
            imageData.data[i*4+1] = color;
            imageData.data[i*4+2] = color;
          }
          ctx2?.putImageData(imageData, 0, 0);

          const code = [1];
          for (let i = 1; i < binaries.length; i++) {
            if (binaries[i-1] === binaries[i]) {
              code[code.length - 1] += 1;
            } else {
              code.push(1);
            }
          }
          console.log(code.join(':'));

          ctx.fillStyle = '#0f0';
          ctx.fillRect(width/4, height/2, width/2, 1);
        }, 50);
      })
      .catch(console.error);
  }, [scanner]);

  return { scanner, preview, handleStart };
}
