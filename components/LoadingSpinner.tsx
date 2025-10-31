
import React, { useState, useEffect } from 'react';

const LoadingSpinner: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [dots, setDots] = useState('');

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress(prev => (prev >= 100 ? 100 : prev + 1));
    }, 100); // 100ms * 100 = 10s

    const dotsInterval = setInterval(() => {
      setDots(prev => (prev.length >= 3 ? '' : prev + '.'));
    }, 500);

    return () => {
      clearInterval(progressInterval);
      clearInterval(dotsInterval);
    };
  }, []);

  return (
    <div className="w-full max-w-md p-4 flex flex-col items-center justify-center space-y-4">
      <p className="font-roboto-mono text-lg md:text-xl">ANALYZING FUTURE EMPLOYMENT MATRIX{dots}</p>
      <div className="w-full bg-gray-700 border-2 border-current">
        <div
          className="bg-current h-4 transition-all duration-100 ease-linear"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <p className="font-roboto-mono text-2xl">{progress}%</p>
    </div>
  );
};

export default LoadingSpinner;
