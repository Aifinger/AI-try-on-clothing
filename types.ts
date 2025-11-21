export interface ImageAsset {
  id: string;
  url: string;
  isUserUploaded?: boolean;
  isGenerated?: boolean;
}

export interface HistoryItem {
  id: string;
  personImage: string;
  clothesImage: string;
  resultImage: string;
  timestamp: number;
}

export enum AppStep {
  SELECT_PERSON = 1,
  SELECT_CLOTHES = 2,
  GENERATE_RESULT = 3,
}

export type LoadingState = 'idle' | 'generating_clothes' | 'generating_tryon' | 'error';
