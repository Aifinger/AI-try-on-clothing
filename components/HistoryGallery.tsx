import React from 'react';
import { HistoryItem } from '../types';
import { Clock } from 'lucide-react';

interface HistoryGalleryProps {
  history: HistoryItem[];
  onSelectHistory: (item: HistoryItem) => void;
}

const HistoryGallery: React.FC<HistoryGalleryProps> = ({ history, onSelectHistory }) => {
  if (history.length === 0) return null;

  return (
    <div className="mt-12 border-t border-gray-200 pt-6">
      <div className="flex items-center mb-4 text-gray-500">
        <Clock size={16} className="mr-2" />
        <h3 className="font-semibold text-sm uppercase tracking-wider">历史记录</h3>
      </div>
      <div className="flex space-x-4 overflow-x-auto no-scrollbar pb-4">
        {history.map((item) => (
          <div 
            key={item.id} 
            onClick={() => onSelectHistory(item)}
            className="flex-shrink-0 w-24 h-32 rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity border border-gray-200 shadow-sm relative group"
          >
            <img src={item.resultImage} alt="History" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
               <span className="text-white text-xs">查看</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryGallery;
