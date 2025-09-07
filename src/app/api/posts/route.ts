import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// HTML 이스케이프 함수 (XSS 방지)
function escapeHtml(text: string): string {
  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

// 게시글 유효성 검사
function validatePost(data: unknown): { isValid: boolean; error?: string } {
  if (!data || typeof data !== 'object') {
    return { isValid: false, error: '유효하지 않은 데이터입니다.' };
  }
  
  const postData = data as { title?: unknown; content?: unknown; category?: unknown; author?: unknown };
  
  if (!postData.title || typeof postData.title !== 'string' || postData.title.trim().length === 0) {
    return { isValid: false, error: '제목은 필수입니다.' };
  }
  if (postData.title.length > 100) {
    return { isValid: false, error: '제목은 100자 이하여야 합니다.' };
  }
  if (!postData.content || typeof postData.content !== 'string' || postData.content.trim().length === 0) {
    return { isValid: false, error: '내용은 필수입니다.' };
  }
  if (postData.content.length > 2000) {
    return { isValid: false, error: '내용은 2000자 이하여야 합니다.' };
  }
  if (!postData.category || typeof postData.category !== 'string') {
    return { isValid: false, error: '카테고리는 필수입니다.' };
  }
  if (!postData.author || typeof postData.author !== 'string') {
    return { isValid: false, error: '작성자는 필수입니다.' };
  }
  return { isValid: true };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const sortBy = searchParams.get('sortBy') || 'date';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // 검색 조건 구성
    const where: any = {};
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } }
      ];
    }
    
    if (category) {
      where.category = category;
    }

    // 정렬 조건 구성
    const orderBy: any = {};
    switch (sortBy) {
      case 'views':
        orderBy.views = sortOrder;
        break;
      case 'likes':
        orderBy.likes = sortOrder;
        break;
      case 'date':
      default:
        orderBy.createdAt = sortOrder;
        break;
    }

    // 총 게시글 수 조회
    const totalPosts = await prisma.post.count({ where });

    // 게시글 목록 조회 (댓글 포함)
    const posts = await prisma.post.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        comments: {
          orderBy: { createdAt: 'asc' }
        }
      }
    });

    // 응답 형식 맞추기
    const formattedPosts = posts.map(post => ({
      id: post.id,
      title: post.title,
      content: post.content,
      author: post.author,
      category: post.category,
      views: post.views,
      likes: post.likes,
      comments: post.comments.map(comment => ({
        id: comment.id,
        author: comment.author,
        content: comment.content,
        createdAt: comment.createdAt.toLocaleDateString('ko-KR') + ' ' + comment.createdAt.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
      })),
      date: post.createdAt.toLocaleDateString('ko-KR'),
      time: post.createdAt.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString()
    }));

    const totalPages = Math.ceil(totalPosts / limit);

    return NextResponse.json({
      posts: formattedPosts,
      pagination: {
        currentPage: page,
        totalPages,
        totalPosts,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('게시글 목록 조회 실패:', error);
    return NextResponse.json(
      { error: '게시글을 불러오는데 실패했습니다.' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // 유효성 검사
    const validation = validatePost(body);
    if (!validation.isValid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    // 새 게시글 생성
    const newPost = await prisma.post.create({
      data: {
        title: escapeHtml(body.title.trim()),
        content: escapeHtml(body.content.trim()),
        author: escapeHtml(body.author.trim()),
        category: escapeHtml(body.category.trim()),
        views: 0,
        likes: 0
      },
      include: {
        comments: true
      }
    });

    // 응답 형식 맞추기
    const formattedPost = {
      id: newPost.id,
      title: newPost.title,
      content: newPost.content,
      author: newPost.author,
      category: newPost.category,
      views: newPost.views,
      likes: newPost.likes,
      comments: [],
      date: newPost.createdAt.toLocaleDateString('ko-KR'),
      time: newPost.createdAt.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
      createdAt: newPost.createdAt.toISOString(),
      updatedAt: newPost.updatedAt.toISOString()
    };

    return NextResponse.json(formattedPost, { status: 201 });
  } catch (error) {
    console.error('게시글 생성 실패:', error);
    return NextResponse.json(
      { error: '게시글 작성에 실패했습니다.' },
      { status: 500 }
    );
  }
}