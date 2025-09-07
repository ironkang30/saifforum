import { NextRequest, NextResponse } from 'next/server';
import { restaurants, Restaurant } from '@/data/restaurants';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const weighted = searchParams.get('weighted') === 'true';

    if (!category) {
      return NextResponse.json(
        { error: '카테고리가 필요합니다.' },
        { status: 400 }
      );
    }

    // 카테고리에 맞는 식당들 필터링
    const filteredRestaurants = restaurants.filter(
      (restaurant) => restaurant.category === category
    );

    if (filteredRestaurants.length === 0) {
      return NextResponse.json(
        { error: '해당 카테고리의 식당이 없습니다.' },
        { status: 404 }
      );
    }

    // 최근 추천 아이디 쿠키 읽기
    const cookiesIn = request.cookies;
    const recentCookie = cookiesIn.get('lp_recent_ids')?.value || '';
    const recentIds = recentCookie
      .split(',')
      .map((v) => parseInt(v, 10))
      .filter((v) => !Number.isNaN(v));

    let selectedRestaurant: Restaurant;

    if (weighted && filteredRestaurants.length > 1) {
      // 가중치: 기본 1, 최근 목록에 있으면 0.2로 낮춤
      const weights = filteredRestaurants.map((r) => (recentIds.includes(r.id) ? 0.2 : 1));
      const sum = weights.reduce((a, b) => a + b, 0);
      let rnd = Math.random() * sum;
      let idx = 0;
      for (; idx < filteredRestaurants.length; idx++) {
        rnd -= weights[idx];
        if (rnd <= 0) break;
      }
      selectedRestaurant = filteredRestaurants[Math.min(idx, filteredRestaurants.length - 1)];
    } else {
      // 균등 랜덤
      const randomIndex = Math.floor(Math.random() * filteredRestaurants.length);
      selectedRestaurant = filteredRestaurants[randomIndex];
    }

    // Google Maps 검색 링크 생성
    const googleMapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(selectedRestaurant.searchQuery)}`;

    const response = {
      restaurant: selectedRestaurant,
      googleMapsUrl,
    };

    // 최근 추천 아이디 쿠키 업데이트 (최신 5개 유지)
    const nextRecent = [selectedRestaurant.id, ...recentIds.filter((id) => id !== selectedRestaurant.id)].slice(0, 5);
    const res = NextResponse.json(response);
    res.cookies.set('lp_recent_ids', nextRecent.join(','), {
      httpOnly: false,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return res;
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
