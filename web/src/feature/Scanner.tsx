import React from 'react';
import useBarcodeScanner from './useBarcodeScanner';

export default function Scanner() {
  const { scanner, preview, handleStart } = useBarcodeScanner(360, 360);

  return (
    <div>
      <button onClick={handleStart}>開始</button>
      <canvas ref={scanner}></canvas>
      <canvas ref={preview} width={180} height={48}></canvas>
    </div>
  );
}
