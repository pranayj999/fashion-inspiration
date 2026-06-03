export interface LocationContext {
  continent: string;
  country: string;
  city: string;
}

export interface TimeContext {
  year: number;
  month: number;
  season: string;
}

export interface AiMetadata {
  description: string;
  garmentType: string;
  style: string;
  material: string;
  colorPalette: string[];
  pattern: string;
  season: string;
  occasion: string;
  consumerProfile: string;
  trendNotes: string;
  location: LocationContext;
}

export interface DesignerAnnotations {
  tags: string[];
  notes: string;
}

export interface ImageRecord {
  id: string;
  filename: string;
  designer: string;
  capturedAt: string;
  ai: AiMetadata;
  annotations: DesignerAnnotations;
  createdAt: string;
}

export interface FilterState {
  q?: string;
  garmentType?: string;
  style?: string;
  material?: string;
  colorPalette?: string;
  pattern?: string;
  occasion?: string;
  consumerProfile?: string;
  trendNotes?: string;
  continent?: string;
  country?: string;
  city?: string;
  year?: string;
  month?: string;
  season?: string;
  designer?: string;
}

export interface DynamicFilters {
  garmentType: string[];
  style: string[];
  material: string[];
  colorPalette: string[];
  pattern: string[];
  occasion: string[];
  consumerProfile: string[];
  trendNotes: string[];
  continent: string[];
  country: string[];
  city: string[];
  year: string[];
  month: string[];
  season: string[];
  designer: string[];
}

export interface ExpectedLabels {
  id: string;
  imageUrl: string;
  source: string;
  expected: {
    garmentType: string;
    style: string;
    material: string;
    occasion: string;
    location: LocationContext;
  };
}
