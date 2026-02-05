
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MOCK_NEWS } from '../constants';
import { supabase, isConfigured } from '../lib/supabase';
import { NewsItem } from '../types';

const News: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    setLoading(true);
    if (!isConfigured) {
      setNews(MOCK_NEWS);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data && data.length > 0) {
        setNews(data);
      } else {
        setNews(MOCK_NEWS);
      }
    } catch (err) {
      setNews(MOCK_NEWS);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-12 pb-32 min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-6">
        <header className="mb-20 text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase tracking-[0.3em] mb-6 border border-emerald-500/20">
            Archive & Trends
          </span>
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-8 leading-none uppercase italic">
            Ai <span className="text-emerald-500">News</span> Feed
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg md:text-xl font-light break-keep">
            변화하는 AI 시장에서 기회를 포착하세요. <br />
            실무에 바로 적용 가능한 가장 빠른 트렌드를 매거진 스타일로 전달합니다.
          </p>
        </header>

        {loading ? (
          <div className="py-24 text-center">
             <div className="size-10 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4" />
             <p className="text-gray-600 text-[10px] font-black uppercase tracking-widest">Updating Intelligence...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            {news.map((n) => (
              <Link 
                key={n.id} 
                to={`/news/${n.id}`}
                className="group flex flex-col bg-neutral-900 border border-white/5 rounded-[2.5rem] overflow-hidden hover:border-emerald-500/40 transition-all duration-500 shadow-2xl hover:shadow-emerald-500/10"
              >
                <div className="relative h-64 overflow-hidden">
                  <img src={n.image_url} alt={n.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                  <div className="absolute top-6 left-6">
                    <span className="bg-emerald-500 text-black text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-xl">
                      {n.category}
                    </span>
                  </div>
                </div>
                <div className="p-10 flex-1 flex flex-col">
                  <div className="text-gray-500 text-[10px] font-bold mb-4 uppercase tracking-[0.2em]">{n.date}</div>
                  <h3 className="text-2xl md:text-3xl font-black mb-6 leading-tight group-hover:text-emerald-400 transition-colors line-clamp-2">
                    {n.title}
                  </h3>
                  <p className="text-gray-400 text-sm md:text-base font-light line-clamp-3 mb-10 leading-relaxed break-keep">
                    {n.summary}
                  </p>
                  <div className="mt-auto flex items-center gap-3 text-xs font-black uppercase tracking-widest text-emerald-500 group-hover:gap-5 transition-all">
                    View Detail <span>→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default News;
