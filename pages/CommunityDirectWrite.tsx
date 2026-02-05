
import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { BOARD_CATEGORIES, VIP_CATEGORIES } from '../constants';
import { supabase, isDemoMode, isConfigured } from '../lib/supabase';
import { UserContext } from '../App';
import { BoardCategoryType } from '../types';

const CommunityDirectWrite: React.FC = () => {
  const { user, profile } = useContext(UserContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    category: 'Ai부업경험담' as BoardCategoryType,
    tool: '',
    cost: '',
    dailyTime: '',
    result: '',
    content: ''
  });

  const isGold = profile?.role === 'GOLD' || profile?.role === 'ADMIN';

  useEffect(() => {
    if (!user && !isDemoMode) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    if (!formData.title.trim() || !formData.content.trim()) {
      alert('제목과 내용을 입력해주세요.');
      return;
    }

    const isVipCat = VIP_CATEGORIES.some(v => v.name === formData.category);
    if (isVipCat && !isGold) {
      alert('고수의 방 카테고리는 GOLD 등급 이상만 작성 가능합니다.');
      return;
    }

    setLoading(true);

    try {
      const postData = {
        title: formData.title,
        author: profile?.nickname || user?.email?.split('@')[0] || '익명',
        category: formData.category,
        content: formData.content,
        tool: formData.tool,
        cost: formData.cost,
        daily_time: formData.dailyTime, // snake_case 컬럼명 사용
        result: formData.result,
        user_id: user?.id,
        created_at: new Date().toISOString(),
        likes: 0
      };

      if (!isDemoMode && isConfigured && user) {
        const { error } = await supabase.from('posts').insert([postData]);
        
        if (error) {
          // 스키마 캐시 오류 발생 시 사용자에게 SQL 실행 안내
          if (error.message.includes('column') || error.message.includes('schema cache')) {
            throw new Error(
              "데이터베이스 구조가 업데이트되지 않았습니다.\n\n" +
              "수퍼베이스 SQL Editor에서 다음 명령을 실행해주세요:\n" +
              "ALTER TABLE posts ADD COLUMN IF NOT EXISTS daily_time text;"
            );
          }
          throw error;
        }
      } else {
        const demoPost = { ...postData, id: `post-${Date.now()}` };
        const existing = JSON.parse(localStorage.getItem('demo_posts') || '[]');
        localStorage.setItem('demo_posts', JSON.stringify([demoPost, ...existing]));
      }

      alert('리포트가 성공적으로 등록되었습니다.');
      navigate(`/community?cat=${formData.category}`);
    } catch (err: any) {
      console.error('Save error:', err);
      alert(err.message || '저장 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black pt-32 pb-32 px-6">
      <div className="max-w-4xl mx-auto">
        <header className="mb-12">
          <Link to="/community" className="text-gray-500 hover:text-emerald-500 transition-colors text-[10px] font-black uppercase tracking-widest mb-4 inline-block">← Back to Archives</Link>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic mb-4">Manual Archive</h1>
          <p className="text-gray-500 text-sm md:text-base font-light break-keep">AI의 도움 없이 모험가님의 지식을 직접 데이터베이스에 기록합니다.</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-8 animate-fadeIn">
          <div className="bg-neutral-900/50 border border-white/5 rounded-[2.5rem] p-8 md:p-12 shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest ml-1">Archive Title</label>
                <input 
                  type="text" required
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-emerald-500/50 transition-all text-white"
                  placeholder="리포트 제목을 입력하세요"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest ml-1">Archive Category</label>
                <select 
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value as BoardCategoryType})}
                  className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-emerald-500/50 transition-all text-white appearance-none"
                >
                  <optgroup label="일반 게시판" className="bg-neutral-900">
                    {BOARD_CATEGORIES.filter(c => c.id !== 'all').map(cat => (
                      <option key={cat.id} value={cat.name}>{cat.name}</option>
                    ))}
                  </optgroup>
                  <optgroup label="고수의 방 (GOLD+)" className="bg-neutral-900">
                    {VIP_CATEGORIES.map(cat => (
                      <option key={cat.id} value={cat.name} disabled={!isGold}>{cat.name} {!isGold && '(권한필요)'}</option>
                    ))}
                  </optgroup>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
              <div className="space-y-2">
                <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest ml-1">Tool Used</label>
                <input type="text" value={formData.tool} onChange={e => setFormData({...formData, tool: e.target.value})} className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-xs text-white focus:border-emerald-500/30 outline-none" placeholder="예: Midjourney" />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest ml-1">Investment</label>
                <input type="text" value={formData.cost} onChange={e => setFormData({...formData, cost: e.target.value})} className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-xs text-white focus:border-emerald-500/30 outline-none" placeholder="예: 월 3만원" />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest ml-1">Time (Daily)</label>
                <input type="text" value={formData.dailyTime} onChange={e => setFormData({...formData, dailyTime: e.target.value})} className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-xs text-white focus:border-emerald-500/30 outline-none" placeholder="예: 2시간" />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest ml-1">Final Verdict</label>
                <input type="text" value={formData.result} onChange={e => setFormData({...formData, result: e.target.value})} className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-xs text-white focus:border-emerald-500/30 outline-none" placeholder="예: 강력 추천" />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest ml-1">Detailed Intelligence (Markdown Support)</label>
              <textarea 
                required
                value={formData.content}
                onChange={e => setFormData({...formData, content: e.target.value})}
                className="w-full bg-black/40 border border-white/10 rounded-2xl px-8 py-6 outline-none focus:border-emerald-500/50 transition-all text-white h-[400px] resize-none leading-relaxed text-base"
                placeholder="# 제목을 입력하고 본문을 작성하세요.&#10;&#10;마크다운 문법을 지원합니다. (###, **, - 등)"
              />
            </div>
          </div>

          <div className="flex gap-4">
             <button 
               type="submit" 
               disabled={loading}
               className="flex-1 bg-emerald-500 text-black font-black py-5 rounded-2xl hover:bg-white transition-all uppercase text-sm tracking-[0.2em] shadow-2xl shadow-emerald-500/20 disabled:opacity-50"
             >
               {loading ? 'Archiving...' : 'Publish Intelligence Report'}
             </button>
             <button 
               type="button" 
               onClick={() => navigate('/community')}
               className="px-10 py-5 border border-white/10 text-gray-500 font-black rounded-2xl hover:text-white transition-all uppercase text-sm"
             >
               Cancel
             </button>
          </div>
        </form>
      </div>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.4s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default CommunityDirectWrite;
