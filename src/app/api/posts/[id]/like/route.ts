import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// 좋아요 토글
export async function POST(
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

    // 게시글 존재 확인
    const post = await prisma.post.findUnique({
      where: { id }
    });

    if (!post) {
      return NextResponse.json(
        { error: '게시글을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 좋아요 수 증가
    const updatedPost = await prisma.post.update({
      where: { id },
      data: { likes: { increment: 1 } }
    });

    return NextResponse.json({ 
      message: '좋아요가 추가되었습니다.',
      likes: updatedPost.likes 
    });
  } catch (error) {
    console.error('좋아요 처리 실패:', error);
    return NextResponse.json(
      { error: '좋아요 처리에 실패했습니다.' },
      { status: 500 }
    );
  }
}