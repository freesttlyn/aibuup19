
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MOCK_NEWS } from '../constants';
import { supabase, isConfigured } from '../lib/supabase';
import { NewsItem } from '../types';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const NewsDetail: React.FC = () => {
  const { id } = useParams();
  const [news, setNews] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNewsDetail();
  }, [id]);

  const fetchNewsDetail = async () => {
    setLoading(true);
    if (!isConfigured) {
      setNews(MOCK_NEWS.find(n => n.id === id) || null);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setNews(data);
    } catch (err) {
      console.warn("Detailed news fetch failed");
      setNews(MOCK_NEWS.find(n => n.id === id) || null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="pt-48 pb-32 min-h-screen bg-black flex items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        <div className="size-16 border-4 border-emerald-500/10 border-t-emerald-500 rounded-full animate-spin" />
        <p className="text-emerald-500 font-black tracking-[0.4em] text-[10px] uppercase animate-pulse">Decrypting Signal</p>
      </div>
    </div>
  );

  if (!news) return (
    <div className="pt-48 text-center min-h-screen bg-black px-6">
      <h2 className="text-4xl font-black mb-8 tracking-tighter">DATA UNAVAILABLE</h2>
      <p className="text-gray-500 mb-12">요청하신 뉴스가 삭제되었거나 존재하지 않습니다.</p>
      <Link to="/news" className="bg-emerald-500 text-black px-12 py-5 rounded-2xl font-black uppercase text-sm">Back to Feed</Link>
    </div>
  );

  return (
    <div className="pt-12 pb-32 min-h-screen bg-black">
      <div className="max-w-4xl mx-auto px-6">
        <Link to="/news" className="group text-gray-500 hover:text-emerald-400 transition-colors mb-16 inline-flex items-center gap-3 font-black uppercase tracking-[0.2em] text-[10px]">
          <span className="group-hover:-translate-x-2 transition-transform">←</span> Back to Archive
        </Link>
        
        <header className="mb-16">
          <div className="flex items-center gap-4 mb-10">
            <span className="bg-emerald-500/10 text-emerald-400 font-black uppercase text-[10px] tracking-widest px-4 py-1.5 rounded-full border border-emerald-500/20">
              {news.category}
            </span>
            <span className="text-gray-600 text-xs font-bold uppercase tracking-widest">{news.date}</span>
          </div>
          <h1 className="text-4xl md:text-7xl font-black tracking-tighter leading-[1.1] break-keep">
            {news.title}
          </h1>
          <div className="mt-12 flex items-center gap-6 border-t border-white/5 pt-12">
            <div className="size-12 bg-neutral-800 rounded-full flex items-center justify-center font-black text-emerald-500">AB</div>
            <div className="flex flex-col">
              <span className="text-white font-bold">Ai BuUp Editorial</span>
              <span className="text-gray-500 text-xs">Senior Tech Analyst</span>
            </div>
          </div>
        </header>

        <div className="rounded-[3.5rem] overflow-hidden mb-20 shadow-2xl border border-white/10 relative group">
          <div className="absolute inset-0 bg-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          <img src={news.image_url} alt={news.title} className="w-full h-auto object-cover max-h-[600px]" />
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="prose prose-invert prose-emerald max-w-none">
            <p className="text-2xl md:text-3xl text-gray-200 leading-snug mb-16 font-light italic border-l-4 border-emerald-500 pl-8 break-keep">
              {news.summary}
            </p>
            <div className="text-lg md:text-xl text-gray-400 leading-relaxed font-light break-keep">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {news.content}
              </ReactMarkdown>
            </div>
          </div>

          <footer className="mt-32 pt-16 border-t border-white/10">
            <div className="bg-neutral-900 border border-white/10 rounded-[3rem] p-10 md:p-20 text-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <h4 className="text-2xl md:text-4xl font-black mb-6 tracking-tighter break-keep relative z-10">이 트렌드에 대해 질문이 있나요?</h4>
              <p className="text-gray-400 mb-12 font-light text-lg break-keep relative z-10">커뮤니티의 전문가들이 실시간으로 답변해 드립니다.</p>
              <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
                <Link 
                  to="/community" 
                  className="bg-emerald-500 text-black px-10 py-5 rounded-2xl font-black text-lg hover:bg-white transition-all shadow-xl shadow-emerald-500/20"
                >
                  커뮤니티 이동하기
                </Link>
                <Link 
                  to="/news" 
                  className="bg-white/5 border border-white/10 text-white px-10 py-5 rounded-2xl font-black text-lg hover:bg-white/10 transition-all"
                >
                  다른 뉴스 보기
                </Link>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default NewsDetail;
