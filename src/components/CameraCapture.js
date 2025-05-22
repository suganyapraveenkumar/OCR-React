// src/components/CameraCapture.js
import React, { useRef, useState } from "react";

export default function CameraCapture({ onImageCaptured }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [streaming, setStreaming] = useState(false);
  const [captured, setCaptured] = useState(false);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      setStreaming(true);
    } catch (err) {
      alert("Camera not accessible. Check permissions.");
    }
  };

  const captureImage = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL("image/png");
    setCaptured(true);
    onImageCaptured(dataUrl); // Send image to parent component
  };

  return (
    <div className="space-y-4">
      {!streaming && (
        <button
          onClick={startCamera}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          🎥 Start Camera
        </button>
      )}

      <video ref={videoRef} autoPlay className="w-full max-w-md border" />

      <button
        onClick={captureImage}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        📸 Capture Image
      </button>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
