
import React, { useState, useEffect, useMemo, useContext } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { BOARD_CATEGORIES, VIP_CATEGORIES } from '../constants';
import { CommunityPost } from '../types';
import { supabase, isDemoMode } from '../lib/supabase';
import { UserContext } from '../App';

const MOCK_POSTS: CommunityPost[] = [
  { 
    id: 'demo-1', 
    title: '유튜브 쇼츠 AI 자동화 3개월 차 수익 인증 (월 180만원)', 
    author: 'AI마스터', 
    category: '수익인증', 
    created_at: new Date().toISOString(), 
    result: '월 180만원 달성', 
    // Fix: Changed dailyTime to daily_time to match CommunityPost interface
    daily_time: '1.5시간', 
    tool: 'Midjourney + ElevenLabs',
    content: '### 📊 실전 수익 리포트\n\n지난 3개월간 AI 툴들을 조합하여 쇼츠 채널 3개를 운영한 결과입니다. \n\n**1. 사용된 워크플로우:**\n- 주제 선정: ChatGPT-4o 브레인스토밍\n- 이미지: Midjourney v6.1 (특정 스타일 프롬프트 유지)\n- 음성: ElevenLabs (자연스러운 한국어 남성 목소리)\n- 편집: CapCut 자동 자막 및 화면 전환\n\n**2. 수익 결과:**\n- 애드센스: 120만원\n- 제휴 마케팅: 60만원\n\n단순히 영상을 뽑는 게 아니라 시청 지속 시간을 늘리는 AI 편집 노하우가 핵심입니다.' 
  },
  { 
    id: 'demo-2', 
    title: '강남역 OOO AI 부업 강의 330만원 사기 피해 고발', 
    author: '정의의사도', 
    category: '강팔이피해사례', 
    created_at: new Date(Date.now() - 86400000).toISOString(), 
    result: '전형적인 강팔이', 
    // Fix: Changed dailyTime to daily_time to match CommunityPost interface
    daily_time: '0분 (수익없음)', 
    cost: '330만원',
    content: '### ⚠️ 피해 주의보\n\n수익 100% 보장이라는 말에 속아 330만원 고액 강의를 결제했습니다. \n\n**피해 사실 요약:**\n1. 유튜브에 무료로 풀린 챗GPT 기본 프롬프트만 재구성해서 알려줌.\n2. 수익이 안 난다고 하자 본인의 노력이 부족하다며 가스라이팅 시전.\n3. 핵심이라던 전용 프로그램은 사실상 작동하지 않는 조잡한 수준.\n\n고액 결제를 유도하는 강의는 반드시 의심하세요. 제가 잃은 돈이 다른 분들의 방패가 되길 바랍니다.' 
  },
  { 
    id: 'demo-3', 
    title: '[고수] 미드저니 6.1 실전 인테리어 사진 판매 노하우', 
    author: '고수X', 
    category: '검증된부업분석-투자시간/비용체계적정리', 
    created_at: new Date(Date.now() - 172800000).toISOString(), 
    result: '스톡 사이트 통과', 
    // Fix: Changed dailyTime to daily_time to match CommunityPost interface
    daily_time: '상시', 
    content: '### 🔒 VIP Intelligence Report\n\n미드저니 6.1에서 생성한 이미지를 상업적으로 활용하기 위해 반드시 거쳐야 하는 스톡 사이트(Adobe Stock, Shutterstock) 승인 가이드입니다. \n\n**핵심 전략:**\n- 업스케일링: Topaz Photo AI를 활용한 디테일 보정\n- 메타데이터: AI가 생성한 이미지임을 표기하면서도 노출 빈도를 높이는 태깅 전략\n- 저작권: 미드저니 유료 플랜을 통한 저작권 확보 증빙 방식' 
  }
];

