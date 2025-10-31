import React, { useState, useEffect, useCallback } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import { FUTURISTIC_FONTS } from './constants';
import LoadingSpinner from './components/LoadingSpinner';
import ResultCard from './components/ResultCard';
import Background3D from './components/Background3D';

type Theme = 'dark' | 'light';
const MOCK_CA = '0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const App: React.FC = () => {
  const [fontIndex, setFontIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<'YES' | 'NO' | null>(null);
  const [theme, setTheme] = useState<Theme>('dark');
  const [profession, setProfession] = useState('');
  const [caCopied, setCaCopied] = useState(false);


  useEffect(() => {
    const interval = setInterval(() => {
      setFontIndex((prevIndex) => (prevIndex + 1) % FUTURISTIC_FONTS.length);
    }, 150);
    return () => clearInterval(interval);
  }, []);

  const handleCheck = useCallback(async () => {
    if (!profession.trim()) return;
    setIsLoading(true);
    setResult(null);

    // Artificial 10-second delay for the loading animation
    await new Promise(resolve => setTimeout(resolve, 10000));

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Will AI take the job of a ${profession}?`,
        config: {
          systemInstruction: "You are an oracle that predicts the future of professions in the age of AI. Your answers must be concise and direct. For any given profession, you must determine if AI is likely to take over that job. You must only respond with 'YES' or 'NO' in a JSON format with a 'result' key.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              result: {
                type: Type.STRING,
                description: 'The answer. Must be either "YES" or "NO".'
              },
            },
            required: ['result'],
          },
        },
      });

      const jsonStr = response.text.trim();
      const parsedResult = JSON.parse(jsonStr);
      const outcome = parsedResult.result?.toUpperCase() === 'YES' ? 'YES' : 'NO';
      setResult(outcome);
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      // Fallback to random for demo purposes if API fails
      const outcome = Math.random() < 0.7 ? 'YES' : 'NO';
      setResult(outcome);
    } finally {
      setIsLoading(false);
    }
  }, [profession]);
  
  const handleCheckAgain = () => {
      setResult(null);
      setIsLoading(false);
      setProfession('');
  }

  const toggleTheme = () => {
    setTheme(currentTheme => (currentTheme === 'dark' ? 'light' : 'dark'));
  };
  
  const handleCopyCa = () => {
    navigator.clipboard.writeText(MOCK_CA).then(() => {
        setCaCopied(true);
        setTimeout(() => setCaCopied(false), 2000);
    });
};

  const currentAiFont = FUTURISTIC_FONTS[fontIndex];
  const currentJobFont = FUTURISTIC_FONTS[(fontIndex + 7) % FUTURISTIC_FONTS.length]; // Offset for variety

  const themeClasses = theme === 'dark' 
    ? 'bg-gray-900 text-green-400' 
    : 'bg-gray-100 text-black';
    
  const inputThemeClasses = theme === 'dark'
    ? 'border-gray-600 focus:border-green-400 text-green-400 placeholder-gray-700'
    : 'border-gray-400 focus:border-black text-black placeholder-gray-500'

  const buttonThemeClasses = theme === 'dark' 
    ? 'border-green-400 hover:bg-green-400 hover:text-black disabled:bg-transparent disabled:text-green-400 disabled:hover:text-green-400' 
    : 'border-black hover:bg-black hover:text-white disabled:bg-transparent disabled:text-black disabled:hover:text-black'

  return (
    <div className={`relative flex flex-col items-center justify-between min-h-screen p-4 sm:p-8 font-roboto-mono transition-colors duration-500 ${themeClasses}`}>
      <Background3D theme={theme} profession={profession} />
      
      <header className="w-full flex justify-end z-10">
        <button onClick={toggleTheme} className={`p-2 border-2 ${theme === 'dark' ? 'border-green-400 hover:bg-green-400 hover:text-black' : 'border-black hover:bg-black hover:text-white'} transition-colors duration-200`}>
          {theme === 'dark' ? 
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg> :
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
          }
        </button>
      </header>
      
      <main className="flex-grow flex flex-col items-center justify-center w-full text-center z-10">
        {isLoading ? (
          <LoadingSpinner />
        ) : result ? (
          <ResultCard result={result} onCheckAgain={handleCheckAgain} theme={theme} profession={profession}/>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-12 w-full max-w-lg">
            <p className={`text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-2`}>will-ai-take-my-job.benguba.dev</p>
            <div className="h-48 flex items-center justify-center">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold uppercase leading-tight">
                <span className="font-roboto-mono">Will </span>
                <span className={`${currentAiFont} transition-all duration-100 ${theme === 'dark' ? 'text-cyan-400' : 'text-blue-600'}`}>AI</span>
                <span className="font-roboto-mono"> take my </span>
                <span className={`${currentJobFont} transition-all duration-100 ${theme === 'dark' ? 'text-fuchsia-400' : 'text-purple-600'}`}>Job</span>
                <span className="font-roboto-mono">?</span>
              </h1>
            </div>
            <div className="w-full">
                <label htmlFor="profession" className="sr-only">Your Profession</label>
                <input
                    id="profession"
                    type="text"
                    value={profession}
                    onChange={(e) => setProfession(e.target.value)}
                    placeholder="ENTER YOUR PROFESSION"
                    className={`w-full p-4 text-center bg-transparent border-2 text-xl font-roboto-mono uppercase transition-colors duration-300 focus:outline-none ${inputThemeClasses}`}
                />
            </div>
            <button
              onClick={handleCheck}
              disabled={!profession.trim()}
              className={`px-16 py-4 text-2xl font-bold border-4 transition-all duration-200 ease-in-out disabled:opacity-40 disabled:cursor-not-allowed ${buttonThemeClasses}`}
            >
              CHECK
            </button>
          </div>
        )}
      </main>

      <footer className={`text-center w-full z-10 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}>
        <p className="text-2xl font-blackops-one">CA</p>
        <div className={`relative flex items-center justify-center gap-2 mt-1 mx-auto max-w-sm border p-2 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-400'}`}>
            <p className="text-sm tracking-widest truncate font-mono">{MOCK_CA}</p>
            <button 
                onClick={handleCopyCa} 
                className={`font-roboto-mono text-xs px-2 py-1 border transition-colors duration-200 ${theme === 'dark' ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-500 hover:bg-gray-300'}`}
                style={{minWidth: '60px'}}
            >
                {caCopied ? 'COPIED!' : 'COPY'}
            </button>
        </div>
        <p className="text-sm tracking-widest mt-2">by bengubadev</p>
      </footer>
    </div>
  );
};

export default App;