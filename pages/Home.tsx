
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SPLINE_URL, ABOUT_BANNERS, MOCK_NEWS } from '../constants';
import { supabase, isConfigured } from '../lib/supabase';
import { NewsItem } from '../types';

const Home: React.FC = () => {
  const [newsList, setNewsList] = useState<NewsItem[]>(MOCK_NEWS);

  useEffect(() => {
    fetchLatestNews();
  }, []);

  const fetchLatestNews = async () => {
    if (!isConfigured) return;
    try {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(6);
      
      if (!error && data && data.length > 0) {
        setNewsList(data);
      }
    } catch (e) {
      console.warn("News fetch failed, staying with mock data");
    }
  };

  const marqueeNews = [...newsList, ...newsList, ...newsList, ...newsList];

  const getBannerLink = (category: string) => {
    if (category === 'NEWS_PAGE') return '/news';
    if (category === '전체') return '/community';
    return `/community?cat=${category}`;
  };

  return (
    <div className="relative w-full">
      {/* Hero Section */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-black">
        <div className="absolute inset-0 z-10 overflow-hidden opacity-40">
          <iframe 
            src={SPLINE_URL} 
            frameBorder="0" 
            className="absolute top-0 left-0 w-full h-[115%] scale-105"
            style={{ transformOrigin: 'top' }}
            title="Vetting Robot" 
          />
        </div>
        
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/80 to-black z-15 pointer-events-none" />
        
        <div className="relative z-20 px-6 text-center max-w-5xl mx-auto">
          <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold mb-8 border border-emerald-500/30 animate-pulse">
            가짜 인증 박멸 프로젝트 2025
          </span>
          <h1 className="text-5xl md:text-8xl font-black mb-8 tracking-tighter leading-none break-keep">
            AI 부업의<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-purple-500">진실을 봅니다.</span>
          </h1>
          <div className="flex flex-col md:flex-row justify-center gap-4 md:gap-6 mt-12">
            <Link to="/vetting" className="group bg-white text-black px-8 md:px-12 py-4 md:py-5 rounded-full font-bold text-base md:text-lg hover:bg-emerald-400 transition-all shadow-2xl shadow-emerald-500/20 flex items-center justify-center gap-2 break-keep">
              검증 리포트 보기 <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
            <Link to="/community" className="bg-white/5 backdrop-blur-xl border border-white/10 px-8 md:px-12 py-4 md:py-5 rounded-full font-bold text-base md:text-lg hover:bg-white/10 transition-all flex items-center justify-center break-keep">
              커뮤니티 이동
            </Link>
          </div>
        </div>
      </section>

      {/* Intro Description */}
      <section className="py-32 bg-black border-y border-white/5 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-emerald-500 font-black text-xl mb-12 uppercase tracking-widest break-keep">Ai BuUp Mission</h2>
          <div className="space-y-8 text-xl md:text-2xl text-gray-300 leading-relaxed font-light break-keep">
            <p>
              성공한 1%의 수익 인증이 아닌, <span className="text-white font-bold">나머지 99%의 리얼한 데이터</span>를 수집합니다.
            </p>
            <p className="text-emerald-400 font-bold italic">"우리는 도구를 파는 사람들의 말을 믿지 않습니다. 직접 도구를 휘두르는 사람들의 말을 믿습니다."</p>
            <p>
              AI 부업이 단순한 유행을 넘어 안정적인 경제적 해자가 되도록, 집단지성으로 시장을 정화하고 검증된 노하우를 공유합니다.
            </p>
          </div>
        </div>
      </section>

      {/* AI Trend News Marquee Section */}
      <section className="py-24 bg-black overflow-hidden border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 mb-12 flex justify-between items-end">
          <div>
            <h2 className="text-3xl md:text-4xl font-black tracking-tighter break-keep">최신 <span className="text-emerald-500">Ai 트렌드</span> 뉴스</h2>
            <p className="text-gray-500 mt-2 font-medium">실시간으로 변하는 AI 시장의 핵심만 짚어드립니다.</p>
          </div>
          <Link to="/news" className="text-gray-500 hover:text-emerald-400 font-bold text-sm transition-colors mb-2">
            전체보기 +
          </Link>
        </div>

        <div className="relative">
          <div className="animate-marquee py-4">
            {marqueeNews.map((news, idx) => (
              <Link 
                key={`${news.id}-${idx}`}
                to={`/news/${news.id}`}
                className="w-[300px] md:w-[400px] mx-4 group relative rounded-[2rem] overflow-hidden bg-neutral-900 border border-white/10 hover:border-emerald-500/50 transition-all duration-500"
              >
                <div className="h-48 md:h-56 overflow-hidden">
                  <img src={news.image_url} alt={news.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                  <div className="absolute top-4 left-4">
                    <span className="bg-emerald-500 text-black text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                      {news.category}
                    </span>
                  </div>
                </div>
                <div className="p-8">
                  <div className="text-gray-500 text-[10px] font-bold mb-3 uppercase tracking-widest">{news.date}</div>
                  <h3 className="text-xl md:text-2xl font-black mb-4 leading-tight group-hover:text-emerald-400 transition-colors line-clamp-2">
                    {news.title}
                  </h3>
                  <p className="text-gray-400 text-sm font-light line-clamp-2 leading-relaxed">
                    {news.summary}
                  </p>
                </div>
              </Link>
            ))}
          </div>
          <div className="absolute inset-y-0 left-0 w-24 md:w-48 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-24 md:w-48 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />
        </div>
      </section>

      {/* Banners Section */}
      <section className="bg-black py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {ABOUT_BANNERS.map((banner, index) => (
              <Link 
                key={banner.id} 
                to={getBannerLink(banner.category)}
                className="group relative block rounded-[3rem] p-px overflow-hidden transition-all duration-500 hover:scale-[1.02] glow-border"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${banner.color} opacity-20 group-hover:opacity-100 transition-opacity duration-500`} />
                <div className="relative h-full w-full bg-neutral-900 rounded-[2.95rem] p-10 md:p-14 overflow-hidden">
                  <div className={`absolute -right-20 -top-20 size-80 bg-gradient-to-br ${banner.color} opacity-5 blur-[100px] group-hover:opacity-20 transition-opacity duration-700`} />
                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex justify-between items-start mb-16">
                      <div className="size-20 bg-white/5 rounded-3xl flex items-center justify-center text-5xl group-hover:bg-white/10 transition-colors shadow-2xl">
                        {banner.icon}
                      </div>
                      <span className="text-white/10 font-black text-6xl tracking-tighter italic select-none">0{index + 1}</span>
                    </div>
                    <h3 className="text-3xl md:text-4xl font-black mb-6 tracking-tighter group-hover:text-emerald-400 transition-colors whitespace-pre-line leading-tight">
                      {banner.title}
                    </h3>
                    <p className="text-gray-400 text-lg leading-relaxed font-light mb-12 break-keep">
                      {banner.desc}
                    </p>
                    <div className="mt-auto flex items-center gap-2 text-emerald-500 font-black text-sm uppercase tracking-widest">
                      Go To {banner.category === 'NEWS_PAGE' ? 'News' : 'Category'} <span>→</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <footer className="py-12 bg-neutral-950 text-center text-gray-600 text-xs border-t border-white/5">
        <p>© 2025 Ai BuUp. All Rights Reserved. 가짜 정보를 걸러내는 우리만의 방패.</p>
      </footer>
    </div>
  );
};

export default Home;
