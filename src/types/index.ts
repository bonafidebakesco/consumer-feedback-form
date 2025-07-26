// Comprehensive TypeScript types for the Consumer Feedback Form application

// Quiz and Form Types
export interface QuizChoice {
  value: string;
  text: string;
}

export interface QuizElement {
  type: 'checkbox' | 'rating' | 'dropdown' | 'tagbox' | 'text' | 'comment';
  name: string;
  title: string;
  isRequired?: boolean;
  choices?: QuizChoice[];
  rateValues?: QuizChoice[];
  inputType?: string;
  placeholder?: string;
  showSelectAllItem?: boolean;
  selectAllText?: string;
  showNoneItem?: boolean;
  noneText?: string;
  searchEnabled?: boolean;
  hideSelectedItems?: boolean;
}

export interface QuizQuestion {
  id: string;
  type: 'checkbox' | 'rating' | 'dropdown' | 'tagbox' | 'text' | 'comment';
  title: string;
  description?: string;
  isRequired?: boolean;
  choices?: string[];
  minRating?: number;
  maxRating?: number;
}

export interface QuizPage {
  id: string;
  title: string;
  description?: string;
  questions: QuizQuestion[];
}

export interface QuizData {
  title: string;
  pages: QuizPage[];
}

export interface UserResponse {
  questionId: string;
  value: string | string[] | number;
  timestamp: Date;
}

export type FormData = {
  [key: string]: string | string[] | number;
};
// Supabase Database Types
export interface QuizSubmission {
  id?: string;
  quiz_title: string;
  user_responses: Record<string, string | string[] | number>;
  total_pages: number;
  completed_pages: number;
  submission_status: 'completed' | 'partial' | 'abandoned';
  created_at?: string;
  updated_at?: string;
  metadata?: {
    user_agent?: string;
    timestamp: string;
    session_id?: string;
  };
}

export interface QuizResponse {
  success: boolean;
  data?: QuizSubmission;
  error?: string;
}

export interface QuizSubmissionsResponse {
  success: boolean;
  data?: QuizSubmission[];
  error?: string;
}

// Analytics Types
export interface AnalyticsData {
  totalSubmissions: number;
  completionRate: number;
  averageCompletionTime: number;
  questionAnalysis: Record<string, QuestionAnalysis>;
  responseTrends: ResponseTrend[];
  topResponses: Record<string, TopResponse[]>;
}

export interface QuestionAnalysis {
  total: number;
  responses: Record<string, number>;
  averageRating?: number;
  completionRate: number;
  type?: string;
}

export interface ResponseTrend {
  date: string;
  count: number;
}

export interface TopResponse {
  response: string;
  count: number;
  percentage: number;
}

// Business Analytics Types
export interface BusinessInsight {
  category: string;
  insight: string;
  impact: 'high' | 'medium' | 'low';
  recommendation: string;
  confidence: number;
  dataPoints: number;
}

export interface ProductInsight {
  productName: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  satisfaction: number;
  painPoints: string[];
  opportunities: string[];
  competitiveAdvantage: string[];
  pricingFeedback: string[];
  featureRequests: string[];
}

export interface CustomerSegment {
  segment: string;
  characteristics: string[];
  preferences: string[];
  painPoints: string[];
  opportunities: string[];
  size: number;
}

export interface SalesOpportunity {
  type: 'upsell' | 'cross-sell' | 'retention' | 'acquisition';
  description: string;
  potentialRevenue: 'high' | 'medium' | 'low';
  effort: 'high' | 'medium' | 'low';
  timeframe: 'immediate' | 'short-term' | 'long-term';
  targetSegment: string;
}

// Chart Data Types
export interface ChartData {
  completionRate: CompletionRateData[];
  questionResponses: QuestionResponseData[];
  responseTypes: ResponseTypeData[];
  timeAnalysis: TimeAnalysisData[];
  satisfaction: SatisfactionData[];
  responseTrends: ResponseTrendData[];
  questionTypes: QuestionTypeData[];
}

export interface CompletionRateData {
  date: string;
  rate: number;
}

export interface QuestionResponseData {
  question: string;
  responses: number;
}

export interface ResponseTypeData {
  type: string;
  value: number;
}

export interface TimeAnalysisData {
  period: string;
  submissions: number;
  averageTime: number;
}

export interface SatisfactionData {
  rating: number;
  count: number;
}

export interface ResponseTrendData {
  date: string;
  submissions: number;
}

export interface QuestionTypeData {
  type: string;
  count: number;
}

// Validation Types
export interface ValidationResult {
  isValid: boolean;
  message?: string;
}

// Component Props Types
export interface ChartProps {
  data: unknown[];
  title?: string;
}

export interface BusinessInsightsProps {
  businessInsights: BusinessInsight[];
  productInsights: ProductInsight[];
  salesOpportunities: SalesOpportunity[];
}

// Authentication Types
export interface AuthState {
  isLoggedIn: boolean;
  user?: {
    id: string;
    email: string;
  };
}

// Error Types
export interface AppError {
  message: string;
  code?: string;
  details?: unknown;
} 