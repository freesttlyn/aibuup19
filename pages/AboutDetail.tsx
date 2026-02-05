
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ABOUT_BANNERS } from '../constants';

const AboutDetail: React.FC = () => {
  const { id } = useParams();
  const banner = ABOUT_BANNERS.find(b => b.id === id);

  if (!banner) return <div className="pt-40 text-center">정보를 찾을 수 없습니다.</div>;

  const getDetailedContent = () => {
    switch(id) {
      case 'vetted-list': return "우리가 직접 발로 뛰며 검증한 리스트입니다. 수익 구조, 난이도, 초기 자본 유무를 철저히 파헤쳤습니다. 정답은 아닐지언정 결코 호구가 되지는 않게 해드립니다.";
      case 'investment-system': return "부업은 시간과 돈의 교환입니다. 무작정 시작하기 전, 자신의 상황(직장인, 주부, 학생 등)에 맞춰 투입 대비 산출이 가장 높은 최적의 부업을 데이터로 추천합니다.";
      case 'damage-cases': return "강팔이들에게 당하는 것은 돈보다 시간을 잃는 것이 더 큽니다. 실제 회원들의 피해 사례를 통해 특정 수법과 패턴을 분석하여 강력한 변별력을 갖추게 돕습니다.";
      case 'trend-news': return "AI 기술은 어제와 오늘이 다릅니다. 아무도 예측할 수 없는 미래에 대해 대비하고, 현재 가장 핫한 AI 툴과 시장 흐름을 토론하며 의견을 교환합니다.";
      case 'experience-stories': return "누군가의 실패는 나의 성공을 위한 지름길이 됩니다. 실제 부업을 실행하며 겪은 리얼한 성공담과 실패담을 통해 방향성을 제시합니다.";
      case 'profit-certification': return "백 마디 말보다 한 장의 입금 내역이 더 강력합니다. 성공한 회원들의 실제 수익 인증을 통해 부업의 실현 가능성을 명확하게 증명합니다.";
      case 'collab-proposal': return "혼자 가면 빠르지만 함께 가면 더 멀리 갑니다. 비즈니스 파트너를 찾거나 새로운 수익 모델 프로젝트를 제안하고 협력할 수 있는 공간입니다.";
      default: return banner.desc;
    }
  };

  const getTargetLink = () => {
    if (banner.category === 'NEWS_PAGE') return '/news';
    if (banner.category === '전체') return '/community';
    return `/community?cat=${banner.category}`;
  };

  return (
    <div className="pt-32 pb-32 min-h-screen bg-black">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <Link to="/community" className="text-emerald-500 hover:text-white transition-colors mb-12 inline-block font-bold">
          ← Back to Community
        </Link>
        
        <div className={`p-8 sm:p-16 md:p-24 rounded-[3rem] md:rounded-[4rem] bg-gradient-to-br ${banner.color} shadow-2xl relative overflow-hidden`}>
          <div className="absolute top-0 right-0 size-96 bg-white/5 blur-[100px] -mr-48 -mt-48" />
          <div className="relative z-10">
            <span className="text-6xl md:text-7xl mb-12 block">{banner.icon}</span>
            <h1 className="text-4xl md:text-7xl font-black mb-12 tracking-tighter leading-tight whitespace-pre-line">{banner.title}</h1>
            <p className="text-lg sm:text-2xl md:text-3xl text-white/90 font-light leading-relaxed mb-16 break-keep">
              {getDetailedContent()}
            </p>
            <Link 
              to={getTargetLink()} 
              className="inline-block bg-white text-black px-10 md:px-12 py-4 md:py-5 rounded-full font-black text-lg md:text-xl hover:scale-105 transition-transform break-keep"
            >
              {banner.category === 'NEWS_PAGE' ? '뉴스 피드 보기' : '커뮤니티 이동'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutDetail;
