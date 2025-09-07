'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Restaurant, restaurants } from '@/data/restaurants';

const categories = [
  { name: '한식', emoji: '🍚' },
  { name: '중식', emoji: '🥢' },
  { name: '일식', emoji: '🍣' },
  { name: '양식', emoji: '🍝' },
  { name: '동남아', emoji: '🌶️' },
  { name: '건강식', emoji: '🥗' },
  { name: '회식', emoji: '🍻' }
] as const;
type Category = typeof categories[number]['name'];

interface SuggestionResponse {
  restaurant: Restaurant;
  googleMapsUrl: string;
}

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [suggestion, setSuggestion] = useState<SuggestionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'home' | 'hamster' | 'restaurants'>('home');
  const [useWeighted, setUseWeighted] = useState<boolean>(true);
  
  // 채팅 상태 (햄스터 뷰)
  interface ChatMessage {
    role: 'user' | 'hamster';
    text: string;
  }
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { role: 'hamster', text: '점심 드시러 가시죠!' }
  ]);
  const [chatInput, setChatInput] = useState<string>('뭐드실래요?');
  
  // 식당 목록 필터 state
  const [selectedFilterCategory, setSelectedFilterCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // 새로운 메시지가 추가될 때 하단으로 스크롤
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [chatMessages]);

  const getRandomSpecialtyItem = (): string => {
    // 무작위 식당 선택 후 대표메뉴 문자열에서 아이템 하나 선택
    const randomRestaurant = restaurants[Math.floor(Math.random() * restaurants.length)];
    const items = randomRestaurant.specialty
      .split(',')
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
    if (items.length === 0) return randomRestaurant.specialty;
    return items[Math.floor(Math.random() * items.length)];
  };

  const handleChatSend = () => {
    const trimmed = chatInput.trim();
    if (!trimmed) return;
    // 사용자 메시지 추가
    setChatMessages((prev) => [...prev, { role: 'user', text: trimmed }]);
    setChatInput('');
    // 햄스터 응답 (약간의 지연 후)
    setTimeout(() => {
      const answer = getRandomSpecialtyItem();
      setChatMessages((prev) => [
        ...prev,
        { role: 'hamster', text: `오늘은 ${answer} 어떠세요?` }
      ]);
    }, 500);
  };

  const handleSuggest = async () => {
    if (!selectedCategory) {
      setError('카테고리를 선택해주세요.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/suggest?category=${selectedCategory}&weighted=${useWeighted}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '추천을 가져오는데 실패했습니다.');
      }

      setSuggestion(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const getSpecialtyColor = (category: string) => {
    switch (category) {
      case '한식':
        return 'text-red-600 bg-red-100';
      case '중식':
        return 'text-orange-600 bg-orange-100';
      case '일식':
        return 'text-blue-600 bg-blue-100';
      case '양식':
        return 'text-purple-600 bg-purple-100';
      case '동남아':
        return 'text-green-600 bg-green-100';
      case '건강식':
        return 'text-emerald-600 bg-emerald-100';
      case '회식':
        return 'text-pink-600 bg-pink-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const renderHomeView = () => (
    <>
      {/* 카테고리 선택 */}
      <div className="max-w-6xl mx-auto mb-8 sm:mb-12">
        <div className="text-center mb-8 sm:mb-10">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-800 mb-3">
            카테고리를 선택해주세요
          </h2>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
            원하는 음식 종류를 선택하면 맞춤 추천을 받을 수 있습니다
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
          {categories.map((category) => (
            <button
              key={category.name}
              onClick={() => setSelectedCategory(category.name)}
              className={`group relative p-4 sm:p-5 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                selectedCategory === category.name
                  ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/25 scale-105'
                  : 'bg-white/80 backdrop-blur-sm text-slate-700 hover:bg-white hover:shadow-lg border border-white/20 hover:bg-blue-50'
              }`}
            >
              <div className="flex flex-col items-center space-y-2">
                <div className={`text-2xl sm:text-3xl transition-transform duration-300 ${
                  selectedCategory === category.name ? 'scale-110' : 'group-hover:scale-110'
                }`}>
                  {category.emoji}
                </div>
                <div className="text-xs sm:text-sm font-medium leading-tight">
                  {category.name}
                </div>
              </div>
              {selectedCategory === category.name && (
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-400/20 to-indigo-500/20 animate-pulse"></div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 추천 버튼 */}
      <div className="text-center mb-8 sm:mb-12">
        <div className="flex items-center justify-center gap-3 mb-4">
          <label className="flex items-center gap-2 text-sm sm:text-base text-slate-700 bg-white/70 px-3 py-2 rounded-xl border border-white/40 shadow-sm">
            <input type="checkbox" checked={useWeighted} onChange={(e) => setUseWeighted(e.target.checked)} className="accent-blue-600 w-4 h-4" />
            <span>최근 추천 가중치 적용</span>
          </label>
        </div>
        <button
          onClick={handleSuggest}
          disabled={loading || !selectedCategory}
          className={`group relative px-8 sm:px-12 py-4 sm:py-5 rounded-2xl font-bold text-base sm:text-lg transition-all duration-300 transform ${
            loading || !selectedCategory
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700 shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95'
          }`}
        >
          <div className="flex items-center justify-center gap-3">
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>추천 중...</span>
              </>
            ) : (
              <>
                <span>🍽️</span>
                <span>오늘 뭐 먹지?</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </>
            )}
          </div>
          {!loading && selectedCategory && (
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400/20 via-indigo-400/20 to-purple-400/20 animate-pulse"></div>
          )}
        </button>
      </div>

      {/* 에러 메시지 */}
      {error && (
        <div className="max-w-md mx-auto mb-6 p-4 sm:p-5 bg-red-50/80 backdrop-blur-sm border border-red-200 text-red-700 rounded-2xl text-center shadow-lg">
          <div className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        </div>
      )}

      {/* 추천 결과 */}
      {suggestion && (
        <div className="max-w-lg mx-auto">
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-6 sm:p-8 transform transition-all duration-500 hover:scale-105 border border-white/20">
            <div className="text-center">
              <div className="mb-6">
                <h3 className="text-xl sm:text-2xl font-bold text-slate-800 mb-3 leading-tight">
                  {suggestion.restaurant.name}
                </h3>
                <div className="flex flex-wrap justify-center items-center gap-2 mb-4">
                  <span className="px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border border-blue-200">
                    {suggestion.restaurant.category}
                  </span>
                  <span className={`px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold ${getSpecialtyColor(suggestion.restaurant.category)} border`}>
                    대표메뉴
                  </span>
                </div>
                <div className="text-sm sm:text-base text-slate-600 leading-relaxed bg-slate-50 rounded-xl p-4 border border-slate-100">
                  {suggestion.restaurant.specialty}
                </div>
              </div>
              <a
                href={suggestion.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <span>Google Maps에서 보기</span>
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* 다시 추천받기 버튼 */}
      {suggestion && (
        <div className="text-center mt-8">
          <button
            onClick={() => {
              setSuggestion(null);
              setError(null);
            }}
            className="px-6 py-3 text-slate-600 hover:text-slate-800 transition-all duration-300 font-medium hover:bg-white/50 rounded-xl backdrop-blur-sm"
          >
            다른 추천 받기
          </button>
        </div>
      )}
    </>
  );

  const renderHamsterView = () => (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-6 sm:p-8 lg:p-12 border border-white/20">
        {/* 카카오톡 스타일 채팅 UI */}
        <div className="flex flex-col h-[620px] max-h-[75vh] bg-sky-50 rounded-2xl border border-sky-100 shadow-inner overflow-hidden">
          {/* 상단 영역 */}
          <div className="px-4 py-4 bg-white/80 border-b border-white/60 flex items-center gap-3">
            <div className="font-extrabold text-slate-800 text-xl sm:text-2xl">햄스터 주임</div>
            <div className="ml-auto text-xs sm:text-sm text-slate-500">상담 중</div>
          </div>
          {/* 메시지 리스트 */}
          <div className="flex-1 p-5 sm:p-6 overflow-y-auto space-y-5">
            {chatMessages.map((msg, idx) => (
              <div key={idx} className={`flex items-end gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'hamster' && (
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden ring-2 ring-white/70 shadow flex-shrink-0">
                    <Image src="/a2.png" alt="햄스터 주임" fill className="object-cover" />
                  </div>
                )}
                <div className={`relative max-w-[78%] sm:max-w-[74%] rounded-2xl px-6 py-4 text-lg sm:text-xl leading-relaxed shadow ${
                  msg.role === 'user'
                    ? 'bg-yellow-300 text-slate-900 rounded-br-sm'
                    : 'bg-white text-slate-800 border border-slate-200 rounded-bl-sm'
                }`}>
                  {msg.text}
                  {msg.role === 'hamster' ? (
                    <span className="absolute -left-1.5 bottom-3 w-3 h-3 bg-white border-l border-b border-slate-200 rotate-45"></span>
                  ) : (
                    <span className="absolute -right-1.5 bottom-3 w-3 h-3 bg-yellow-300 rotate-45"></span>
                  )}
                </div>
                {msg.role === 'user' && (
                  <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden ring-2 ring-white/70 shadow flex-shrink-0">
                    <Image src="/a1.png" alt="나" fill className="object-cover" />
                  </div>
                )}
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
          {/* 입력 영역 */}
          <div className="p-3 bg-white/80 border-t border-white/60">
            <div className="flex items-center gap-2">
              <input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleChatSend(); }}
                placeholder="메시지를 입력하세요"
                className="flex-1 px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
              <button
                onClick={handleChatSend}
                className="px-5 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // 필터링된 식당 목록 계산
  const filteredRestaurants = restaurants.filter(restaurant => {
    const matchesCategory = !selectedFilterCategory || restaurant.category === selectedFilterCategory;
    const matchesSearch = !searchQuery || 
      restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const renderRestaurantsView = () => (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-8 sm:mb-12">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800 mb-4">
          전체 식당 목록
        </h2>
        <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto">
          상암동의 모든 맛집을 한눈에 확인하고 원하는 곳을 찾아보세요
        </p>
      </div>

      {/* 카테고리 선택 */}
      <div className="max-w-6xl mx-auto mb-8 sm:mb-12">
        <div className="text-center mb-8 sm:mb-10">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-800 mb-3">
            카테고리를 선택해주세요
          </h2>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
            원하는 음식 종류를 선택하면 해당 카테고리의 식당들을 볼 수 있습니다
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2">
          {/* 전체 버튼 */}
          <button
            onClick={() => setSelectedFilterCategory(null)}
            className={`group relative px-3 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 ${
              !selectedFilterCategory
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 scale-105'
                : 'bg-white/80 backdrop-blur-sm text-slate-700 hover:bg-white hover:shadow-sm border border-white/20 hover:bg-blue-50'
            }`}
          >
            <div className="flex items-center space-x-1.5">
              <div className={`text-sm transition-transform duration-300 ${
                !selectedFilterCategory ? 'scale-110' : 'group-hover:scale-110'
              }`}>
                🍽️
              </div>
              <div className="text-xs font-medium">
                전체
              </div>
            </div>
            {!selectedFilterCategory && (
              <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-blue-400/20 to-indigo-500/20 animate-pulse"></div>
            )}
          </button>
          
          {/* 카테고리 버튼들 */}
          {categories.map((category) => (
            <button
              key={category.name}
              onClick={() => setSelectedFilterCategory(category.name)}
              className={`group relative px-3 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 ${
                selectedFilterCategory === category.name
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 scale-105'
                  : 'bg-white/80 backdrop-blur-sm text-slate-700 hover:bg-white hover:shadow-sm border border-white/20 hover:bg-blue-50'
              }`}
            >
              <div className="flex items-center space-x-1.5">
                <div className={`text-sm transition-transform duration-300 ${
                  selectedFilterCategory === category.name ? 'scale-110' : 'group-hover:scale-110'
                }`}>
                  {category.emoji}
                </div>
                <div className="text-xs font-medium">
                  {category.name}
                </div>
              </div>
              {selectedFilterCategory === category.name && (
                <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-blue-400/20 to-indigo-500/20 animate-pulse"></div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 검색 */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-8 border border-white/20">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-semibold text-slate-700 mb-2">검색</label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="식당명, 메뉴로 검색..."
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
            />
          </div>
        </div>
        
        {/* 결과 개수 */}
        <div className="mt-4 text-center">
          <span className="text-slate-600">
            총 <span className="font-bold text-blue-600">{filteredRestaurants.length}</span>개의 식당이 있습니다
          </span>
        </div>
      </div>

      {/* 식당 목록 */}
      {filteredRestaurants.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-slate-700 mb-2">검색 결과가 없습니다</h3>
          <p className="text-slate-500">다른 검색어나 카테고리를 시도해보세요</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredRestaurants.map((restaurant) => (
            <div key={restaurant.id} className="group bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl p-5 sm:p-6 transition-all duration-300 transform hover:scale-105 border border-white/20">
              <div className="mb-4">
                <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-3 leading-tight group-hover:text-blue-600 transition-colors duration-300">
                  {restaurant.name}
                </h3>
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border border-blue-200">
                    {restaurant.category}
                  </span>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getSpecialtyColor(restaurant.category)} border`}>
                    대표메뉴
                  </span>
                </div>
                <div className="text-sm text-slate-600 leading-relaxed bg-slate-50 rounded-xl p-3 border border-slate-100">
                  {restaurant.specialty}
                </div>
              </div>
              <a
                href={`https://www.google.com/maps/search/${encodeURIComponent(restaurant.searchQuery)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group/link inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors duration-300"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <span>위치 보기</span>
                <svg className="w-3 h-3 group-hover/link:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* 헤더 */}
        <div className="relative mb-8 sm:mb-12">
          <div className="text-center">
            <div className="inline-block">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-2 sm:mb-4 leading-tight">
                <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl bg-gradient-to-r from-slate-600 via-slate-700 to-slate-800 bg-clip-text text-transparent">
                  SANGAM-DONG
                </span>
                <br />
                <span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient bg-[length:200%_200%]">
                  LUNCH PICK
                </span>
              </h1>
              <div className="w-24 sm:w-32 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 mx-auto rounded-full mb-4 animate-gradient bg-[length:200%_200%]"></div>
            </div>
            <p className="text-sm sm:text-base md:text-lg text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed">
              상암동 직장인을 위한 점심 메뉴 추천 서비스
            </p>
          </div>

          {/* 햄버거 메뉴 */}
          <div className="absolute top-0 right-0">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-3 rounded-2xl bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-white/20"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* 드롭다운 메뉴 */}
            {isMenuOpen && (
              <div className="absolute right-0 mt-3 w-56 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 z-50 overflow-hidden">
                <div className="py-2">
                  <button
                    onClick={() => {
                      setCurrentView('home');
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left px-6 py-4 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 flex items-center gap-3 group"
                  >
                    <span className="text-xl">🏠</span>
                    <span className="font-medium text-slate-700 group-hover:text-blue-700">홈</span>
                  </button>
                  <button
                    onClick={() => {
                      setCurrentView('hamster');
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left px-6 py-4 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 flex items-center gap-3 group"
                  >
                    <span className="text-xl">🐹</span>
                    <span className="font-medium text-slate-700 group-hover:text-blue-700 whitespace-nowrap">햄스터에게 물어보기</span>
                  </button>
                  <button
                    onClick={() => {
                      setCurrentView('restaurants');
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left px-6 py-4 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 flex items-center gap-3 group"
                  >
                    <span className="text-xl">🍽️</span>
                    <span className="font-medium text-slate-700 group-hover:text-blue-700">전체식당보기</span>
                  </button>
                  <a
                    href="/board"
                    className="w-full text-left px-6 py-4 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 flex items-center gap-3 group"
                  >
                    <span className="text-xl">📝</span>
                    <span className="font-medium text-slate-700 group-hover:text-blue-700">게시판</span>
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 메인 콘텐츠 */}
        {currentView === 'home' && renderHomeView()}
        {currentView === 'hamster' && renderHamsterView()}
        {currentView === 'restaurants' && renderRestaurantsView()}
      </div>
    </div>
  );
}