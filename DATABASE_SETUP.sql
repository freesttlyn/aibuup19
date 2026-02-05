
-- 1. 회원 프로필 테이블 생성
CREATE TABLE IF NOT EXISTS public.profiles (
    id uuid REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    email text NOT NULL,
    nickname text,
    role text DEFAULT 'SILVER' CHECK (role IN ('ADMIN', 'GOLD', 'SILVER')),
    created_at timestamptz DEFAULT now()
);

-- 2. 회원가입 시 자동으로 profiles에 기본 정보를 삽입하는 함수
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
    assigned_role text;
BEGIN
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

-- 3. 트리거 설정
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. 게시글 테이블 (dailyTime -> daily_time 변경)
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

-- 5. 댓글 테이블
CREATE TABLE IF NOT EXISTS public.comments (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    post_id uuid REFERENCES public.posts(id) ON DELETE CASCADE,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    author_name text NOT NULL,
    role text DEFAULT 'SILVER',
    text text NOT NULL,
    created_at timestamptz DEFAULT now()
);

-- 6. 뉴스 테이블
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

-- 7. 보안 정책 (RLS) 활성화
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;

-- 8. 정책 설정
CREATE POLICY "Public profiles viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Posts viewable by everyone" ON public.posts FOR SELECT USING (true);
CREATE POLICY "Comments viewable by everyone" ON public.comments FOR SELECT USING (true);
CREATE POLICY "News viewable by everyone" ON public.news FOR SELECT USING (true);

CREATE POLICY "Authenticated users insert posts" ON public.posts FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users modify own posts" ON public.posts FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Authenticated users insert comments" ON public.comments FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users modify own comments" ON public.comments FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admins manage news" ON public.news FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'ADMIN')
);
