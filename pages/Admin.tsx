
import React, { useState, useEffect, useRef, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase, isConfigured } from '../lib/supabase';
import { CommunityPost, NewsItem } from '../types';
import { UserContext } from '../App';

const MOCK_POSTS: any[] = [
  { id: 'demo-1', title: '유튜브 쇼츠 AI 자동화 3개월 차 수익 인증 (월 180만원)', author: 'AI마스터', category: '수익인증', created_at: new Date().toISOString() },
  { id: 'demo-2', title: '강남역 OOO AI 부업 강의 330만원 사기 피해 고발', author: '정의의사도', category: '강팔이피해사례', created_at: new Date().toISOString() },
  { id: 'demo-3', title: '[고수] 미드저니 6.1 실전 인테리어 사진 판매 노하우', author: '고수X', category: '검증된부업분석-투자시간/비용체계적정리', created_at: new Date().toISOString() }
];

const MOCK_PROFILES: any[] = [
  { id: 'u-1', email: 'ai_master@example.com', nickname: 'AI마스터', role: 'GOLD', created_at: new Date(Date.now() - 86400000 * 10).toISOString() },
  { id: 'u-2', email: 'justice@example.com', nickname: '정의의사도', role: 'SILVER', created_at: new Date(Date.now() - 86400000 * 5).toISOString() },
  { id: 'u-3', email: 'admin@aibuup.com', nickname: '최고관리자', role: 'ADMIN', created_at: new Date(Date.now() - 86400000 * 30).toISOString() }
];

interface Profile {
  id: string;
  email: string;
  nickname: string;
  role: 'ADMIN' | 'GOLD' | 'SILVER';
  created_at: string;
}

