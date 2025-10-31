import React, { useRef } from 'react';
import * as htmlToImage from 'html-to-image';

interface ResultCardProps {
  result: 'YES' | 'NO';
  profession: string;
  onCheckAgain: () => void;
  theme: 'dark' | 'light';
}

const ResultCard: React.FC<ResultCardProps> = ({ result, profession, onCheckAgain, theme }) => {
  const resultCardRef = useRef<HTMLDivElement>(null);

  const generateImage = () => {
     if (!resultCardRef.current) {
      return Promise.reject('Result card not found');
    }
    // FIX: Corrected typo from resultCardred to resultCardRef
    return htmlToImage.toPng(resultCardRef.current, { 
        cacheBust: true, 
        backgroundColor: theme === 'dark' ? '#111827' : '#FFFFFF',
        pixelRatio: 2, // Higher quality image
      });
  }

  const handleDownload = () => {
    generateImage()
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = `ai-job-result-${profession.toLowerCase().replace(/\s+/g, '-')}.png`;
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.error('oops, something went wrong!', err);
      });
  };

  const handleShare = () => {
    generateImage()
    .then((dataUrl) => {
      // 1. Trigger download for the user to have the file
      const link = document.createElement('a');
      link.download = `ai-job-result-${profession.toLowerCase().replace(/\s+/g, '-')}.png`;
      link.href = dataUrl;
      link.click();
      
      // 2. Open Twitter with pre-filled text, prompting them to upload
      const text = `I asked if AI will take my ${profession} job. The oracle said... ${result}!\n\n(Proof attached! 😉) What about yours?\n\n@bengubadev #WillAITakeMyJob`;
      const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
      window.open(url, '_blank');
    })
    .catch((err) => {
      console.error('oops, something went wrong!', err);
    });
  };
  
  const resultColor = result === 'YES' ? 'text-red-500' : 'text-green-400';
  const resultColorLight = result === 'YES' ? 'text-red-600' : 'text-green-600';

  return (
    <div className="flex flex-col items-center justify-center w-full space-y-8">
      <div 
        ref={resultCardRef} 
        className={`p-8 md:p-12 border-4 w-full max-w-2xl flex flex-col items-center text-center ${theme === 'dark' ? 'bg-gray-900 border-gray-400' : 'bg-white border-black'}`}
      >
        <p className={`font-roboto-mono text-lg mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Will AI take the job of a...</p>
        <p className={`font-bungee text-3xl md:text-4xl my-4 uppercase ${theme === 'dark' ? 'text-white' : 'text-black'}`}>{profession}</p>
        <p className={`font-roboto-mono text-lg mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>The oracle says:</p>
        <h2 className={`font-blackops-one text-7xl md:text-9xl mt-4 ${theme === 'dark' ? resultColor : resultColorLight}`}>{result}</h2>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-2xl">
        <button
          onClick={onCheckAgain}
          className={`w-full font-roboto-mono text-lg py-3 border-2 transition-all duration-200 ${theme === 'dark' ? 'border-white text-white hover:bg-white hover:text-black' : 'border-black text-black hover:bg-black hover:text-white'}`}
        >
          CHECK AGAIN
        </button>
        <button
          onClick={handleDownload}
          className={`w-full font-roboto-mono text-lg py-3 border-2 transition-all duration-200 ${theme === 'dark' ? 'border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black' : 'border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white'}`}
        >
          DOWNLOAD
        </button>
        <button
          onClick={handleShare}
          className={`w-full font-roboto-mono text-lg py-3 border-2 transition-all duration-200 ${theme === 'dark' ? 'border-fuchsia-400 text-fuchsia-400 hover:bg-fuchsia-400 hover:text-black' : 'border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white'}`}
        >
          SHARE
        </button>
      </div>
    </div>
  );
};

export default ResultCard;
