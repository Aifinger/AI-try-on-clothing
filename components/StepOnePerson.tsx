import React, { useRef } from 'react';
import { ImageAsset } from '../types';
import { PRESET_FACES } from '../constants';
import { Upload, Check } from 'lucide-react';

interface StepOneProps {
  selectedPerson: ImageAsset | null;
  onSelect: (person: ImageAsset) => void;
  onNext: () => void;
}

const StepOnePerson: React.FC<StepOneProps> = ({ selectedPerson, onSelect, onNext }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        onSelect({
          id: `user-${Date.now()}`,
          url: result,
          isUserUploaded: true
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col h-full space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">1. 选择或上传模特</h2>
      </div>

      {/* Presets Grid */}
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {/* Upload Button */}
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="aspect-[3/4] rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-purple-500 hover:bg-purple-50 transition-colors group"
        >
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-purple-200 transition-colors">
            <Upload className="text-gray-500 group-hover:text-purple-600" size={24} />
          </div>
          <span className="mt-2 text-sm font-medium text-gray-600">上传照片</span>
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*" 
            onChange={handleFileUpload} 
          />
        </div>

        {/* User Uploaded (if strictly selected via file but not in preset list logic for simplicity) */}
        {selectedPerson?.isUserUploaded && (
          <div className="relative aspect-[3/4] rounded-xl overflow-hidden ring-4 ring-purple-500 shadow-lg">
             <img src={selectedPerson.url} alt="User" className="w-full h-full object-cover" />
             <div className="absolute top-2 right-2 bg-purple-600 rounded-full p-1">
               <Check size={12} className="text-white" />
             </div>
          </div>
        )}

        {/* Presets */}
        {PRESET_FACES.map((face) => (
          <div 
            key={face.id}
            onClick={() => onSelect(face)}
            className={`relative aspect-[3/4] rounded-xl overflow-hidden cursor-pointer transition-all duration-200 ${
              selectedPerson?.id === face.id 
                ? 'ring-4 ring-purple-500 scale-95 shadow-lg' 
                : 'hover:shadow-md hover:scale-105'
            }`}
          >
            <img src={face.url} alt="Preset Face" className="w-full h-full object-cover" />
            {selectedPerson?.id === face.id && (
              <div className="absolute top-2 right-2 bg-purple-600 rounded-full p-1">
                <Check size={12} className="text-white" />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex-1" /> {/* Spacer */}

      {/* Action Bar */}
      <div className="sticky bottom-4 w-full bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-gray-100 flex justify-end">
        <button 
          onClick={onNext}
          disabled={!selectedPerson}
          className={`px-8 py-3 rounded-xl font-bold text-white transition-all transform ${
            selectedPerson 
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-lg hover:-translate-y-1 active:scale-95' 
              : 'bg-gray-300 cursor-not-allowed'
          }`}
        >
          下一步：选择服饰
        </button>
      </div>
    </div>
  );
};

export default StepOnePerson;