const Admin: React.FC = () => {
  const { user, profile } = useContext(UserContext);
  const navigate = useNavigate();
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [activeTab, setActiveTab] = useState<'posts' | 'users' | 'news'>('posts');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [newsForm, setNewsForm] = useState({
    title: '',
    category: 'Trend',
    summary: '',
    content: '',
    image_url: ''
  });

  useEffect(() => {
    if (!user && !loading) {
      navigate('/login');
      return;
    }
    if (profile && profile.role !== 'ADMIN') {
      alert('관리자 권한이 없습니다.');
      navigate('/');
      return;
    }
  }, [profile, user, loading, navigate]);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    const localPosts = JSON.parse(localStorage.getItem('demo_posts') || '[]');

    if (!isConfigured) {
      setPosts([...localPosts, ...MOCK_POSTS]);
      setProfiles(MOCK_PROFILES);
      setLoading(false);
      return;
    }

    try {
      const { data: postsData } = await supabase.from('posts').select('*').order('created_at', { ascending: false });
      const { data: profilesData } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
      const { data: newsData } = await supabase.from('news').select('*').order('created_at', { ascending: false });

      setPosts([...localPosts, ...(postsData || [])]);
      setProfiles(profilesData || []);
      setNews(newsData || []);
    } catch (error) {
      console.error('관리자 데이터 로드 오류:', error);
      setPosts([...localPosts, ...MOCK_POSTS]);
      setProfiles(MOCK_PROFILES);
    } finally {
      setLoading(false);
    }
  };

  const seedData = async () => {
    if (!window.confirm('샘플 데이터를 시스템에 추가하시겠습니까?')) return;
    setIsSeeding(true);

    const newSeeds = [
      {
        id: `seed-${Date.now()}`,
        title: "AI로 그린 그림, 스톡 이미지 사이트에서 첫 판매 성공 리포트",
        author: "아트봇",
        category: "수익인증",
        content: "드디어 첫 달러 수익이 발생했습니다! 미드저니를 활용한 가이드입니다.",
        created_at: new Date().toISOString(),
        likes: 12,
        result: "$1.2 수익 발생"
      }
    ];

    if (!isConfigured) {
      const existing = JSON.parse(localStorage.getItem('demo_posts') || '[]');
      localStorage.setItem('demo_posts', JSON.stringify([...newSeeds, ...existing]));
    } else {
      try {
        const seedsWithUser = newSeeds.map(s => ({ ...s, user_id: user?.id, id: undefined }));
        await supabase.from('posts').insert(seedsWithUser);
      } catch (e) {
        console.error("Seed error", e);
      }
    }

    alert('데이터가 추가되었습니다.');
    setIsSeeding(false);
    fetchAdminData();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setNewsForm(prev => ({ ...prev, image_url: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setNewsForm(prev => ({ ...prev, image_url: '' }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const deletePost = async (id: string | number) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    const localPosts = JSON.parse(localStorage.getItem('demo_posts') || '[]');
    const filteredLocal = localPosts.filter((p: any) => p.id !== id);
    localStorage.setItem('demo_posts', JSON.stringify(filteredLocal));

    if (isConfigured && typeof id === 'string' && !id.startsWith('post-') && !id.startsWith('demo-')) {
       await supabase.from('posts').delete().eq('id', id);
    }
    setPosts(posts.filter(p => p.id !== id));
  };

  const deleteNews = async (id: string) => {
    if (!isConfigured) return;
    if (!window.confirm('뉴스를 삭제하시겠습니까?')) return;
    const { error } = await supabase.from('news').delete().eq('id', id);
    if (!error) setNews(news.filter(n => n.id !== id));
  };

  const handleCreateNews = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConfigured) return alert('Supabase 설정이 필요합니다.');
    setIsPublishing(true);
    try {
      const { data, error } = await supabase.from('news').insert([{
        ...newsForm,
        date: new Date().toLocaleDateString()
      }]).select().single();
      if (error) throw error;
      setNews(prev => [data, ...prev]);
      setNewsForm({ title: '', category: 'Trend', summary: '', content: '', image_url: '' });
      setImagePreview(null);
      alert('뉴스 발행 성공!');
    } catch (err: any) {
      alert('에러: ' + err.message);
    } finally {
      setIsPublishing(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: string) => {
    if (isConfigured) {
      const { error } = await supabase.from('profiles').update({ role: newRole }).eq('id', userId);
      if (error) {
        alert('실패: ' + error.message);
        return;
      }
    }
    setProfiles(profiles.map(p => p.id === userId ? { ...p, role: newRole as any } : p));
    alert('회원 등급이 변경되었습니다.');
  };

  const forceWithdrawal = async (userId: string) => {
    if (userId === user?.id) {
      alert('자기 자신을 탈퇴시킬 수 없습니다.');
      return;
    }
    if (!window.confirm('정말로 이 회원을 강제 탈퇴시키겠습니까?\n작성한 모든 데이터에 접근이 제한될 수 있습니다.')) return;

    if (isConfigured) {
      const { error } = await supabase.from('profiles').delete().eq('id', userId);
      if (error) {
        alert('탈퇴 처리 실패: ' + error.message);
        return;
      }
    }
    setProfiles(profiles.filter(p => p.id !== userId));
    alert('탈퇴 처리가 완료되었습니다.');
  };

  return (
    <div className="min-h-screen bg-black pt-12 pb-32 px-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-2 uppercase italic">Admin Panel</h1>
            <p className="text-emerald-500 font-bold uppercase text-xs tracking-[0.4em]">Audit Intelligence & Ecosystem Management</p>
          </div>
          <div className="flex gap-4">
             <button onClick={fetchAdminData} className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl font-bold text-xs uppercase hover:bg-white/10 transition-all">Refresh</button>
             <Link to="/" className="px-6 py-3 bg-emerald-500 text-black rounded-2xl font-black text-xs hover:bg-white transition-all uppercase tracking-widest">Exit</Link>
          </div>
        </header>

        <div className="flex flex-wrap gap-2 mb-8 bg-neutral-900/50 p-2 rounded-[2rem] w-fit border border-white/5">
          <button onClick={() => setActiveTab('posts')} className={`px-8 py-4 rounded-xl font-black text-[11px] uppercase tracking-widest transition-all ${activeTab === 'posts' ? 'bg-white text-black' : 'text-gray-500'}`}>게시글 관리</button>
          <button onClick={() => setActiveTab('users')} className={`px-8 py-4 rounded-xl font-black text-[11px] uppercase tracking-widest transition-all ${activeTab === 'users' ? 'bg-white text-black' : 'text-gray-500'}`}>회원 관리</button>
          <button onClick={() => setActiveTab('news')} className={`px-8 py-4 rounded-xl font-black text-[11px] uppercase tracking-widest transition-all ${activeTab === 'news' ? 'bg-white text-black' : 'text-gray-500'}`}>뉴스피드 관리</button>
        </div>

        {activeTab === 'posts' && (
          <div className="animate-fadeIn">
            <div className="flex justify-between items-center mb-6 px-4">
              <h2 className="text-sm font-black text-gray-500 uppercase tracking-widest italic">Intelligence Archive ({posts.length})</h2>
              <button onClick={seedData} disabled={isSeeding} className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 px-5 py-2 rounded-xl text-[10px] font-black uppercase hover:bg-emerald-500 hover:text-black transition-all">
                {isSeeding ? 'SEEDING...' : 'SEED SAMPLE DATA'}
              </button>
            </div>
            <div className="bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/5 text-[10px] text-gray-600 uppercase font-black tracking-widest">
                    <th className="px-8 py-6">Title</th>
                    <th className="px-8 py-6">Author</th>
                    <th className="px-8 py-6">Category</th>
                    <th className="px-8 py-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {posts.map(post => (
                    <tr key={post.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-8 py-6">
                        <Link to={`/community/${post.id}`} className="font-bold text-sm line-clamp-1 hover:text-emerald-400 transition-colors">{post.title}</Link>
                      </td>
                      <td className="px-8 py-6 text-xs text-gray-500">{post.author}</td>
                      <td className="px-8 py-6">
                        <span className="text-[9px] font-black px-3 py-1 bg-white/5 border border-white/10 rounded-full uppercase text-gray-400">{post.category}</span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <button onClick={() => deletePost(post.id)} className="text-red-500/30 hover:text-red-500 font-bold text-[10px] uppercase transition-colors">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="animate-fadeIn">
            <h2 className="text-sm font-black text-gray-500 uppercase tracking-widest italic mb-6 px-4">Member Directory ({profiles.length})</h2>
            <div className="bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/5 text-[10px] text-gray-600 uppercase font-black tracking-widest">
                    <th className="px-8 py-6">User Info</th>
                    <th className="px-8 py-6">Joined Date</th>
                    <th className="px-8 py-6">Current Role</th>
                    <th className="px-8 py-6 text-right">Management</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {profiles.map(p => (
                    <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                          <span className="font-bold text-sm text-white">{p.nickname}</span>
                          <span className="text-[10px] text-gray-500">{p.email}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-[11px] text-gray-500">
                        {new Date(p.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-8 py-6">
                        <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase border shadow-sm ${
                          p.role === 'ADMIN' ? 'bg-red-500/10 border-red-500/30 text-red-500' : 
                          p.role === 'GOLD' ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-500' : 'bg-gray-500/10 border-white/5 text-gray-500'
                        }`}>{p.role}</span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center justify-end gap-4">
                          <div className="flex flex-col gap-1 items-end">
                            <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest mb-1">Update Rank</span>
                            <select 
                              value={p.role}
                              onChange={(e) => updateUserRole(p.id, e.target.value)}
                              className="bg-black border border-white/10 text-[10px] font-black uppercase text-gray-400 rounded-lg px-3 py-1.5 outline-none focus:border-emerald-500 transition-all"
                            >
                              <option value="SILVER">Silver</option>
                              <option value="GOLD">Gold</option>
                              <option value="ADMIN">Admin</option>
                            </select>
                          </div>
                          <button 
                            onClick={() => forceWithdrawal(p.id)}
                            className="bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-black px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all mt-4"
                          >
                            Withdraw
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'news' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fadeIn">
            <div className="lg:col-span-1">
              <div className="bg-neutral-900/40 border border-white/10 p-8 rounded-[2.5rem] sticky top-36 shadow-2xl">
                <h2 className="text-xl font-black mb-8 uppercase italic flex items-center gap-3">
                  <span className="size-2 bg-emerald-500 rounded-full"></span> Publish News
                </h2>
                <form onSubmit={handleCreateNews} className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest ml-1">News Title</label>
                    <input type="text" required value={newsForm.title} onChange={e => setNewsForm({...newsForm, title: e.target.value})} className="w-full bg-black/40 border border-white/5 rounded-xl px-5 py-3 text-sm text-white focus:border-emerald-500/50 outline-none" placeholder="뉴스 제목 입력" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest ml-1">Category</label>
                    <select value={newsForm.category} onChange={e => setNewsForm({...newsForm, category: e.target.value})} className="w-full bg-black/40 border border-white/5 rounded-xl px-5 py-3 text-sm text-white focus:border-emerald-500/50 outline-none">
                      <option value="Trend">Trend</option>
                      <option value="Tutorial">Tutorial</option>
                      <option value="Review">Review</option>
                      <option value="Update">Update</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest ml-1">Cover Image</label>
                    <div onClick={() => fileInputRef.current?.click()} className="w-full aspect-video bg-black/40 border border-dashed border-white/10 rounded-xl flex items-center justify-center cursor-pointer overflow-hidden group relative">
                      {imagePreview ? (
                        <>
                          <img src={imagePreview} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                            <span className="text-[10px] font-black uppercase">Change Image</span>
                          </div>
                        </>
                      ) : (
                        <div className="text-center">
                          <span className="text-2xl mb-2 block">🖼️</span>
                          <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest">Select Image</span>
                        </div>
                      )}
                    </div>
                    <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
                    {imagePreview && <button type="button" onClick={removeImage} className="text-[9px] text-red-500 font-bold uppercase mt-2">Remove Image</button>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest ml-1">Summary</label>
                    <textarea value={newsForm.summary} onChange={e => setNewsForm({...newsForm, summary: e.target.value})} className="w-full bg-black/40 border border-white/5 rounded-xl px-5 py-3 text-sm text-white focus:border-emerald-500/50 outline-none h-24 resize-none" placeholder="짧은 요약글" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest ml-1">Main Content (Markdown)</label>
                    <textarea required value={newsForm.content} onChange={e => setNewsForm({...newsForm, content: e.target.value})} className="w-full bg-black/40 border border-white/5 rounded-xl px-5 py-3 text-sm text-white focus:border-emerald-500/50 outline-none h-48 resize-none" placeholder="마크다운 형식의 본문" />
                  </div>
                  <button type="submit" disabled={isPublishing} className="w-full bg-emerald-500 text-black font-black py-4 rounded-xl uppercase tracking-widest text-xs hover:bg-white transition-all disabled:opacity-50 shadow-lg shadow-emerald-500/10">
                    {isPublishing ? 'PUBLISHING...' : 'PUBLISH NOW'}
                  </button>
                </form>
              </div>
            </div>
            <div className="lg:col-span-2">
              <div className="bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-white/5 text-[10px] text-gray-600 uppercase font-black tracking-widest">
                      <th className="px-8 py-6">News Feed</th>
                      <th className="px-8 py-6 text-right">Manage</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {news.map(n => (
                      <tr key={n.id} className="group hover:bg-white/[0.02] transition-all">
                        <td className="px-8 py-6">
                          <div className="flex gap-4 items-center">
                            <img src={n.image_url} className="size-16 rounded-xl object-cover border border-white/5" />
                            <div>
                              <p className="font-bold text-sm text-white line-clamp-1">{n.title}</p>
                              <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest mt-1">{n.date} • {n.category}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <button onClick={() => deleteNews(n.id)} className="text-red-500/30 hover:text-red-500 font-bold text-[10px] uppercase transition-colors">Delete</button>
                        </td>
                      </tr>
                    ))}
                    {news.length === 0 && (
                      <tr>
                        <td colSpan={2} className="px-8 py-20 text-center text-gray-600 text-xs font-black uppercase tracking-[0.4em]">No news published yet</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.4s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default Admin;
