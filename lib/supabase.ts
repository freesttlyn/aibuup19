
import { createClient } from 'https://esm.sh/@supabase/supabase-js@^2.45.0';

// Supabase 환경 변수: localStorage(사용자 설정) > process.env (시스템)
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

// Gemini API용 키는 반드시 시스템 환경 변수에서만 가져옵니다. (UI 입력 금지)
export const getAiKey = () => (typeof process !== 'undefined' ? process.env.API_KEY : '') || '';
