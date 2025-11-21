import React from 'react';
import { AppStep, ImageAsset } from '../types';
import { User, Shirt, Sparkles } from 'lucide-react';

interface HeaderCardsProps {
  currentStep: AppStep;
  selectedPerson: ImageAsset | null;
  selectedClothes: ImageAsset | null;
  resultImage: string | null;
}

const HeaderCards: React.FC<HeaderCardsProps> = ({
  currentStep,
  selectedPerson,
  selectedClothes,
  resultImage,
}) => {
  const getCardStyle = (step: number) => {
    const isActive = currentStep === step;
    const isPast = currentStep > step;
    
    let baseClasses = "relative w-24 h-36 md:w-32 md:h-48 rounded-2xl shadow-xl transition-all duration-500 ease-out flex items-center justify-center overflow-hidden border-4";
    
    // Tilt logic
    const tilt = step === 1 ? '-rotate-6 translate-y-2' : step === 2 ? 'rotate-0 -translate-y-2 z-10' : 'rotate-6 translate-y-2';
    
    // Color/Border logic
    let borderColor = "border-white";
    if (isActive) borderColor = "border-purple-500 scale-110 shadow-purple-500/30";
    else if (isPast) borderColor = "border-green-400";
    else borderColor = "border-gray-200 opacity-70 grayscale";

    return `${baseClasses} ${tilt} ${borderColor}`;
  };

  return (
    <div className="flex justify-center items-center py-8 md:py-12 space-x-4 md:space-x-8 perspective-1000">
      {/* Card 1: Person */}
      <div className={getCardStyle(1)}>
        {selectedPerson ? (
          <img src={selectedPerson.url} alt="Person" className="w-full h-full object-cover" />
        ) : (
          <div className="bg-gray-100 w-full h-full flex flex-col items-center justify-center text-gray-400">
            <User size={32} />
            <span className="text-xs font-bold mt-2">人物</span>
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[10px] text-center py-1">
          Step 1
        </div>
      </div>

      {/* Card 2: Clothes */}
      <div className={getCardStyle(2)}>
        {selectedClothes ? (
          <img src={selectedClothes.url} alt="Clothes" className="w-full h-full object-cover" />
        ) : (
          <div className="bg-gray-100 w-full h-full flex flex-col items-center justify-center text-gray-400">
            <Shirt size={32} />
            <span className="text-xs font-bold mt-2">服饰</span>
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[10px] text-center py-1">
          Step 2
        </div>
      </div>

      {/* Card 3: Result */}
      <div className={getCardStyle(3)}>
        {resultImage ? (
          <img src={resultImage} alt="Result" className="w-full h-full object-cover" />
        ) : (
          <div className="bg-gradient-to-br from-purple-100 to-pink-100 w-full h-full flex flex-col items-center justify-center text-gray-400">
            <Sparkles size={32} className={currentStep === 3 ? "animate-pulse text-purple-400" : ""} />
            <span className="text-xs font-bold mt-2">效果</span>
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[10px] text-center py-1">
          Step 3
        </div>
      </div>
    </div>
  );
};

export default HeaderCards;
