
# 🚀 Ai BuUp 배포 및 연동 가이드 (최종 점검 완료)

## 1. Supabase 설정
1. [Supabase](https://supabase.com) 가입 후 새 프로젝트를 생성합니다.
2. 좌측 메뉴의 **SQL Editor**를 클릭합니다.
3. `DATABASE_SETUP.sql` 파일의 내용을 복사하여 실행(Run)합니다.
4. **Project Settings > API** 메뉴에서 `URL`과 `anon public key`를 복사해둡니다.

## 2. 관리자 계정 정보
가입 시 자동으로 **ADMIN** 권한이 부여되는 계정입니다:
- **Admin 1**: `aibuup@aibuup.com` (PW: 1818444)
- **Admin 2**: `exp.gwonyoung.woo@gmail.com` (PW: 88_8tHh6)
- *주의: 위 계정으로 실제 서비스에서 '회원가입(Register)'을 진행해야 권한이 활성화됩니다.*

## 3. Netlify 배포 환경 변수
Netlify **Site configuration > Environment variables**에 다음 3개를 반드시 등록하세요:
- `VITE_SUPABASE_URL`: (Supabase 프로젝트 URL)
- `VITE_SUPABASE_ANON_KEY`: (Supabase Anon Key)
- `API_KEY`: (Google Gemini API Key) - *AI 리포트 생성을 위해 필수*

## 4. 최종 점검 사항
- **AI 글쓰기**: 채팅 완료 후 `localStorage`와 `Supabase` 양쪽에 데이터가 즉시 반영되는지 확인.
- **관리자 메뉴**: 관리자 계정으로 로그인 시 네비게이션 바에 `ADMIN` 탭이 나타나는지 확인.
- **데이터 유실 방지**: 새로고침 후에도 내가 쓴 글이 상세 페이지까지 정상 조회되는지 확인.
