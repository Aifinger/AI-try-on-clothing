import React, { useEffect, useState } from 'react';
import { ImageAsset, LoadingState } from '../types';
import { generateTryOn, urlToBase64 } from '../services/geminiService';
import { Loader2, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';

interface StepThreeProps {
  selectedPerson: ImageAsset;
  selectedClothes: ImageAsset;
  onResultGenerated: (resultUrl: string) => void;
  onBack: () => void;
  onRestart: () => void;
  resultImage: string | null;
}

const StepThreeGenerate: React.FC<StepThreeProps> = ({
  selectedPerson,
  selectedClothes,
  onResultGenerated,
  onBack,
  onRestart,
  resultImage
}) => {
  const [loading, setLoading] = useState<LoadingState>('idle');
  const [error, setError] = useState<string | null>(null);

  const processGeneration = async () => {
    setLoading('generating_tryon');
    setError(null);

    try {
      // 1. Prepare Person Image (Convert to Base64 if it's a URL)
      let personB64 = selectedPerson.url;
      if (!selectedPerson.url.startsWith('data:')) {
        // Remove data:image/png;base64, part if it exists inside urlToBase64 but urlToBase64 returns raw b64 for api
        // Our helper returns raw base64.
        personB64 = await urlToBase64(selectedPerson.url);
      } else {
        personB64 = selectedPerson.url.split(',')[1];
      }

      // 2. Prepare Clothes Image
      let clothesB64 = selectedClothes.url;
      if (!selectedClothes.url.startsWith('data:')) {
        clothesB64 = await urlToBase64(selectedClothes.url);
      } else {
        clothesB64 = selectedClothes.url.split(',')[1];
      }

      // 3. Call API
      const resultUrl = await generateTryOn(personB64, clothesB64);
      onResultGenerated(resultUrl);

    } catch (err) {
      console.error(err);
      setError("生成失败。可能由于图片格式不支持或网络问题。请重试。");
    } finally {
      setLoading('idle');
    }
  };

  // Auto-start generation on mount if no result exists
  useEffect(() => {
    if (!resultImage && loading === 'idle') {
        processGeneration();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col h-full items-center justify-center animate-fade-in pb-20">
      
      {loading === 'generating_tryon' && (
        <div className="text-center space-y-4">
          <div className="relative w-24 h-24 mx-auto">
            <div className="absolute inset-0 rounded-full border-4 border-purple-100"></div>
            <div className="absolute inset-0 rounded-full border-4 border-purple-600 border-t-transparent animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
               <span className="text-2xl">✨</span>
            </div>
          </div>
          <h2 className="text-xl font-bold text-gray-800">正在为您试穿...</h2>
          <p className="text-gray-500">Nano Banana 正在施展魔法</p>
        </div>
      )}

      {error && (
        <div className="text-center space-y-4 bg-red-50 p-8 rounded-2xl border border-red-100 max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
          <h3 className="text-lg font-bold text-red-800">出错了</h3>
          <p className="text-red-600">{error}</p>
          <button 
            onClick={processGeneration}
            className="px-6 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
          >
            重试
          </button>
        </div>
      )}

      {resultImage && loading === 'idle' && (
        <div className="flex flex-col items-center w-full max-w-lg">
          <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border-4 border-white mb-8 group">
             <img src={resultImage} alt="TryOn Result" className="w-full h-full object-cover" />
             <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
          </div>
          
          <div className="flex items-center space-x-4 w-full px-4">
             <button 
               onClick={onRestart}
               className="flex-1 py-3 rounded-xl border border-gray-300 font-medium text-gray-700 hover:bg-gray-50 transition-colors flex justify-center items-center"
             >
               <RefreshCw className="mr-2 w-4 h-4" />
               重新开始
             </button>
             <button 
               onClick={() => {
                  const link = document.createElement('a');
                  link.href = resultImage;
                  link.download = `tryon-${Date.now()}.png`;
                  link.click();
               }}
               className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex justify-center items-center"
             >
               <CheckCircle className="mr-2 w-4 h-4" />
               保存图片
             </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StepThreeGenerate;
