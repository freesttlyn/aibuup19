
export interface NewsItem {
  id: string;
  title: string;
  category: string;
  date: string;
  summary: string;
  content: string;
  image_url: string;
}

export type BoardCategoryType = 
  | '검증된부업분석-투자시간/비용체계적정리'
  | '회원노하우전수'
  | '강팔이피해사례'
  | 'Ai부업경험담'
  | '미래비전공유'
  | '검증요청게시판'
  | '수익인증'
  | '협업및신사업제안'
  | '전체';

export interface CommunityPost {
  id: string;
  title: string;
  author: string;
  created_at: string;
  content: string;
  category: BoardCategoryType;
  tool?: string;
  cost?: string;
  daily_time?: string;
  result?: string;
  likes?: number;
  user_id?: string;
  score?: number;
}
