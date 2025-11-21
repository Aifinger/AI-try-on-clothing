import React, { useRef, useState } from 'react';
import { ImageAsset, LoadingState } from '../types';
import { PRESET_CLOTHES } from '../constants';
import { Upload, Check, Wand2, Loader2 } from 'lucide-react';
import { generateClothesImage } from '../services/geminiService';

interface StepTwoProps {
  selectedClothes: ImageAsset | null;
  onSelect: (clothes: ImageAsset) => void;
  onNext: () => void;
  onBack: () => void;
  selectedPerson: ImageAsset | null;
}

const StepTwoClothes: React.FC<StepTwoProps> = ({ selectedClothes, onSelect, onNext, onBack, selectedPerson }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState<LoadingState>('idle');
  const [generatedClothes, setGeneratedClothes] = useState<ImageAsset[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        onSelect({
          id: `user-cloth-${Date.now()}`,
          url: result,
          isUserUploaded: true
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setLoading('generating_clothes');
    setError(null);
    
    try {
      const base64Image = await generateClothesImage(prompt);
      const newCloth: ImageAsset = {
        id: `gen-cloth-${Date.now()}`,
        url: base64Image,
        isGenerated: true
      };
      
      setGeneratedClothes(prev => [newCloth, ...prev]);
      onSelect(newCloth);
    } catch (err) {
      setError("生成失败，请重试或检查网络。");
    } finally {
      setLoading('idle');
    }
  };

  return (
    <div className="flex flex-col h-full space-y-6 animate-fade-in pb-20">
      <div className="flex justify-between items-end">
        <h2 className="text-2xl font-bold text-gray-800">2. 选择或设计服饰</h2>
        {selectedPerson && (
          <div className="flex items-center space-x-2 bg-gray-100 px-3 py-1 rounded-full text-xs text-gray-500">
             <span>已选模特</span>
             <img src={selectedPerson.url} alt="mini" className="w-6 h-6 rounded-full object-cover" />
          </div>
        )}
      </div>

      {/* Generation Area */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-2xl border border-indigo-100">
        <label className="block text-sm font-semibold text-indigo-900 mb-2">AI 设计师 (Nano Banana)</label>
        <div className="flex space-x-2">
          <input 
            type="text" 
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="描述你想试穿的衣服 (例如: 红色复古连衣裙, 赛博朋克夹克...)"
            className="flex-1 px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
            onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
          />
          <button 
            onClick={handleGenerate}
            disabled={loading === 'generating_clothes' || !prompt.trim()}
            className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-medium text-sm hover:bg-indigo-700 disabled:opacity-50 flex items-center transition-colors"
          >
            {loading === 'generating_clothes' ? <Loader2 className="animate-spin mr-2" size={16}/> : <Wand2 className="mr-2" size={16}/>}
            生成
          </button>
        </div>
        {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
      </div>

      {/* Grids */}
      <div className="space-y-6 overflow-y-auto no-scrollbar">
        {/* Generated & User Uploaded */}
        {(generatedClothes.length > 0 || selectedClothes?.isUserUploaded) && (
          <div>
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">我的衣橱</h3>
            <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
              {selectedClothes?.isUserUploaded && (
                 <div className="relative aspect-square rounded-xl overflow-hidden ring-4 ring-purple-500 shadow-lg">
                    <img src={selectedClothes.url} alt="User Upload" className="w-full h-full object-cover" />
                    <div className="absolute top-2 right-2 bg-purple-600 rounded-full p-1">
                       <Check size={12} className="text-white" />
                    </div>
                 </div>
              )}
              {generatedClothes.map(cloth => (
                <div 
                  key={cloth.id}
                  onClick={() => onSelect(cloth)}
                  className={`relative aspect-square rounded-xl overflow-hidden cursor-pointer border border-indigo-200 ${
                    selectedClothes?.id === cloth.id ? 'ring-4 ring-purple-500' : 'hover:opacity-90'
                  }`}
                >
                   <img src={cloth.url} alt="Generated" className="w-full h-full object-cover" />
                   {selectedClothes?.id === cloth.id && (
                      <div className="absolute top-2 right-2 bg-purple-600 rounded-full p-1">
                        <Check size={12} className="text-white" />
                      </div>
                   )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Presets */}
        <div>
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">精选搭配</h3>
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="aspect-square rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-purple-500 hover:bg-purple-50 transition-colors group"
            >
              <Upload className="text-gray-500 group-hover:text-purple-600" size={24} />
              <span className="mt-1 text-xs text-gray-500">上传</span>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
            </div>

            {PRESET_CLOTHES.map((cloth) => (
              <div 
                key={cloth.id}
                onClick={() => onSelect(cloth)}
                className={`relative aspect-square rounded-xl overflow-hidden cursor-pointer transition-all duration-200 bg-white ${
                  selectedClothes?.id === cloth.id 
                    ? 'ring-4 ring-purple-500 scale-95 shadow-lg' 
                    : 'hover:shadow-md hover:scale-105'
                }`}
              >
                <img src={cloth.url} alt="Preset Cloth" className="w-full h-full object-contain p-2" />
                {selectedClothes?.id === cloth.id && (
                  <div className="absolute top-2 right-2 bg-purple-600 rounded-full p-1">
                    <Check size={12} className="text-white" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="fixed bottom-4 left-0 right-0 md:absolute md:bottom-4 px-4 md:px-0 w-full max-w-5xl mx-auto">
        <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-gray-100 flex justify-between">
            <button 
              onClick={onBack}
              className="px-6 py-3 rounded-xl font-medium text-gray-600 hover:bg-gray-100 transition-colors"
            >
              上一步
            </button>
            <button 
              onClick={onNext}
              disabled={!selectedClothes}
              className={`px-8 py-3 rounded-xl font-bold text-white transition-all transform ${
                selectedClothes 
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-lg hover:-translate-y-1 active:scale-95' 
                  : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              下一步：开始试穿
            </button>
        </div>
      </div>
    </div>
  );
};

export default StepTwoClothes;
