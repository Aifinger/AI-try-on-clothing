import React, { useState, useEffect } from 'react';
import { AppStep, ImageAsset, HistoryItem } from './types';
import HeaderCards from './components/HeaderCards';
import StepOnePerson from './components/StepOnePerson';
import StepTwoClothes from './components/StepTwoClothes';
import StepThreeGenerate from './components/StepThreeGenerate';
import HistoryGallery from './components/HistoryGallery';
import { Sparkles } from 'lucide-react';

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>(AppStep.SELECT_PERSON);
  const [selectedPerson, setSelectedPerson] = useState<ImageAsset | null>(null);
  const [selectedClothes, setSelectedClothes] = useState<ImageAsset | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const handleResultGenerated = (resultUrl: string) => {
    setResultImage(resultUrl);
    
    // Add to history
    if (selectedPerson && selectedClothes) {
      const newItem: HistoryItem = {
        id: Date.now().toString(),
        personImage: selectedPerson.url,
        clothesImage: selectedClothes.url,
        resultImage: resultUrl,
        timestamp: Date.now(),
      };
      setHistory(prev => [newItem, ...prev]);
    }
  };

  const handleRestart = () => {
    setStep(AppStep.SELECT_PERSON);
    setSelectedPerson(null);
    setSelectedClothes(null);
    setResultImage(null);
  };

  const restoreHistoryItem = (item: HistoryItem) => {
    setSelectedPerson({ id: 'hist-p', url: item.personImage });
    setSelectedClothes({ id: 'hist-c', url: item.clothesImage });
    setResultImage(item.resultImage);
    setStep(AppStep.GENERATE_RESULT);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-slate-800 selection:bg-purple-200">
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-6 min-h-screen flex flex-col">
        
        {/* Header / Nav */}
        <header className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2 text-purple-700">
            <div className="bg-purple-600 text-white p-2 rounded-lg shadow-md">
              <Sparkles size={20} />
            </div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight">AI Fashion Try-On</h1>
          </div>
          <div className="text-xs font-medium text-purple-500 bg-purple-50 px-3 py-1 rounded-full border border-purple-100">
            Powered by Nano Banana
          </div>
        </header>

        {/* 3D Cards Visualizer */}
        <section className="mb-8">
           <HeaderCards 
             currentStep={step}
             selectedPerson={selectedPerson}
             selectedClothes={selectedClothes}
             resultImage={resultImage}
           />
        </section>

        {/* Main Operation Area */}
        <main className="flex-1 bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-8 relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-400 via-pink-500 to-red-400 opacity-50"></div>
           
           {step === AppStep.SELECT_PERSON && (
             <StepOnePerson 
               selectedPerson={selectedPerson}
               onSelect={setSelectedPerson}
               onNext={() => setStep(AppStep.SELECT_CLOTHES)}
             />
           )}

           {step === AppStep.SELECT_CLOTHES && (
             <StepTwoClothes
               selectedClothes={selectedClothes}
               selectedPerson={selectedPerson}
               onSelect={setSelectedClothes}
               onBack={() => setStep(AppStep.SELECT_PERSON)}
               onNext={() => setStep(AppStep.GENERATE_RESULT)}
             />
           )}

           {step === AppStep.GENERATE_RESULT && selectedPerson && selectedClothes && (
             <StepThreeGenerate
               selectedPerson={selectedPerson}
               selectedClothes={selectedClothes}
               resultImage={resultImage}
               onResultGenerated={handleResultGenerated}
               onBack={() => setStep(AppStep.SELECT_CLOTHES)}
               onRestart={handleRestart}
             />
           )}
        </main>

        {/* History Gallery */}
        <HistoryGallery history={history} onSelectHistory={restoreHistoryItem} />
      </div>
    </div>
  );
};

export default App;
