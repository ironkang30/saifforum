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

// 댓글 작성
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const postId = parseInt(resolvedParams.id);
    const body = await request.json();
    
    if (isNaN(postId)) {
      return NextResponse.json(
        { error: '유효하지 않은 게시글 ID입니다.' },
        { status: 400 }
      );
    }

    // 입력 검증
    if (!body.content || typeof body.content !== 'string' || body.content.trim().length === 0) {
      return NextResponse.json(
        { error: '댓글 내용은 필수입니다.' },
        { status: 400 }
      );
    }

    if (body.content.length > 500) {
      return NextResponse.json(
        { error: '댓글은 500자 이하여야 합니다.' },
        { status: 400 }
      );
    }

    // 게시글 존재 확인
    const post = await prisma.post.findUnique({
      where: { id: postId }
    });

    if (!post) {
      return NextResponse.json(
        { error: '게시글을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 댓글 생성
    const newComment = await prisma.comment.create({
      data: {
        content: escapeHtml(body.content.trim()),
        author: escapeHtml(body.author?.trim() || '익명'),
        postId: postId
      }
    });

    // 응답 형식 맞추기
    const formattedComment = {
      id: newComment.id,
      author: newComment.author,
      content: newComment.content,
      createdAt: newComment.createdAt.toLocaleDateString('ko-KR') + ' ' + newComment.createdAt.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
    };

    return NextResponse.json(formattedComment, { status: 201 });
  } catch (error) {
    console.error('댓글 작성 실패:', error);
    return NextResponse.json(
      { error: '댓글 작성에 실패했습니다.' },
      { status: 500 }
    );
  }
}