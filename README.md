# 상암동 런치픽 🍽️

상암동 직장인을 위한 점심 메뉴 추천 웹앱입니다.

## 기능

- **카테고리별 추천**: 한식, 중식, 일식, 분식, 카페 중에서 선택
- **랜덤 추천**: 선택한 카테고리에서 랜덤하게 식당 추천
- **Google Maps 연동**: 추천된 식당의 위치를 Google Maps에서 확인 가능
- **반응형 디자인**: 모바일과 데스크톱에서 모두 사용 가능

## 기술 스택

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Styling**: Tailwind CSS

## 설치 및 실행

### 1. 의존성 설치

```bash
npm install
```

### 2. 개발 서버 실행

```bash
npm run dev
```

### 3. 브라우저에서 확인

[http://localhost:3000](http://localhost:3000)에서 애플리케이션을 확인할 수 있습니다.

## 프로젝트 구조

```
src/
├── app/
│   ├── api/
│   │   └── suggest/
│   │       └── route.ts          # 추천 API 엔드포인트
│   ├── globals.css               # 전역 스타일
│   ├── layout.tsx                # 루트 레이아웃
│   └── page.tsx                  # 홈페이지
├── data/
│   └── restaurants.ts            # 식당 데이터
```

## API 엔드포인트

### GET /api/suggest

카테고리별 식당을 추천합니다.

**Query Parameters:**
- `category`: 추천할 카테고리 (한식, 중식, 일식, 양식, 동남아, 건강식, 회식)
- `weighted` (optional): `true|false` 최근 추천된 항목의 확률을 낮추는 가중치 적용 여부 (기본 true)

**Response:**
```json
{
  "restaurant": {
    "id": 1,
    "name": "상암동 김치찌개",
    "category": "한식",
    "specialty": "한우갈비탕, 불고기전골",
    "searchQuery": "상암동 김치찌개"
  },
  "googleMapsUrl": "https://www.google.com/maps/search/%EA%B5%AC%EA%B8%80%20%EA%B2%80%EC%83%89%20%EC%BF%BC%EB%A6%AC"
}
```

## 사용법

1. 웹페이지에 접속합니다.
2. 원하는 음식 카테고리를 선택합니다.
3. "오늘 뭐 먹지? 🍽️" 버튼을 클릭합니다.
4. 추천된 식당을 확인하고 Google Maps에서 위치를 확인할 수 있습니다.
5. 다른 추천을 원하면 "다른 추천 받기" 버튼을 클릭합니다.
6. (선택) "최근 추천 가중치 적용" 토글을 켜면 직전에 추천된 항목들이 다음 추천에서 나올 확률이 낮아집니다.

## 개발

### 새로운 식당 추가

`src/data/restaurants.ts` 파일에 새로운 식당 정보를 추가할 수 있습니다.

```typescript
{
  id: 21,
  name: '새로운 식당',
  category: '한식',
  priceRange: '보통',
  searchQuery: '새로운 식당 상암동'
}
```

### 스타일 수정

Tailwind CSS 클래스를 사용하여 스타일을 수정할 수 있습니다. 주요 색상은 오렌지/레드 그라데이션을 사용합니다.

## 라이선스

MIT License