const Community: React.FC = () => {
  const { profile, user } = useContext(UserContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTopButton, setShowTopButton] = useState(false);
  const currentCategory = searchParams.get('cat') || '전체';
  
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;

  useEffect(() => {
    fetchPosts();
    const handleScroll = () => setShowTopButton(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    const localPosts = JSON.parse(localStorage.getItem('demo_posts') || '[]');

    if (isDemoMode) {
      setTimeout(() => {
        setPosts([...localPosts, ...MOCK_POSTS]);
        setLoading(false);
      }, 500);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts([...localPosts, ...(data || [])]);
    } catch (error) {
      setPosts([...localPosts, ...MOCK_POSTS]);
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = useMemo(() => {
    let result = posts;
    if (currentCategory === '전체') {
      const vipNames = VIP_CATEGORIES.map(v => v.name);
      result = posts.filter(p => !vipNames.includes(p.category));
    } else {
      result = posts.filter(p => p.category === currentCategory as any);
    }
    return result;
  }, [currentCategory, posts]);

  const currentPagedPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * postsPerPage;
    return filteredPosts.slice(startIndex, startIndex + postsPerPage);
  }, [filteredPosts, currentPage]);

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  const handleCategorySelect = (catName: string, isVip: boolean) => {
    if (isVip && (!profile || (profile.role !== 'GOLD' && profile.role !== 'ADMIN'))) {
      alert('고수의 방은 GOLD 등급 이상만 입장 가능합니다.');
      return;
    }
    setSearchParams({ cat: catName });
    setCurrentPage(1);
  };

  const getCategoryColor = (category: string) => {
    const vipNames = VIP_CATEGORIES.map(v => v.name);
    if (vipNames.includes(category)) return 'bg-yellow-500 text-black';
    switch (category) {
      case '강팔이피해사례': return 'bg-red-500 text-black';
      case 'Ai부업경험담': return 'bg-amber-500 text-black';
      case '미래비전공유': return 'bg-blue-500 text-white';
      case '검증요청게시판': return 'bg-emerald-500 text-black';
      case '수익인증': return 'bg-green-500 text-black';
      case '협업및신사업제안': return 'bg-cyan-500 text-black';
      default: return 'bg-white/10 text-gray-400';
    }
  };

  const handleDirectWriteClick = () => {
    if (!user && !isDemoMode) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }
    navigate('/community/direct-write');
  };

  return (
    <div className="pt-28 md:pt-36 pb-32 min-h-screen bg-black relative">
      <div className="max-w-7xl mx-auto px-6">
        <header className="mb-16 text-center flex flex-col items-center">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic">Community</h1>
          <p className="text-gray-400 mt-6 max-w-2xl text-xl font-light">
            실시간으로 공유되는 <span className="text-emerald-400 font-bold">진짜 데이터</span>.
          </p>
        </header>

        {/* 고수의 방 섹션 */}
        <div className="max-w-5xl mx-auto mb-10 p-10 bg-yellow-500/5 border border-yellow-500/20 rounded-[3rem] relative overflow-hidden shadow-[0_0_50px_rgba(234,179,8,0.05)]">
          <div className="absolute top-0 right-0 size-64 bg-yellow-500/10 blur-[100px] -mr-32 -mt-32 pointer-events-none" />
          <div className="flex flex-col items-center mb-10 text-center relative z-10">
            <h2 className="text-yellow-500 text-3xl font-black tracking-[0.3em] uppercase mb-2 flex items-center gap-4">
              <span className="text-xl">🔒</span> 고수의방
            </h2>
          </div>
          <div className="flex flex-wrap justify-center gap-3 relative z-10">
            {VIP_CATEGORIES.map(cat => (
              <button 
                key={cat.id} 
                onClick={() => handleCategorySelect(cat.name, true)}
                className={`px-8 py-4 rounded-2xl border transition-all text-xs font-black tracking-tight ${
                  currentCategory === cat.name 
                    ? 'bg-yellow-500 text-black border-yellow-500 shadow-xl shadow-yellow-500/20' 
                    : 'border-yellow-500/20 text-yellow-500/50 hover:text-yellow-500 hover:border-yellow-500 bg-black/40'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* 글쓰기 통합 섹션 */}
        <div className="max-w-5xl mx-auto mb-20 space-y-6">
          {/* AI 글쓰기 배너 */}
          <div className="relative group overflow-hidden rounded-[2.5rem] bg-neutral-900 border border-emerald-500/20 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 transition-all hover:border-emerald-500/50">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10 text-center md:text-left">
              <span className="inline-block px-3 py-1 bg-emerald-500 text-black text-[9px] font-black rounded-full uppercase tracking-widest mb-4">AI Chat Assistant</span>
              <h3 className="text-2xl md:text-3xl font-black mb-2 tracking-tight">모든 부업 데이터, <span className="text-emerald-400">AI와 대화하며</span> 기록하세요.</h3>
              <p className="text-gray-500 text-sm font-medium italic">번거로운 폼 입력 대신 AI 질문에 답하기만 하면 리포트가 완성됩니다.</p>
            </div>
            <button 
              onClick={() => navigate('/community/write')}
              className="relative z-10 bg-emerald-500 text-black px-12 py-5 rounded-2xl font-black text-xl hover:scale-105 transition-all shadow-[0_0_30px_rgba(16,185,129,0.3)] flex items-center gap-4 group/btn"
            >
              AI 글쓰기 시작 
              <span className="group-hover/btn:translate-x-2 transition-transform">→</span>
            </button>
          </div>

          {/* 직접 글쓰기 버튼 (왼쪽 배치) */}
          <div className="flex justify-start px-2">
            <button 
              onClick={handleDirectWriteClick}
              className="flex items-center gap-4 bg-black border border-emerald-500/30 text-emerald-500 px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-emerald-500 hover:text-black transition-all group shadow-xl"
            >
              <span className="text-xl">✍️</span>
              직접 글쓰기
              <span className="opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all">→</span>
            </button>
          </div>
        </div>

        {/* 일반 게시판 섹션 */}
        <div className="max-w-5xl mx-auto mb-16 text-center">
          <h2 className="text-emerald-500/40 font-black text-[10px] uppercase tracking-[0.6em] mb-8">모험가 게시판</h2>
          <div className="flex flex-wrap justify-center gap-2 md:gap-3">
            {BOARD_CATEGORIES.map(cat => (
              <button 
                key={cat.id} 
                onClick={() => handleCategorySelect(cat.name, false)}
                className={`px-6 py-3.5 rounded-xl border transition-all text-[11px] md:text-xs font-black tracking-tight ${
                  currentCategory === cat.name || (currentCategory === '전체' && cat.id === 'all')
                    ? 'bg-emerald-500 text-black border-emerald-500 shadow-lg shadow-emerald-500/20' 
                    : 'border-white/10 text-gray-500 hover:text-white hover:border-white/30 bg-neutral-900/50'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="py-20 text-center">
            <div className="size-8 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mb-4 mx-auto" />
            <p className="text-gray-500 font-bold tracking-widest text-xs uppercase">Analyzing Archives...</p>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto" id="community-list">
            <div className="grid grid-cols-1 gap-6 mb-12">
              {currentPagedPosts.length > 0 ? currentPagedPosts.map((post) => (
                <Link 
                  key={post.id} 
                  to={`/community/${post.id}`}
                  className="group p-8 md:p-10 bg-neutral-900/40 border border-white/5 rounded-[2.5rem] md:rounded-[3rem] transition-all glow-border"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3 mb-6">
                        <span className={`text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest ${getCategoryColor(post.category)}`}>
                          {post.category}
                        </span>
                        <span className="text-gray-600 text-[10px] font-bold">
                          {post.author} • {post.created_at ? new Date(post.created_at).toLocaleDateString() : '날짜 미상'}
                        </span>
                      </div>
                      <h3 className="text-2xl md:text-3xl font-black mb-4 group-hover:text-emerald-400 transition-colors">{post.title}</h3>
                      <div className="flex flex-wrap gap-4 items-center">
                        {post.result && (
                          <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-black/50 rounded-2xl border border-white/5">
                            <span className="text-gray-600 text-[9px] uppercase font-bold tracking-widest">Impact</span>
                            <span className="text-emerald-400 font-black text-sm">{post.result}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl text-gray-400 text-[10px] font-bold">
                          <span>💎</span> {post.likes || 0}
                        </div>
                      </div>
                    </div>
                    <div className="shrink-0">
                      <div className="group-hover:bg-emerald-500 group-hover:text-black text-gray-500 border border-white/10 px-8 py-3 rounded-full font-black text-xs transition-all">
                        View Report
                      </div>
                    </div>
                  </div>
                </Link>
              )) : (
                <div className="py-24 text-center border border-dashed border-white/10 rounded-[3rem]">
                  <p className="text-gray-500 font-black uppercase text-xs tracking-widest">No entries found in this archive.</p>
                </div>
              )}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mb-16">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`size-10 md:size-12 rounded-xl font-black text-sm transition-all border ${
                      currentPage === pageNum 
                        ? 'bg-emerald-500 border-emerald-500 text-black shadow-lg shadow-emerald-500/20' 
                        : 'border-white/5 text-gray-500 hover:text-white hover:border-white/20 hover:bg-white/5'
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`fixed bottom-8 right-8 z-[60] size-14 md:size-16 bg-neutral-900/80 backdrop-blur-xl border border-white/10 rounded-full flex items-center justify-center transition-all duration-500 shadow-2xl hover:scale-110 hover:border-emerald-500 group ${
          showTopButton ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'
        }`}
      >
        <svg className="size-6 md:size-8 text-emerald-500 group-hover:-translate-y-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
        </svg>
      </button>
    </div>
  );
};

export default Community;
