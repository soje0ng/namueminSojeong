# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

Basic Solution은 프론트엔드와 백엔드가 분리된 CMS 플랫폼 모노레포이며, Docker로 배포됩니다.

- **프론트엔드 (fe/)**: Next.js 16 (App Router) + React 19 + TypeScript
- **백엔드 (be/)**: Express.js + Sequelize + MariaDB/MSSQL

## 주요 명령어

### 프론트엔드 (`fe/` 디렉토리에서 실행)
```bash
npm run dev -- -p 3028      # 개발 서버 실행
npm run build               # 프로덕션 빌드 (정적 파일 복사 포함)
npm run lint                # ESLint 검사
npm run test                # Jest 테스트 실행
npm run test:watch          # 테스트 감시 모드
npm run test:coverage       # 커버리지 리포트
npx tsc --noEmit            # TypeScript 타입 체크만 실행
```

### 백엔드 (`be/` 디렉토리에서 실행)
```bash
npm run start               # nodemon으로 개발 서버 실행
```

### Docker (루트 디렉토리에서 실행)
```bash
docker-compose up           # 전체 서비스 시작
docker-compose up --build   # 재빌드 후 시작
```

## 아키텍처

### 프론트엔드 구조
```
fe/src/
├── app/                    # Next.js App Router
│   ├── (user)/            # 사용자 페이지 (라우트 그룹)
│   ├── console/           # 관리자 페이지
│   └── health/            # 헬스체크 엔드포인트
├── components/
│   ├── ui/                # Radix UI 기반 기본 컴포넌트 (shadcn/ui 스타일)
│   ├── user/              # 사용자 컴포넌트
│   ├── console/           # 관리자 컴포넌트
│   └── editor/            # Lexical 리치 텍스트 에디터
├── service/               # API 레이어 (React Query 훅)
│   ├── axios/             # Axios 인스턴스 (consoleAxios, userAxios)
│   ├── console/           # 관리자 API 훅
│   └── user/              # 사용자 API 훅
├── store/                 # Zustand 스토어
│   ├── common/            # 공통 스토어 (auth, board, site)
│   ├── console/           # 관리자 전용 스토어
│   └── user/              # 사용자 전용 스토어
└── i18n/                  # next-intl 설정
```

### 백엔드 구조
```
be/src/
├── controllers/           # 비즈니스 로직
├── models/                # Sequelize 모델
├── routes/                # Express 라우트 (v1 API)
└── middleware/            # 인증, 에러 처리, 보안
```

### API 라우트 패턴
- 사용자 엔드포인트: `/v1/board`, `/v1/comment`, `/v1/auth`, `/v1/main`
- 관리자 엔드포인트: `/v1/admin/[resource]`
- Swagger 문서: `/api-docs`

## 주요 컨벤션

### API 서비스 훅 (프론트엔드)
위치: `fe/src/service/[영역]/[도메인]/`
- `useGet[Domain].ts` - 단일 항목 조회
- `useGet[Domain]List.ts` - 목록 조회
- `usePost[Domain].ts` - 생성
- `usePut[Domain].ts` - 수정
- `useDel[Domain].ts` - 삭제

각 훅은 `@/types/api`의 타입 응답과 함께 React Query를 사용합니다.

### 상태 관리
- **서버 상태**: React Query (`@tanstack/react-query`)
- **클라이언트 상태**: `fe/src/store/`의 Zustand 스토어
- 인증 토큰은 `useAuthStore`에서 관리하며 Axios 인터셉터로 자동 갱신

### 다국어 지원
- 지원 언어: 한국어(ko), 영어(en), 일본어(ja), 중국어(zh)
- 메시지 파일: `fe/messages/[locale].json`
- `next-intl` 사용 (서버 사이드 설정)

### 컴포넌트 패턴
- UI 기본 컴포넌트는 Radix UI + Tailwind CSS 스타일링 사용
- Tailwind 클래스 병합 시 `cn()` 유틸리티 사용
- import 순서는 `simple-import-sort` ESLint 플러그인으로 강제

## 환경 변수

루트 `.env` 파일로 Docker 배포 제어:
- `APP_ENV`: `production` 또는 `development`
- `REACT_EXPOSE_PORT` / `NODE_EXPOSE_PORT`: 호스트 포트
- `API_URL`: 백엔드 API URL

프론트엔드 환경 변수는 `NEXT_PUBLIC_` 접두사 사용:
- `NEXT_PUBLIC_API_URL`: API 기본 URL
- `NEXT_PUBLIC_SITE_ID`: 사이트 식별자
- `NEXT_PUBLIC_ENCRYPTION_KEY`: 클라이언트 암호화 키

## 테스트

프론트엔드는 Jest + React Testing Library 사용:
- 테스트 파일: `**/*.test.ts(x)` 또는 `**/__tests__/**`
- 커버리지 임계값: branches, functions, lines, statements 각 50%
- 경로 별칭 `@/`는 `src/`로 매핑

## 위젯 렌더러 개발 공통 규칙

위젯(CultureLetter, IconCard 등) 구현 시 반드시 준수할 규칙입니다.

### 1. 디자인 준수
- 피그마 디자인을 **임의로 변경하지 말 것**
- 레이아웃, 간격, 색상, 폰트 등 디자인 원본 그대로 구현

### 2. 편집 기능 완전 연동
- 각 편집 영역의 `placeholder` 값을 실제 기본값과 정확히 일치시킬 것
- 텍스트 영역은 모두 `onDoubleClick → onElementSelect` 로 편집 연결
- 이미지/영상 영역은 업로드 팝업 + 뷰포트별 스타일 편집까지 연결
- 사용자가 세부 편집(폰트, 색상, 크기 등)을 충분히 할 수 있도록 `ElementEditor`에 필드 추가

### 3. 이미지 명칭 규칙
- 피그마 파일에 있는 원본 이미지명 사용 금지
- 이미지 key명은 **임의로 의미있게 지정**하고 반드시 이소정 님께 보고할 것
- 예시: `culture_letter_bg`, `culture_letter_logo`, `culture_letter_hero`
- 실제 이미지 파일은 이소정 님이 직접 등록
