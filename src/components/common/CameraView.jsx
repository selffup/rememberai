import React, { useState, useRef, useEffect } from 'react';
import { IoCamera, IoRefreshOutline, IoFlashOutline, IoFlashOffOutline } from 'react-icons/io5';

const CameraView = () => {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [facingMode, setFacingMode] = useState('environment');
  const [flashMode, setFlashMode] = useState('off');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [facingMode]);

  const initializeCamera = async () => {
    try {
      setIsLoading(true);
      const constraints = {
        video: {
          facingMode,
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: false
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleCamera = () => {
    setFacingMode(prev => prev === 'environment' ? 'user' : 'environment');
  };

  const toggleFlash = () => {
    if (!stream) return;
    const track = stream.getVideoTracks()[0];
    if (track.getCapabilities().torch) {
      const newMode = flashMode === 'off' ? 'on' : 'off';
      track.applyConstraints({
        advanced: [{ torch: newMode === 'on' }]
      });
      setFlashMode(newMode);
    }
  };

  const takePhoto = async () => {
    if (!videoRef.current || !stream) return;

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;

    const context = canvas.getContext('2d');
    context.drawImage(videoRef.current, 0, 0);

    try {
      const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg'));
      const url = URL.createObjectURL(blob);
      // Handle the captured photo URL here
      console.log('Photo captured:', url);
    } catch (error) {
      console.error('Error capturing photo:', error);
    }
  };

  return (
    <div className="relative h-screen w-full bg-black">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black">
          <div className="text-white">Loading camera...</div>
        </div>
      )}
      
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="h-full w-full object-cover"
      />

      {/* Camera Controls */}
      <div className="absolute bottom-0 left-0 right-0 p-4 pb-20 mb-16 flex justify-between items-center bg-gradient-to-t from-black/50 to-transparent">
        <button
          onClick={toggleFlash}
          className="p-3 rounded-full bg-gray-800/50 text-white"
        >
          {flashMode === 'off' ? <IoFlashOffOutline size={24} /> : <IoFlashOutline size={24} />}
        </button>

        <button
          onClick={takePhoto}
          className="p-6 rounded-full bg-white hover:bg-gray-200 transition-colors duration-200 shadow-lg"
        >
          <IoCamera size={32} className="text-black" />
        </button>

        <button
          onClick={toggleCamera}
          className="p-3 rounded-full bg-gray-800/50 text-white"
        >
          <IoRefreshOutline size={24} />
        </button>
      </div>
    </div>
  );
};

export default CameraView;