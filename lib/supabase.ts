
import { createClient } from 'https://esm.sh/@supabase/supabase-js@^2.45.0';

// 우선순위: localStorage > process.env (Netlify)
const getEnv = (key: string) => {
  return localStorage.getItem(key) || (typeof process !== 'undefined' ? process.env[key] : '') || '';
};

const supabaseUrl = getEnv('VITE_SUPABASE_URL');
const supabaseAnonKey = getEnv('VITE_SUPABASE_ANON_KEY');

export const isConfigured = 
  supabaseUrl && 
  supabaseUrl.startsWith('https://') && 
  supabaseAnonKey && 
  supabaseAnonKey.length > 20;

export const isDemoMode = !isConfigured;

// 실제 연동 여부에 따라 클라이언트 생성
export const supabase = createClient(
  isConfigured ? supabaseUrl : 'https://placeholder-project.supabase.co',
  isConfigured ? supabaseAnonKey : 'placeholder-key'
);

// 실시간으로 API_KEY를 가져오는 헬퍼 (Gemini용)
export const getAiKey = () => getEnv('API_KEY');
