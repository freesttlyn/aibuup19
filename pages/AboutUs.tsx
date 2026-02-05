
import React from 'react';
import { Link } from 'react-router-dom';
import { ABOUT_BANNERS } from '../constants';

const AboutUs: React.FC = () => {
  return (
    <div className="pt-32 pb-32 min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-6">
        <header className="mb-20 text-center">
          <span className="text-emerald-500 font-bold uppercase text-sm tracking-widest mb-4 block">Our Values</span>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter break-keep">우리에 대해</h1>
          <p className="text-gray-400 mt-8 max-w-3xl mx-auto text-xl leading-relaxed font-light break-keep">
            Ai BuUp은 단순한 정보 공유를 넘어, 실질적인 데이터와 검증을 통해<br />
            여러분과 함께 성장하는 생태계를 지향합니다.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-32">
          {ABOUT_BANNERS.map((banner) => (
            <Link 
              key={banner.id} 
              to={`/about/${banner.id}`}
              className="group p-8 md:p-12 bg-neutral-900 border border-white/5 rounded-[3rem] transition-all flex flex-col glow-border"
            >
              <div className="text-5xl mb-8">{banner.icon}</div>
              <h3 className="text-3xl font-black mb-4 group-hover:text-emerald-400 transition-colors whitespace-pre-line leading-tight">
                {banner.title}
              </h3>
              <p className="text-gray-500 text-lg leading-relaxed flex-1 font-light break-keep">
                {banner.desc}
              </p>
              <div className="mt-12 text-emerald-500 font-bold flex items-center gap-2 break-keep">
                자세히 보기 <span className="group-hover:translate-x-2 transition-transform">→</span>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center py-24 border-t border-white/10">
          <h2 className="text-3xl md:text-5xl font-black mb-10 break-keep">더 깊은 대화가 필요하신가요?</h2>
          <Link 
            to="/community"
            className="group bg-emerald-500 text-black px-12 py-6 rounded-full inline-flex items-center gap-4 hover:bg-white transition-all transform hover:scale-105 break-keep"
          >
            <span className="font-black text-xl md:text-2xl tracking-tighter">커뮤니티로 즉시 이동</span>
            <svg className="size-6 md:size-8 group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
