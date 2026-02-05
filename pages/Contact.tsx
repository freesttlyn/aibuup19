
import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { FORMSPREE_URL } from '../constants';
import { supabase } from '../lib/supabase';
import { UserContext } from '../App';

const Contact: React.FC = () => {
  const { profile } = useContext(UserContext);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const { error: sbError } = await supabase.from('contacts').insert([formData]);
      if (sbError) console.error('Supabase save error:', sbError);

      const response = await fetch(FORMSPREE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setSubmitted(true);
        setFormData({ name: '', email: '', message: '' });
      } else {
        setError('전송 실패. 커뮤니티 게시판을 이용해 주세요.');
      }
    } catch (err) {
      setError('네트워크 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="pt-32 pb-32 min-h-screen bg-black">
      <div className="max-w-2xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-emerald-500 font-bold uppercase text-sm tracking-widest mb-2 block">Connect</span>
          <h1 className="text-5xl font-bold tracking-tighter mb-6">Contact Us</h1>
          <p className="text-gray-400 text-lg">
            Ai BuUp과 함께 성장하고 싶거나 궁금한 점이 있다면 언제든 연락주세요.
          </p>
        </div>

        <div className="bg-neutral-900 border border-white/10 p-10 rounded-[3rem] shadow-2xl relative overflow-hidden mb-12">
          <div className="absolute top-0 right-0 size-64 bg-emerald-500/10 blur-[100px] pointer-events-none" />
          
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Name</label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                  className="w-full bg-black/50 border border-white/10 rounded-2xl px-6 py-4 focus:border-emerald-500/50 outline-none transition-all disabled:opacity-50 text-white"
                  placeholder="성함을 입력해주세요"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Email Address</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                  className="w-full bg-black/50 border border-white/10 rounded-2xl px-6 py-4 focus:border-emerald-500/50 outline-none transition-all disabled:opacity-50 text-white"
                  placeholder="답변받으실 이메일"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Message</label>
                <textarea 
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  required
                  disabled={isSubmitting}
                  className="w-full bg-black/50 border border-white/10 rounded-2xl px-6 py-4 focus:border-emerald-500/50 outline-none transition-all disabled:opacity-50 text-white resize-none"
                  placeholder="문의 내용을 상세히 적어주세요"
                />
              </div>

              {error && (
                <div className="text-red-500 text-sm font-medium bg-red-500/10 p-4 rounded-xl border border-red-500/20">
                  {error}
                </div>
              )}

              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-4 rounded-full shadow-lg shadow-emerald-500/20 transition-all transform active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? '전송 중...' : '메시지 보내기'}
              </button>
            </form>
          ) : (
            <div className="text-center py-10 relative z-10">
              <div className="size-20 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6">✓</div>
              <h3 className="text-2xl font-bold mb-4">성공적으로 전송되었습니다!</h3>
              <p className="text-gray-400 mb-8">내용을 확인 후 최대한 빠르게 답변 드리겠습니다.</p>
              <button onClick={() => setSubmitted(false)} className="text-emerald-400 hover:text-white font-bold">새로운 문의 작성하기</button>
            </div>
          )}
        </div>

        <div className="flex flex-col items-center gap-6">
          <Link 
            to="/community"
            className="group bg-neutral-900 border border-white/10 px-12 py-6 rounded-full inline-flex items-center gap-4 hover:bg-emerald-500 hover:text-black transition-all w-full justify-center"
          >
            <span className="font-black text-xl">커뮤니티 이동</span>
          </Link>
          
          {profile?.role === 'ADMIN' && (
            <Link 
              to="/admin"
              className="text-gray-600 hover:text-emerald-500 transition-colors text-xs font-bold tracking-widest uppercase border-b border-transparent hover:border-emerald-500/30 pb-1"
            >
              Admin Dashboard
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contact;
