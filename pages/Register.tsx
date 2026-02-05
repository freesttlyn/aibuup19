
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase, isConfigured, isDemoMode } from '../lib/supabase';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }
    if (nickname.length < 2) {
      setError('닉네임은 2자 이상이어야 합니다.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setMessage(null);

    // 데모 모드일 경우 (환경 변수 미설정 시)
    if (isDemoMode) {
      setTimeout(() => {
        const demoUser = {
          id: 'demo-user-id-' + Date.now(),
          email,
          nickname,
          role: email === 'exp.gwonyoung.woo@gmail.com' ? 'ADMIN' : 'SILVER'
        };
        localStorage.setItem('demo_user', JSON.stringify(demoUser));
        setIsLoading(false);
        navigate('/community');
      }, 1000);
      return;
    }

    // 실제 수퍼베이스 연동 모드
    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            nickname: nickname,
          },
        },
      });

      if (authError) throw authError;

      if (data.user) {
        if (data.session) {
          navigate('/community');
        } else {
          setMessage('인증 이메일이 발송되었습니다. 이메일함(또는 스팸함)을 확인해주세요!');
        }
      }
    } catch (err: any) {
      setError(err.message || '회원가입 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[600px] bg-emerald-500/5 blur-[150px] rounded-full pointer-events-none" />
      
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-12">
          <Link to="/" className="text-4xl font-black tracking-tighter text-white mb-6 inline-block">
            Ai BuUp
          </Link>
          <h1 className="text-2xl font-bold text-gray-200">새로운 여정의 시작</h1>
          <p className="text-gray-500 mt-2">Ai BuUp 커뮤니티의 일원이 되어보세요.</p>
        </div>

        <div className="bg-neutral-900/50 backdrop-blur-3xl border border-white/5 p-8 md:p-10 rounded-[2.5rem] shadow-2xl shadow-emerald-500/5">
          {message ? (
            <div className="text-center py-10">
              <div className="size-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">✓</div>
              <h3 className="text-xl font-bold text-white mb-4">가입 신청 완료</h3>
              <p className="text-gray-400 mb-8 leading-relaxed break-keep">{message}</p>
              <Link to="/login" className="bg-emerald-500 text-black px-8 py-3 rounded-xl font-bold hover:bg-white transition-all">
                로그인 하러가기
              </Link>
            </div>
          ) : (
            <form onSubmit={handleRegister} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Nickname</label>
                <input 
                  type="text" 
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  required
                  className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-emerald-500/50 transition-all text-white placeholder:text-gray-700"
                  placeholder="사용하실 닉네임"
                />
              </div>

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
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Password</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-emerald-500/50 transition-all text-white placeholder:text-gray-700"
                  placeholder="6자 이상 비밀번호"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Confirm Password</label>
                <input 
                  type="password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-emerald-500/50 transition-all text-white placeholder:text-gray-700"
                  placeholder="비밀번호 확인"
                />
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs py-3 px-4 rounded-xl font-medium animate-shake">
                  {error}
                </div>
              )}

              <button 
                type="submit"
                disabled={isLoading}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-black py-4 rounded-2xl transition-all shadow-xl shadow-emerald-500/20 transform active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
              >
                {isLoading ? (
                  <div className="size-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                ) : (
                  '회원가입 완료'
                )}
              </button>
            </form>
          )}

          {!message && (
            <div className="mt-10 pt-8 border-t border-white/5 text-center">
              <p className="text-gray-500 text-sm">
                이미 계정이 있으신가요?{' '}
                <Link to="/login" className="text-emerald-500 font-bold hover:underline transition-all underline-offset-4">
                  로그인 하기
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Register;
