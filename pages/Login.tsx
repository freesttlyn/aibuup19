
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase, isConfigured } from '../lib/supabase';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        throw authError;
      }

      if (data.user) {
        navigate('/community');
      }
    } catch (err: any) {
      // 에러 메시지 한글화 처리
      let errMsg = err.message;
      if (errMsg.includes('Email not confirmed')) {
        errMsg = '이메일 인증이 완료되지 않았습니다. 이메일함을 확인하시거나, 수퍼베이스 설정에서 이메일 인증(Confirm email)을 꺼주세요.';
      } else if (errMsg.includes('Invalid login credentials')) {
        errMsg = '이메일 또는 비밀번호가 잘못되었습니다.';
      } else if (errMsg.includes('Email not found')) {
        errMsg = '등록되지 않은 이메일입니다.';
      }
      
      setError(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6 relative overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[600px] bg-emerald-500/5 blur-[150px] rounded-full pointer-events-none" />
      
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-12">
          <Link to="/" className="text-4xl font-black tracking-tighter text-white mb-6 inline-block">
            Ai BuUp
          </Link>
          <h1 className="text-2xl font-bold text-gray-200">데이터로 증명하는 부업의 진실</h1>
          <p className="text-gray-500 mt-2">로그인하여 검증된 커뮤니티에 참여하세요.</p>
        </div>

        <div className="bg-neutral-900/50 backdrop-blur-3xl border border-white/5 p-8 md:p-10 rounded-[2.5rem] shadow-2xl shadow-emerald-500/5">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-emerald-500/50 transition-all text-white placeholder:text-gray-700"
                placeholder="example@email.com"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Password</label>
                <button type="button" className="text-[10px] text-gray-600 hover:text-emerald-400 transition-colors font-bold uppercase tracking-wider">Forgot?</button>
              </div>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-emerald-500/50 transition-all text-white placeholder:text-gray-700"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-[11px] py-4 px-5 rounded-2xl font-bold animate-shake leading-relaxed break-keep">
                <span className="flex items-start gap-2">
                  <span className="mt-0.5">⚠️</span>
                  {error}
                </span>
              </div>
            )}

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-black py-4 rounded-2xl transition-all shadow-xl shadow-emerald-500/20 transform active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="size-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
              ) : (
                '로그인'
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <p className="text-gray-500 text-sm">
              계정이 없으신가요?{' '}
              <Link to="/register" className="text-emerald-500 font-bold hover:underline transition-all underline-offset-4">
                회원가입 하기
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Link to="/" className="text-gray-600 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
