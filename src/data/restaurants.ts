export interface Restaurant {
  id: number;
  name: string;
  category: '한식' | '중식' | '일식' | '양식' | '동남아' | '건강식' | '회식';
  specialty: string;
  searchQuery: string;
}

export const restaurants: Restaurant[] = [
  // 한식
  {
    id: 1,
    name: '서서울농협 두레우가',
    category: '한식',
    specialty: '한우갈비탕, 불고기전골, 차돌된장찌개',
    searchQuery: '서서울농협 두레우가 상암동'
  },
  {
    id: 2,
    name: '상암 구름산추어탕',
    category: '한식',
    specialty: '추어탕, 연잎보쌈',
    searchQuery: '상암 구름산추어탕'
  },
  {
    id: 3,
    name: '등촌샤브칼국수 상암점',
    category: '한식',
    specialty: '버섯샤브샤브, 초계국수',
    searchQuery: '등촌샤브칼국수 상암점'
  },
  {
    id: 4,
    name: '개미집',
    category: '한식',
    specialty: '낙곱새볶음, 낙지볶음',
    searchQuery: '개미집 상암동'
  },
  {
    id: 5,
    name: '옥된장',
    category: '한식',
    specialty: '소고기삼겹 된장전골, 바지락 된장전골, 수육무침',
    searchQuery: '옥된장 상암동'
  },
  {
    id: 6,
    name: '쭈꾸미도사',
    category: '한식',
    specialty: '대창쭈꾸미, 흑돼지쭈꾸미, 미나리삼겹쭈꾸미',
    searchQuery: '쭈꾸미도사 상암동'
  },
  {
    id: 7,
    name: '부벽루',
    category: '한식',
    specialty: '평양냉면, 비빔냉면, 들기름면',
    searchQuery: '부벽루 상암동'
  },
  {
    id: 8,
    name: '시골보쌈&감자옹심이',
    category: '한식',
    specialty: '점심특선, 돌솥밥순두부, 쭈꾸미비빔밥',
    searchQuery: '시골보쌈 감자옹심이 상암동'
  },
  {
    id: 9,
    name: '북창동순두부 상암MBC몰점',
    category: '한식',
    specialty: '북창동순두부',
    searchQuery: '북창동순두부 상암MBC몰점'
  },
  {
    id: 10,
    name: '콩면당',
    category: '한식',
    specialty: '콩국수',
    searchQuery: '콩면당 상암동'
  },
  {
    id: 11,
    name: '전주현대옥 상암DMC점',
    category: '한식',
    specialty: '콩나물국밥, 얼큰돼지국밥',
    searchQuery: '전주현대옥 상암DMC점'
  },
  {
    id: 12,
    name: '제주은희네해장국 상암MBC점',
    category: '한식',
    specialty: '해장국, 내장탕',
    searchQuery: '제주은희네해장국 상암MBC점'
  },
  {
    id: 13,
    name: '한촌설렁탕',
    category: '한식',
    specialty: '왕갈비탕, 설렁탕',
    searchQuery: '한촌설렁탕 상암동'
  },
  {
    id: 14,
    name: '김둘레순대국 상암4호점',
    category: '한식',
    specialty: '순대국, 뼈해장국, 순두부',
    searchQuery: '김둘레순대국 상암4호점'
  },
  {
    id: 15,
    name: '오봉집 상암점',
    category: '한식',
    specialty: '직화낙지, 보쌈, 쟁반막국수',
    searchQuery: '오봉집 상암점'
  },
  {
    id: 16,
    name: '새벽집',
    category: '한식',
    specialty: '해물순두부, 청국장',
    searchQuery: '새벽집 상암동'
  },
  {
    id: 17,
    name: '참솥 상암점',
    category: '한식',
    specialty: '연어솥밥, 곤드레솥밥, 고등어구이',
    searchQuery: '참솥 상암점'
  },
  {
    id: 18,
    name: '마이클돈까스 디지털큐브점',
    category: '한식',
    specialty: '두툼돈까스, 매운치즈돈까스, 치킨까스',
    searchQuery: '마이클돈까스 디지털큐브점'
  },
  {
    id: 19,
    name: '예쁜돼지',
    category: '한식',
    specialty: '순두부찌개, 된장국밥',
    searchQuery: '예쁜돼지 상암동'
  },
  {
    id: 20,
    name: '토종골',
    category: '한식',
    specialty: '제육쌈밥',
    searchQuery: '토종골 상암동'
  },
  {
    id: 21,
    name: '한씨네반상',
    category: '한식',
    specialty: '장조림버터비빔밥, 강된장비빔밥',
    searchQuery: '한씨네반상 상암동'
  },
  {
    id: 22,
    name: '새참당',
    category: '한식',
    specialty: '크리미생연어덮밥',
    searchQuery: '새참당 상암동'
  },
  {
    id: 23,
    name: '망향비빔국수 상암점',
    category: '한식',
    specialty: '비빔국수',
    searchQuery: '망향비빔국수 상암점'
  },
  {
    id: 24,
    name: '모모담',
    category: '한식',
    specialty: '우삼겹된장찌개',
    searchQuery: '모모담 상암동'
  },
  {
    id: 25,
    name: '사원옥',
    category: '한식',
    specialty: '오늘의백반',
    searchQuery: '사원옥 상암동'
  },
  {
    id: 26,
    name: '남파랑국밥 상암본점',
    category: '한식',
    specialty: '고기국밥',
    searchQuery: '남파랑국밥 상암본점'
  },

  // 중식
  {
    id: 27,
    name: '서룡',
    category: '중식',
    specialty: '된장짬뽕, XO볶음밥',
    searchQuery: '서룡 상암동'
  },
  {
    id: 28,
    name: '더차이 상암 디지털큐브점',
    category: '중식',
    specialty: '간짜장, 마파두부밥',
    searchQuery: '더차이 상암 디지털큐브점'
  },
  {
    id: 29,
    name: '추천해꼬막짬뽕',
    category: '중식',
    specialty: '꼬막짬뽕, 냉짬뽕',
    searchQuery: '추천해꼬막짬뽕 상암동'
  },
  {
    id: 30,
    name: '마라로 세끼',
    category: '중식',
    specialty: '마라탕, 꿔바로우',
    searchQuery: '마라로 세끼 상암동'
  },
  {
    id: 31,
    name: '이화원',
    category: '중식',
    specialty: '가지덮밥, 차돌짬뽕',
    searchQuery: '이화원 상암동'
  },
  {
    id: 32,
    name: '란주우육면',
    category: '중식',
    specialty: '우육면',
    searchQuery: '란주우육면 상암동'
  },
  {
    id: 33,
    name: '피슈마라홍탕',
    category: '중식',
    specialty: '마라홍탕, 꿔바로우',
    searchQuery: '피슈마라홍탕 상암동'
  },
  {
    id: 34,
    name: '오한수우육면가',
    category: '중식',
    specialty: '우육탕면, 군만두',
    searchQuery: '오한수우육면가 상암동'
  },
  {
    id: 35,
    name: '중화백반 상암점',
    category: '중식',
    specialty: '중화국밥, 황태 백짬뽕',
    searchQuery: '중화백반 상암점'
  },
  {
    id: 36,
    name: '셰셰',
    category: '중식',
    specialty: '스지 우육탕면, 삼선차돌짬뽕',
    searchQuery: '셰셰 상암동'
  },

  // 일식
  {
    id: 37,
    name: '무다이 상암직영점',
    category: '일식',
    specialty: '돈코츠 라멘, 마제소바',
    searchQuery: '무다이 상암직영점'
  },
  {
    id: 38,
    name: '하루앤소쿠 돈까스 상암점',
    category: '일식',
    specialty: '하루카츠, 치즈카츠',
    searchQuery: '하루앤소쿠 돈까스 상암점'
  },
  {
    id: 39,
    name: '오카야 상암본점',
    category: '일식',
    specialty: '사케동, 카이센동',
    searchQuery: '오카야 상암본점'
  },
  {
    id: 40,
    name: '김영섭 초밥',
    category: '일식',
    specialty: '김영섭초밥',
    searchQuery: '김영섭 초밥 상암동'
  },
  {
    id: 41,
    name: '가쯔레쯔',
    category: '일식',
    specialty: '냉모밀 정식, 얼큰돈까스치즈나베',
    searchQuery: '가쯔레쯔 상암동'
  },
  {
    id: 42,
    name: '시카노이에 상암점',
    category: '일식',
    specialty: '버터간장새우장밥, 토마토치즈돈까스',
    searchQuery: '시카노이에 상암점'
  },
  {
    id: 43,
    name: '옥자회관',
    category: '일식',
    specialty: '등심돈까츠, 치즈돈까츠',
    searchQuery: '옥자회관 상암동'
  },
  {
    id: 44,
    name: '옥소반',
    category: '일식',
    specialty: '샤브샤브, 스키야키',
    searchQuery: '옥소반 상암동'
  },
  {
    id: 45,
    name: '양산도 상암점',
    category: '일식',
    specialty: '히츠마부시',
    searchQuery: '양산도 상암점'
  },
  {
    id: 46,
    name: '스시앤도시락',
    category: '일식',
    specialty: '런치세트 초밥',
    searchQuery: '스시앤도시락 상암동'
  },
  {
    id: 47,
    name: '식락',
    category: '일식',
    specialty: '연어덮밥, 장어덮밥',
    searchQuery: '식락 상암동'
  },
  {
    id: 48,
    name: '돈까스브로스 상암DMC점',
    category: '일식',
    specialty: '브로스돈까스, 치즈까스',
    searchQuery: '돈까스브로스 상암DMC점'
  },
  {
    id: 49,
    name: '신야텐야 상암DMC점',
    category: '일식',
    specialty: '텐동',
    searchQuery: '신야텐야 상암DMC점'
  },
  {
    id: 50,
    name: '토모다찌',
    category: '일식',
    specialty: '토모다찌라멘',
    searchQuery: '토모다찌 상암동'
  },

  // 양식
  {
    id: 51,
    name: '인칸토 키친',
    category: '양식',
    specialty: '파스타, 리조또',
    searchQuery: '인칸토 키친 상암동'
  },
  {
    id: 52,
    name: 'KFC 상암DMC',
    category: '양식',
    specialty: '징거타워버거',
    searchQuery: 'KFC 상암DMC'
  },
  {
    id: 53,
    name: '파스타공작소',
    category: '양식',
    specialty: '생면 파스타',
    searchQuery: '파스타공작소 상암동'
  },
  {
    id: 54,
    name: '서울미트볼 상암점',
    category: '양식',
    specialty: '그레이비 미트볼',
    searchQuery: '서울미트볼 상암점'
  },
  {
    id: 55,
    name: '피제리아스너그',
    category: '양식',
    specialty: '스너그 클라시카, 라자냐',
    searchQuery: '피제리아스너그 상암동'
  },
  {
    id: 56,
    name: '브리즈번버거앤비어 상암DMC점',
    category: '양식',
    specialty: '치폴레 해쉬 버거',
    searchQuery: '브리즈번버거앤비어 상암DMC점'
  },
  {
    id: 57,
    name: '베어스타코',
    category: '양식',
    specialty: '타코, 부리또',
    searchQuery: '베어스타코 상암동'
  },
  {
    id: 58,
    name: '가정경양 상암',
    category: '양식',
    specialty: '돈까스, 함박스테이크',
    searchQuery: '가정경양 상암'
  },
  {
    id: 59,
    name: '크라이치즈버거 상암점',
    category: '양식',
    specialty: '치즈버거',
    searchQuery: '크라이치즈버거 상암점'
  },
  {
    id: 60,
    name: '핀사로 상암',
    category: '양식',
    specialty: '칼쪼네, 샐러드파스타',
    searchQuery: '핀사로 상암'
  },
  {
    id: 61,
    name: '휴휴이탈리',
    category: '양식',
    specialty: '알리오올리오, 베이컨크림깔조네',
    searchQuery: '휴휴이탈리 상암동'
  },
  {
    id: 62,
    name: '어글리버거',
    category: '양식',
    specialty: '어글리버거',
    searchQuery: '어글리버거 상암동'
  },
  {
    id: 63,
    name: '바스버거 상암DMC점',
    category: '양식',
    specialty: '와사비마요 쉬림프버거',
    searchQuery: '바스버거 상암DMC점'
  },
  {
    id: 64,
    name: '최다이닝',
    category: '양식',
    specialty: '대하 홍게살 로제 파스타',
    searchQuery: '최다이닝 상암동'
  },
  {
    id: 65,
    name: '헤비스테이크 상암DMC점',
    category: '양식',
    specialty: '비프스테이크',
    searchQuery: '헤비스테이크 상암DMC점'
  },
  {
    id: 66,
    name: '패스포트 상암DMC점',
    category: '양식',
    specialty: '런던 본메로우버터 함박스테이크',
    searchQuery: '패스포트 상암DMC점'
  },

  // 동남아
  {
    id: 67,
    name: '온타이키친',
    category: '동남아',
    specialty: '팟타이, 뿌님 팟 퐁커리',
    searchQuery: '온타이키친 상암동'
  },
  {
    id: 68,
    name: '하노이의아침 상암점',
    category: '동남아',
    specialty: '쇠고기쌀국수',
    searchQuery: '하노이의아침 상암점'
  },
  {
    id: 69,
    name: '포36거리 상암점',
    category: '동남아',
    specialty: '소고기쌀국수',
    searchQuery: '포36거리 상암점'
  },
  {
    id: 70,
    name: '미분당 상암DMC점',
    category: '동남아',
    specialty: '차돌박이 쌀국수',
    searchQuery: '미분당 상암DMC점'
  },
  {
    id: 71,
    name: '동남쌀국 상암점',
    category: '동남아',
    specialty: '똠얌쌀국수',
    searchQuery: '동남쌀국 상암점'
  },
  {
    id: 72,
    name: '일포베트남쌀국수',
    category: '동남아',
    specialty: '양지차돌쌀국수',
    searchQuery: '일포베트남쌀국수 상암동'
  },
  {
    id: 73,
    name: '팬앤포',
    category: '동남아',
    specialty: '양지쌀국수',
    searchQuery: '팬앤포 상암동'
  },
  {
    id: 74,
    name: '드렁킨타이 상암점',
    category: '동남아',
    specialty: '새우 팟타이',
    searchQuery: '드렁킨타이 상암점'
  },
  {
    id: 75,
    name: '포머이쌀국수 상암점',
    category: '동남아',
    specialty: '닭 쌀국수',
    searchQuery: '포머이쌀국수 상암점'
  },
  {
    id: 76,
    name: '쏨땀우돈',
    category: '동남아',
    specialty: '랭쌥',
    searchQuery: '쏨땀우돈 상암동'
  },
  {
    id: 77,
    name: '아시아남동',
    category: '동남아',
    specialty: '똠얌쌀국수',
    searchQuery: '아시아남동 상암동'
  },
  {
    id: 78,
    name: '상암쌀국수',
    category: '동남아',
    specialty: '퍼보타이',
    searchQuery: '상암쌀국수'
  },
  {
    id: 79,
    name: '미스사이공 상암DMC점',
    category: '동남아',
    specialty: '소고기쌀국수',
    searchQuery: '미스사이공 상암DMC점'
  },
  {
    id: 80,
    name: '강남쌀국수 상암DMC점',
    category: '동남아',
    specialty: '소고기폭탄쌀국수',
    searchQuery: '강남쌀국수 상암DMC점'
  },

  // 건강식
  {
    id: 81,
    name: '포케올데이 상암점',
    category: '건강식',
    specialty: '포케',
    searchQuery: '포케올데이 상암점'
  },
  {
    id: 82,
    name: '서브웨이 상암점',
    category: '건강식',
    specialty: '샌드위치, 샐러드',
    searchQuery: '서브웨이 상암점'
  },
  {
    id: 83,
    name: '크리스피프레시 상암MBC점',
    category: '건강식',
    specialty: '하이프로틴 콥샐러드',
    searchQuery: '크리스피프레시 상암MBC점'
  },
  {
    id: 84,
    name: '리우키친',
    category: '건강식',
    specialty: '샐러드',
    searchQuery: '리우키친 상암동'
  },
  {
    id: 85,
    name: '프레퍼스 다이어트 푸드 상암점',
    category: '건강식',
    specialty: '비프샐러드파스타, 치킨플레이트',
    searchQuery: '프레퍼스 다이어트 푸드 상암점'
  },
  {
    id: 86,
    name: '웰믹스 상암DMC점',
    category: '건강식',
    specialty: '믹스볼, 믹스랩',
    searchQuery: '웰믹스 상암DMC점'
  },
  {
    id: 87,
    name: '샐러디 상암DMC점',
    category: '건강식',
    specialty: '탄단지 샐러드',
    searchQuery: '샐러디 상암DMC점'
  },
  {
    id: 88,
    name: '아보 상암점',
    category: '건강식',
    specialty: '연어라이스, 치킨샐러드',
    searchQuery: '아보 상암점'
  },
  {
    id: 89,
    name: '마이쥬스 상암점',
    category: '건강식',
    specialty: '샐러드, ABC주스',
    searchQuery: '마이쥬스 상암점'
  },
  {
    id: 90,
    name: '보울레시피',
    category: '건강식',
    specialty: '포케, 그릭요거트',
    searchQuery: '보울레시피 상암동'
  },
  {
    id: 91,
    name: '퍼플보울',
    category: '건강식',
    specialty: '아사이볼',
    searchQuery: '퍼플보울 상암동'
  },
  {
    id: 92,
    name: '청그릭',
    category: '건강식',
    specialty: '그릭요거트',
    searchQuery: '청그릭 상암동'
  },
  {
    id: 93,
    name: '그린하이샐러드',
    category: '건강식',
    specialty: '닭가슴살샐러드',
    searchQuery: '그린하이샐러드 상암동'
  },

  // 회식
  {
    id: 94,
    name: '목로',
    category: '회식',
    specialty: '4인 Set, 갈비살, 살치살',
    searchQuery: '목로 상암동'
  },
  {
    id: 95,
    name: '구퉁이 상암점',
    category: '회식',
    specialty: '소꽃갈비한판, 소갈비살',
    searchQuery: '구퉁이 상암점'
  },
  {
    id: 96,
    name: '상암일미락',
    category: '회식',
    specialty: '발효목살, 발효가브리살, 통삼겹살',
    searchQuery: '상암일미락'
  },
  {
    id: 97,
    name: '월화고기 상암 직영1호점',
    category: '회식',
    specialty: '삼겹살, 목살, 오겹살',
    searchQuery: '월화고기 상암 직영1호점'
  },
  {
    id: 98,
    name: '동신화로',
    category: '회식',
    specialty: '숙성 통목살, 숙성 통삼겹',
    searchQuery: '동신화로 상암동'
  },
  {
    id: 99,
    name: '장흥집 상암점',
    category: '회식',
    specialty: '미나리냉삼, 미나리냉목살',
    searchQuery: '장흥집 상암점'
  },
  {
    id: 100,
    name: '한상가득완솥뚜껑',
    category: '회식',
    specialty: '삼겹살, 목살',
    searchQuery: '한상가득완솥뚜껑 상암동'
  },
  {
    id: 101,
    name: '몽미 상암본점',
    category: '회식',
    specialty: '이베리코목살, 이베리코갈비살, 한돈삼겹살',
    searchQuery: '몽미 상암본점'
  },
  {
    id: 102,
    name: '족발야시장 상암점',
    category: '회식',
    specialty: '족발',
    searchQuery: '족발야시장 상암점'
  },
  {
    id: 103,
    name: '구리돌곱창',
    category: '회식',
    specialty: '모듬구이, 소곱창, 소대창, 소막창',
    searchQuery: '구리돌곱창 상암동'
  },
  {
    id: 104,
    name: '아고야 상암본점',
    category: '회식',
    specialty: 'S코스, 스테이크덮밥',
    searchQuery: '아고야 상암본점'
  },
  {
    id: 105,
    name: '오소오소 상암점',
    category: '회식',
    specialty: '소고기 한판, 특선 생불고기, 갈비탕',
    searchQuery: '오소오소 상암점'
  },
  {
    id: 106,
    name: '매드포갈릭 상암MBC점',
    category: '회식',
    specialty: '런치세트',
    searchQuery: '매드포갈릭 상암MBC점'
  },
  {
    id: 107,
    name: '포르투7 상암MBC점',
    category: '회식',
    specialty: '와규 치즈폭포 스테이크',
    searchQuery: '포르투7 상암MBC점'
  },
  {
    id: 108,
    name: '미증유',
    category: '회식',
    specialty: '라자냐, 파피요트',
    searchQuery: '미증유 상암동'
  }
];
