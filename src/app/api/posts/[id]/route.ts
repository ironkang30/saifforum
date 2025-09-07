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
  
  const postData = data as { title?: unknown; content?: unknown; category?: unknown };
  
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
  return { isValid: true };
}

// 게시글 조회 (조회수 증가)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: '유효하지 않은 게시글 ID입니다.' },
        { status: 400 }
      );
    }

    // 조회수 증가와 함께 게시글 조회
    const post = await prisma.post.update({
      where: { id },
      data: { views: { increment: 1 } },
      include: {
        comments: {
          orderBy: { createdAt: 'asc' }
        }
      }
    });

    if (!post) {
      return NextResponse.json(
        { error: '게시글을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 응답 형식 맞추기
    const formattedPost = {
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
    };

    return NextResponse.json(formattedPost);
  } catch (error) {
    console.error('게시글 조회 실패:', error);
    return NextResponse.json(
      { error: '게시글을 불러오는데 실패했습니다.' },
      { status: 500 }
    );
  }
}

// 게시글 수정
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);
    const body = await request.json();
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: '유효하지 않은 게시글 ID입니다.' },
        { status: 400 }
      );
    }

    // 유효성 검사
    const validation = validatePost(body);
    if (!validation.isValid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    // 게시글 수정
    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        title: escapeHtml(body.title.trim()),
        content: escapeHtml(body.content.trim()),
        category: escapeHtml(body.category.trim()),
        updatedAt: new Date()
      },
      include: {
        comments: {
          orderBy: { createdAt: 'asc' }
        }
      }
    });

    // 응답 형식 맞추기
    const formattedPost = {
      id: updatedPost.id,
      title: updatedPost.title,
      content: updatedPost.content,
      author: updatedPost.author,
      category: updatedPost.category,
      views: updatedPost.views,
      likes: updatedPost.likes,
      comments: updatedPost.comments.map(comment => ({
        id: comment.id,
        author: comment.author,
        content: comment.content,
        createdAt: comment.createdAt.toLocaleDateString('ko-KR') + ' ' + comment.createdAt.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
      })),
      date: updatedPost.createdAt.toLocaleDateString('ko-KR'),
      time: updatedPost.createdAt.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
      createdAt: updatedPost.createdAt.toISOString(),
      updatedAt: updatedPost.updatedAt.toISOString()
    };

    return NextResponse.json(formattedPost);
  } catch (error) {
    console.error('게시글 수정 실패:', error);
    return NextResponse.json(
      { error: '게시글 수정에 실패했습니다.' },
      { status: 500 }
    );
  }
}

// 게시글 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: '유효하지 않은 게시글 ID입니다.' },
        { status: 400 }
      );
    }

    // 게시글 삭제 (댓글도 함께 삭제됨 - Cascade)
    await prisma.post.delete({
      where: { id }
    });

    return NextResponse.json({ message: '게시글이 삭제되었습니다.' });
  } catch (error) {
    console.error('게시글 삭제 실패:', error);
    return NextResponse.json(
      { error: '게시글 삭제에 실패했습니다.' },
      { status: 500 }
    );
  }
}