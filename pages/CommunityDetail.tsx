
import React, { useState, useEffect, useMemo, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { CommunityPost } from '../types';
import { supabase, isDemoMode, isConfigured } from '../lib/supabase';
import { UserContext } from '../App';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const MOCK_POSTS: CommunityPost[] = [
  { id: 'demo-1', title: '유튜브 쇼츠 AI 자동화 3개월 차 수익 인증 (월 180만원)', author: 'AI마스터', category: '수익인증', created_at: new Date().toISOString(), result: '월 180만원 달성', daily_time: '1.5시간', tool: 'Midjourney + ElevenLabs', content: '### 📊 실전 수익 리포트\n\n지난 3개월간 AI 툴들을 조합하여 쇼츠 채널 3개를 운영한 결과입니다. \n\n**1. 사용된 워크플로우:**\n- 주제 선정: ChatGPT-4o 브레인스토밍\n- 이미지: Midjourney v6.1 (특정 스타일 프롬프트 유지)\n- 음성: ElevenLabs (자연스러운 한국어 남성 목소리)\n- 편집: CapCut 자동 자막 및 화면 전환\n\n**2. 수익 결과:**\n- 애드센스: 120만원\n- 제휴 마케팅: 60만원\n\n단순히 영상을 뽑는 게 아니라 시청 지속 시간을 늘리는 AI 편집 노하우가 핵심입니다.' },
  { id: 'demo-2', title: '강남역 OOO AI 부업 강의 330만원 사기 피해 고발', author: '정의의사도', category: '강팔이피해사례', created_at: new Date(Date.now() - 86400000).toISOString(), result: '전형적인 강팔이', daily_time: '0분 (수익없음)', cost: '330만원', content: '### ⚠️ 피해 주의보\n\n수익 100% 보장이라는 말에 속아 330만원 고액 강의를 결제했습니다. \n\n**피해 사실 요약:**\n1. 유튜브에 무료로 풀린 챗GPT 기본 프롬프트만 재구성해서 알려줌.\n2. 수익이 안 난다고 하자 본인의 노력이 부족하다며 가스라이팅 시전.\n3. 핵심이라던 전용 프로그램은 사실상 작동하지 않는 조잡한 수준.\n\n고액 결제를 유도하는 강의는 반드시 의심하세요. 제가 잃은 돈이 다른 분들의 방패가 되길 바랍니다.' },
  { id: 'demo-3', title: '[고수] 미드저니 6.1 실전 인테리어 사진 판매 노하우', author: '고수X', category: '검증된부업분석-투자시간/비용체계적정리', created_at: new Date(Date.now() - 172800000).toISOString(), result: '스톡 사이트 통과', daily_time: '상시', content: '### 🔒 VIP Intelligence Report\n\n미드저니 6.1에서 생성한 이미지를 상업적으로 활용하기 위해 반드시 거쳐야 하는 스톡 사이트(Adobe Stock, Shutterstock) 승인 가이드입니다. \n\n**핵심 전략:**\n- 업스케일링: Topaz Photo AI를 활용한 디테일 보정\n- 메타데이터: AI가 생성한 이미지임을 표기하면서도 노출 빈도를 높이는 태깅 전략\n- 저작권: 미드저니 유료 플랜을 통한 저작권 확보 증빙 방식' }
];

interface Comment {
  id: string;
  author_name: string;
  role: string;
  text: string;
  created_at: string;
}

const CommunityDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, profile, refreshProfile } = useContext(UserContext);
  const [post, setPost] = useState<CommunityPost | any>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (id) {
      fetchPostAndComments();
    }
  }, [id]);

  const fetchPostAndComments = async () => {
    setLoading(true);
    
    if (isConfigured) {
      try {
        const { data: postData, error: postError } = await supabase
          .from('posts')
          .select('*')
          .eq('id', id)
          .single();

        if (!postError && postData) {
          setPost(postData);
          setLikeCount(postData.likes || 0);

          const { data: commentData } = await supabase
            .from('comments')
            .select('*')
            .eq('post_id', id)
            .order('created_at', { ascending: false });

          setComments(commentData || []);
          setLoading(false);
          return;
        }
      } catch (error) {
        console.warn('DB fetch failed, checking local data');
      }
    }

    const localPosts = JSON.parse(localStorage.getItem('demo_posts') || '[]');
    const localPost = localPosts.find((p: any) => p.id === id);
    if (localPost) {
      setPost(localPost);
      setLikeCount(localPost.likes || 0);
      setLoading(false);
      return;
    }

    const mockPost = MOCK_POSTS.find(p => p.id === id);
    if (mockPost) {
      setPost(mockPost);
      setLikeCount(mockPost.likes || 0);
    }
    
    setLoading(false);
  };

  const handleLike = async () => {
    if (!user || isLiked) return;
    try {
      const newCount = likeCount + 1;
      
      if (!isDemoMode) {
        const { error } = await supabase.from('posts').update({ likes: newCount }).eq('id', id);
        if (error) throw error;
      }
      
      setLikeCount(newCount);
      setIsLiked(true);
      if (post?.user_id === user?.id) refreshProfile();
    } catch (err) {
      console.error('좋아요 실패:', err);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    if (!user && !isDemoMode) {
      alert('로그인이 필요합니다.');
      return;
    }

    try {
      const authorName = profile?.nickname || user?.email?.split('@')[0] || '익명의모험가';
      const authorRole = profile?.role || 'SILVER';

      if (!isDemoMode && user) {
        const { data, error } = await supabase.from('comments').insert({
          post_id: id,
          user_id: user.id,
          author_name: authorName,
          role: authorRole,
          text: newComment
        }).select().single();

        if (error) throw error;
        setComments([data, ...comments]);
      } else {
        const demoComment: Comment = {
          id: `comment-${Date.now()}`,
          author_name: authorName,
          role: authorRole,
          text: newComment,
          created_at: new Date().toISOString()
        };
        setComments([demoComment, ...comments]);
      }
      setNewComment('');
    } catch (err) {
      console.error('댓글 작성 실패:', err);
      alert('댓글 작성 중 오류가 발생했습니다.');
    }
  };

  const handleDeletePost = async () => {
    if (!window.confirm('정말로 이 리포트를 폐기하시겠습니까?')) return;
    setIsDeleting(true);
    
    try {
      if (!isDemoMode) {
        const { error } = await supabase.from('posts').delete().eq('id', id);
        if (error) throw error;
      } else {
        const localPosts = JSON.parse(localStorage.getItem('demo_posts') || '[]');
        const filtered = localPosts.filter((p: any) => p.id !== id);
        localStorage.setItem('demo_posts', JSON.stringify(filtered));
      }
      navigate('/community');
    } catch (err) {
      alert('삭제 실패');
      setIsDeleting(false);
    }
  };

  if (loading) return (
    <div className="pt-48 pb-32 min-h-screen bg-black flex items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        <div className="size-16 border-4 border-emerald-500/10 border-t-emerald-500 rounded-full animate-spin" />
        <p className="text-emerald-500 font-black tracking-[0.4em] text-[10px] uppercase animate-pulse">Scanning Intelligence Data</p>
      </div>
    </div>
  );

  if (!post) return (
    <div className="pt-48 text-center min-h-screen bg-black px-6">
      <h2 className="text-4xl font-black mb-8 tracking-tighter">SIGNAL LOST</h2>
      <p className="text-gray-500 mb-12 max-w-md mx-auto">요청하신 데이터 리포트를 찾을 수 없습니다.</p>
      <Link to="/community" className="bg-emerald-500 text-black px-12 py-5 rounded-2xl font-black uppercase text-sm inline-block shadow-2xl shadow-emerald-500/20">Back to Archives</Link>
    </div>
  );

  const isScam = post.category === '강팔이피해사례';
  const isVip = post.category.includes('검증된부업분석') || post.category.includes('회원노하우');
  const themeColor = isScam ? 'red' : isVip ? 'yellow' : 'emerald';

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'text-red-500 border-red-500/30 bg-red-500/10';
      case 'GOLD': return 'text-yellow-500 border-yellow-500/30 bg-yellow-500/10';
      default: return 'text-gray-400 border-white/10 bg-white/5';
    }
  };

  return (
    <div className="pt-24 md:pt-32 pb-32 min-h-screen bg-[#050505]">
      <div className="max-w-5xl mx-auto px-6">
        
        <div className="flex items-center justify-between mb-12">
          <Link to={`/community?cat=${post.category}`} className="group flex items-center gap-4 text-gray-500 hover:text-white transition-all">
            <div className="size-10 bg-white/5 rounded-2xl flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-black transition-all">
              <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
            </div>
            <span className="text-[11px] font-black uppercase tracking-[0.2em]">{post.category} 목록</span>
          </Link>
          
          {(user?.id === post.user_id || isDemoMode) && (
            <button onClick={handleDeletePost} disabled={isDeleting} className="text-red-500/50 hover:text-red-500 text-[10px] font-black uppercase tracking-widest transition-colors">
              {isDeleting ? 'DELETING...' : 'DISCARD REPORT'}
            </button>
          )}
        </div>

        <article className={`relative bg-neutral-900/40 border ${
          themeColor === 'red' ? 'border-red-500/20 shadow-[0_0_50px_rgba(239,68,68,0.05)]' :
          themeColor === 'yellow' ? 'border-yellow-500/20 shadow-[0_0_50px_rgba(234,179,8,0.05)]' :
          'border-emerald-500/20 shadow-[0_0_50px_rgba(16,185,129,0.05)]'
        } rounded-[3rem] md:rounded-[4rem] overflow-hidden mb-16 animate-slideUp`}>
          
          <div className="p-8 md:p-16 border-b border-white/5 bg-gradient-to-b from-white/[0.02] to-transparent">
            <div className="flex flex-wrap items-center gap-4 mb-10">
              <div className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl ${
                themeColor === 'red' ? 'bg-red-500 text-black' :
                themeColor === 'yellow' ? 'bg-yellow-500 text-black' : 'bg-emerald-500 text-black'
              }`}>
                {post.category}
              </div>
              <span className="text-gray-600 text-[11px] font-bold uppercase tracking-widest">
                ID: #{post.id.toString().split('-')[0].toUpperCase()} / {new Date(post.created_at).toLocaleDateString()}
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-[1.1] mb-12 break-keep">
              {post.title}
            </h1>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-black/40 border border-white/5 p-6 rounded-3xl">
                <p className="text-gray-600 text-[9px] uppercase font-black tracking-widest mb-2">Auditor</p>
                <p className="text-white font-bold text-sm truncate">{post.author}</p>
              </div>
              <div className="bg-black/40 border border-white/5 p-6 rounded-3xl">
                <p className="text-gray-600 text-[9px] uppercase font-black tracking-widest mb-2">Tool Used</p>
                <p className="text-emerald-500 font-bold text-sm truncate">{post.tool || '전용 툴'}</p>
              </div>
              <div className="bg-black/40 border border-white/5 p-6 rounded-3xl">
                <p className="text-gray-600 text-[9px] uppercase font-black tracking-widest mb-2">Investment</p>
                <p className="text-white font-bold text-sm">{post.cost || post.daily_time || 'N/A'}</p>
              </div>
              <div className="bg-black/40 border border-white/5 p-6 rounded-3xl">
                <p className="text-gray-600 text-[9px] uppercase font-black tracking-widest mb-2">Verdict</p>
                <p className={`${themeColor === 'red' ? 'text-red-500' : 'text-emerald-400'} font-bold text-sm`}>
                  {post.result || '분석 중'}
                </p>
              </div>
            </div>
          </div>

          <div className="p-8 md:p-16">
            <div className="prose prose-invert prose-emerald max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {post.content}
              </ReactMarkdown>
            </div>
          </div>

          <div className="p-8 md:p-16 bg-black/40 border-t border-white/5 flex flex-col items-center text-center gap-8">
            <div className="space-y-2">
              <p className="text-gray-600 text-[10px] font-black uppercase tracking-[0.4em]">Community Vetting</p>
              <p className="text-white/30 text-[9px] font-medium italic">이 리포트가 유익했다면 인증을 진행해주세요.</p>
            </div>
            
            <button 
              onClick={handleLike}
              disabled={isLiked || (!user && !isDemoMode)}
              className={`group flex items-center gap-5 px-16 py-6 rounded-full border transition-all duration-500 ${
                isLiked 
                  ? 'bg-emerald-500 border-emerald-500 text-black scale-105 shadow-[0_0_50px_rgba(16,185,129,0.3)]' 
                  : 'border-white/10 text-white hover:border-emerald-500/50 hover:bg-emerald-500/5'
              } disabled:cursor-not-allowed`}
            >
              <span className={`text-3xl transition-transform ${isLiked ? 'scale-125' : 'group-hover:rotate-12'}`}>
                {isLiked ? '🛡️' : '💎'}
              </span>
              <div className="text-left">
                <div className="font-black text-sm uppercase tracking-widest">
                  {isLiked ? 'Intelligence Verified' : 'Confirm Intelligence'}
                </div>
                <div className={`text-[10px] font-bold ${isLiked ? 'text-black/60' : 'text-gray-500'}`}>
                  Current Score: {likeCount}
                </div>
              </div>
            </button>
          </div>
        </article>

        {/* 댓글 섹션 */}
        <section className="max-w-4xl mx-auto mt-20">
          <div className="flex items-center gap-4 mb-10">
            <h3 className="text-2xl font-black uppercase italic tracking-tighter">Reconnaissance Logs</h3>
            <span className="text-emerald-500 font-bold text-sm px-3 py-1 bg-emerald-500/10 rounded-lg">{comments.length}</span>
          </div>

          <form onSubmit={handleCommentSubmit} className="mb-16 bg-neutral-900/50 border border-white/5 p-8 rounded-[2rem] shadow-xl">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={user || isDemoMode ? "데이터에 대한 분석이나 추가 정보를 공유해 주세요." : "로그인이 필요한 기능입니다."}
              disabled={!user && !isDemoMode}
              className="w-full bg-black/40 border border-white/10 rounded-2xl p-6 text-white outline-none focus:border-emerald-500/50 transition-all min-h-[120px] mb-6 resize-none"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={!newComment.trim() || (!user && !isDemoMode)}
                className="bg-white text-black font-black px-10 py-4 rounded-xl hover:bg-emerald-500 transition-all uppercase text-[11px] tracking-widest disabled:opacity-30"
              >
                Post Log
              </button>
            </div>
          </form>

          <div className="space-y-6">
            {comments.length > 0 ? comments.map((comment) => (
              <div key={comment.id} className="bg-neutral-900/30 border border-white/5 p-8 rounded-[2rem] transition-all hover:bg-white/[0.02]">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-white font-black text-sm">{comment.author_name}</span>
                    <span className={`text-[8px] font-black px-2 py-0.5 rounded-md border uppercase tracking-widest ${getRoleColor(comment.role)}`}>
                      {comment.role}
                    </span>
                  </div>
                  <span className="text-gray-600 text-[10px] font-bold">
                    {new Date(comment.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed break-keep">
                  {comment.text}
                </p>
              </div>
            )) : (
              <div className="py-20 text-center border border-dashed border-white/5 rounded-[2.5rem]">
                <p className="text-gray-600 font-black text-xs uppercase tracking-[0.3em]">No Logs Registered Yet</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default CommunityDetail;
