-- Ai BuUp 플랫폼의 모든 정보를 담는 데이터베이스 구조입니다.
-- 수퍼베이스(Supabase)의 SQL Editor에서 이 내용을 복사하여 실행(Run)하세요.

-- 1. 회원 프로필 테이블 (사용자 등급 및 닉네임 관리)
CREATE TABLE IF NOT EXISTS public.profiles (
    id uuid REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    email text NOT NULL,
    nickname text,
    role text DEFAULT 'SILVER' CHECK (role IN ('ADMIN', 'GOLD', 'SILVER')),
    created_at timestamptz DEFAULT now()
);

-- 2. 문의하기 테이블 (Contact 메뉴용)
CREATE TABLE IF NOT EXISTS public.contacts (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    email text NOT NULL,
    message text NOT NULL,
    created_at timestamptz DEFAULT now()
);

-- 3. 회원가입 시 자동으로 프로필 생성하는 마법의 함수
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
    assigned_role text;
BEGIN
  -- 특정 이메일 주소에 관리자(ADMIN) 권한 부여
  IF new.email IN ('aibuup@aibuup.com', 'exp.gwonyoung.woo@gmail.com') THEN
    assigned_role := 'ADMIN';
  ELSE
    assigned_role := 'SILVER';
  END IF;

  INSERT INTO public.profiles (id, email, nickname, role)
  VALUES (
    new.id, 
    new.email, 
    COALESCE(new.raw_user_meta_data->>'nickname', split_part(new.email, '@', 1)), 
    assigned_role
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. 회원가입 시 함수가 실행되도록 트리거 설정
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 5. 게시글 테이블 (AI 리포트 및 커뮤니티 글 저장)
CREATE TABLE IF NOT EXISTS public.posts (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at timestamptz DEFAULT now(),
    title text NOT NULL,
    author text NOT NULL,
    category text NOT NULL,
    content text NOT NULL,
    result text,
    daily_time text,
    likes integer DEFAULT 0,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    tool text,
    cost text,
    score integer DEFAULT 5
);

-- 6. 댓글 테이블
CREATE TABLE IF NOT EXISTS public.comments (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    post_id uuid REFERENCES public.posts(id) ON DELETE CASCADE,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    author_name text NOT NULL,
    role text DEFAULT 'SILVER',
    text text NOT NULL,
    created_at timestamptz DEFAULT now()
);

-- 7. AI 뉴스 테이블 (관리자 전용 뉴스 피드)
CREATE TABLE IF NOT EXISTS public.news (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at timestamptz DEFAULT now(),
    title text NOT NULL,
    category text NOT NULL,
    date text NOT NULL,
    summary text NOT NULL,
    content text NOT NULL,
    image_url text NOT NULL
);

-- 8. 보안 설정 활성화 (Row Level Security)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

-- 9. 권한(Policy) 설정 - 누가 데이터를 볼 수 있고 쓸 수 있는지 정의합니다.

-- 프로필: 누구나 조회 가능, 본인만 수정
CREATE POLICY "Public profiles viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 게시글: 누구나 조회 가능, 로그인한 사람만 작성, 작성자만 수정/삭제
CREATE POLICY "Posts viewable by everyone" ON public.posts FOR SELECT USING (true);
CREATE POLICY "Authenticated users insert posts" ON public.posts FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users modify own posts" ON public.posts FOR ALL USING (auth.uid() = user_id);

-- 댓글: 누구나 조회 가능, 로그인한 사람만 작성, 작성자만 수정/삭제
CREATE POLICY "Comments viewable by everyone" ON public.comments FOR SELECT USING (true);
CREATE POLICY "Authenticated users insert comments" ON public.comments FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users modify own comments" ON public.comments FOR ALL USING (auth.uid() = user_id);

-- 뉴스: 누구나 조회 가능, 관리자(ADMIN)만 수정/삭제
CREATE POLICY "News viewable by everyone" ON public.news FOR SELECT USING (true);
CREATE POLICY "Admins manage news" ON public.news FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'ADMIN')
);

-- 문의하기: 누구나 전송 가능, 관리자(ADMIN)만 조회
CREATE POLICY "Anyone can submit contacts" ON public.contacts FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins view contacts" ON public.contacts FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'ADMIN')
);