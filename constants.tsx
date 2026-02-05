
import { CommunityPost, NewsItem } from './types';

export const SITE_CONFIG = {
  title: "Ai BuUp",
  description: "가짜에 속지 않는 진짜 AI 부업 검증 플랫폼",
};

export const SPLINE_URL = "https://my.spline.design/nexbotrobotcharacterconcept-xwRIKhwRbGGBPxC2p1EZOZNY/";
export const EMAIL_ADDRESS = "exp.gwonyoung.woo@gmail.com";

export const FORMSPREE_URL = "https://formspree.io/f/mojewejl";

export const BOARD_CATEGORIES = [
  { id: 'all', name: '전체' },
  { id: 'scam', name: '강팔이피해사례' },
  { id: 'exp', name: 'Ai부업경험담' },
  { id: 'vision', name: '미래비전공유' },
  { id: 'request', name: '검증요청게시판' },
  { id: 'profit', name: '수익인증' },
  { id: 'collab', name: '협업및신사업제안' }
];

export const VIP_CATEGORIES = [
  { id: 'vip-analysis', name: '검증된부업분석-투자시간/비용체계적정리' },
  { id: 'vip-knowhow', name: '회원노하우전수' }
];

export const ABOUT_BANNERS = [
  { id: 'vetted-list', title: '검증요청게시판', desc: '의심되는 부업이 있다면 집단 지성으로 함께 검증합니다.', color: 'from-emerald-600 to-teal-800', icon: '🔍', category: '검증요청게시판' },
  { id: 'investment-system', title: '미래비전공유', desc: '자신의 상황에 맞는 부업을 선택할 수 있도록 데이터로 분석합니다.', color: 'from-blue-600 to-indigo-800', icon: '📊', category: '미래비전공유' },
  { id: 'damage-cases', title: '강팔이피해사례', desc: '더 이상의 피해자가 나오지 않도록 실제 사례를 통해 예방합니다.', color: 'from-red-600 to-orange-800', icon: '⚠️', category: '강팔이피해사례' },
  { id: 'trend-news', title: '최신 트렌드\nAi 부업 뉴스', desc: '급변하는 AI 생태계의 정보를 가장 빠르게 전달하고 토론합니다.', color: 'from-purple-600 to-pink-800', icon: '📰', category: 'NEWS_PAGE' },
  { id: 'experience-stories', title: 'Ai부업경험담', desc: '성공과 실패의 모든 기록이 여러분의 시행착오를 줄여줍니다.', color: 'from-amber-600 to-yellow-800', icon: '📝', category: 'Ai부업경험담' },
  { id: 'profit-certification', title: '수익인증', desc: '수치로 증명하는 가장 확실한 검증 시스템입니다.', color: 'from-green-600 to-emerald-900', icon: '💰', category: '수익인증' },
  { id: 'collab-proposal', title: '협업및신사업제안', desc: '함께 성장할 파트너를 찾거나 새로운 프로젝트를 제안하세요.', color: 'from-cyan-600 to-blue-800', icon: '🤝', category: '협업및신사업제안' },
  { id: 'member-knowhow', title: '전체 커뮤니티\n보기', desc: 'AI 부업인들의 모든 지식과 노하우가 모이는 공간입니다.', color: 'from-gray-600 to-slate-800', icon: '💡', category: '전체' }
];

export const MOCK_NEWS: NewsItem[] = [
  {
    id: '1',
    title: 'AI 부업 시장, 2025년 전망 리포트',
    category: 'Trend',
    date: '2025.05.01',
    summary: '인공지능 기술의 발전이 부업 시장에 미치는 영향과 새로운 기회들을 분석합니다. 단순 노동이 사라지고 창의적 협업이 중요해집니다.',
    content: '인공지능 기술의 급격한 발전으로 인해 전통적인 부업의 형태가 변화하고 있습니다. 2025년에는 단순히 AI를 사용하는 것을 넘어, AI와 함께 가치를 창출하는 모델이 주류가 될 것입니다.',
    image_url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '2',
    title: '생성형 AI로 웹툰 배경 제작하기: 수익화 가이드',
    category: 'Tutorial',
    date: '2025.05.10',
    summary: '스테이블 디퓨전을 활용하여 고퀄리티 웹툰 배경을 제작하고 판매하는 실전 노하우를 공개합니다.',
    content: '웹툰 시장의 폭발적인 성장과 함께 배경 리소스에 대한 수요도 급증하고 있습니다. AI를 활용해 제작 시간을 70% 단축하면서도 퀄리티를 유지하는 비법을 알아봅니다.',
    image_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800'
  }
];
