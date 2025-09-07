'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
  category: string;
  date: string;
  time: string;
  views: number;
  likes: number;
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
}

interface Comment {
  id: number;
  author: string;
  content: string;
  createdAt: string;
}

interface BoardFilters {
  category: string;
  search: string;
  sortBy: 'date' | 'views' | 'likes';
  sortOrder: 'asc' | 'desc';
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalPosts: number;
  hasNext: boolean;
  hasPrev: boolean;
}

const categories = [
  { name: '전체', value: '' },
  { name: '맛집후기', value: '맛집후기' },
  { name: '질문', value: '질문' },
  { name: '정보공유', value: '정보공유' },
  { name: '자유게시판', value: '자유게시판' }
];

export default function BoardPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [showPostForm, setShowPostForm] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [newPost, setNewPost] = useState({ title: '', content: '', category: '자유게시판' });
  const [submitting, setSubmitting] = useState(false);
  const [filters, setFilters] = useState<BoardFilters>({
    category: '',
    search: '',
    sortBy: 'date',
    sortOrder: 'desc'
  });
  const [pagination, setPagination] = useState<Pagination>({
    currentPage: 1,
    totalPages: 1,
    totalPosts: 0,
    hasNext: false,
    hasPrev: false
  });
  const [newComment, setNewComment] = useState('');
  const [commentSubmitting, setCommentSubmitting] = useState(false);

  // 게시글 목록 가져오기
  const fetchPosts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.currentPage.toString(),
        limit: '10',
        ...(filters.category && { category: filters.category }),
        ...(filters.search && { search: filters.search }),
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder
      });

      const response = await fetch(`/api/posts?${params}`);
      const data = await response.json();
      
      if (response.ok) {
        setPosts(data.posts);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('게시글을 불러오는데 실패했습니다:', error);
    } finally {
      setLoading(false);
    }
  };

  // 게시글 상세 보기
  const fetchPostDetail = async (id: number) => {
    try {
      const response = await fetch(`/api/posts/${id}`);
      const data = await response.json();
      
      if (response.ok) {
        setSelectedPost(data);
      }
    } catch (error) {
      console.error('게시글을 불러오는데 실패했습니다:', error);
    }
  };

  // 새 게시글 작성
  const handleSubmitPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.title.trim() || !newPost.content.trim()) return;

    setSubmitting(true);
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newPost.title.trim(),
          content: newPost.content.trim(),
          category: newPost.category,
          author: '익명'
        })
      });

      if (response.ok) {
        setNewPost({ title: '', content: '', category: '자유게시판' });
        setShowPostForm(false);
        fetchPosts();
      }
    } catch (error) {
      console.error('게시글 작성에 실패했습니다:', error);
    } finally {
      setSubmitting(false);
    }
  };

  // 게시글 수정
  const handleEditPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPost || !editingPost.title.trim() || !editingPost.content.trim()) return;

    setSubmitting(true);
    try {
      const response = await fetch(`/api/posts/${editingPost.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editingPost.title.trim(),
          content: editingPost.content.trim(),
          category: editingPost.category
        })
      });

      if (response.ok) {
        setEditingPost(null);
        fetchPosts();
        if (selectedPost?.id === editingPost.id) {
          fetchPostDetail(editingPost.id);
        }
      }
    } catch (error) {
      console.error('게시글 수정에 실패했습니다:', error);
    } finally {
      setSubmitting(false);
    }
  };

  // 게시글 삭제
  const handleDeletePost = async (id: number) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;

    try {
      const response = await fetch(`/api/posts/${id}`, { method: 'DELETE' });
      
      if (response.ok) {
        setSelectedPost(null);
        fetchPosts();
      }
    } catch (error) {
      console.error('게시글 삭제에 실패했습니다:', error);
    }
  };

  // 댓글 작성
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPost || !newComment.trim()) return;

    setCommentSubmitting(true);
    try {
      const response = await fetch(`/api/posts/${selectedPost.id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: newComment.trim(),
          author: '익명'
        })
      });

      if (response.ok) {
        setNewComment('');
        fetchPostDetail(selectedPost.id);
      }
    } catch (error) {
      console.error('댓글 작성에 실패했습니다:', error);
    } finally {
      setCommentSubmitting(false);
    }
  };

  // 좋아요 토글
  const handleLikePost = async (id: number) => {
    try {
      const response = await fetch(`/api/posts/${id}/like`, { method: 'POST' });
      
      if (response.ok) {
        fetchPosts();
        if (selectedPost?.id === id) {
          fetchPostDetail(id);
        }
      }
    } catch (error) {
      console.error('좋아요 처리에 실패했습니다:', error);
    }
  };

  // 필터 변경
  const handleFilterChange = (key: keyof BoardFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  // 페이지 변경
  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
  };

  useEffect(() => {
    fetchPosts();
  }, [filters, pagination.currentPage, fetchPosts]);

  // 게시글 목록 뷰
  const renderPostList = () => (
    <div className="max-w-6xl mx-auto">
      {/* 헤더 */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-4">게시판</h1>
        <p className="text-slate-600">상암동 맛집에 대한 정보를 공유하고 소통해보세요</p>
      </div>

      {/* 필터 및 검색 */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-6 border border-white/20">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-semibold text-slate-700 mb-2">검색</label>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              placeholder="제목, 내용으로 검색..."
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
            />
          </div>
          <div className="lg:w-48">
            <label className="block text-sm font-semibold text-slate-700 mb-2">카테고리</label>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div className="lg:w-48">
            <label className="block text-sm font-semibold text-slate-700 mb-2">정렬</label>
            <select
              value={`${filters.sortBy}-${filters.sortOrder}`}
              onChange={(e) => {
                const [sortBy, sortOrder] = e.target.value.split('-') as [BoardFilters['sortBy'], BoardFilters['sortOrder']];
                setFilters(prev => ({ ...prev, sortBy, sortOrder }));
              }}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
            >
              <option value="date-desc">최신순</option>
              <option value="date-asc">오래된순</option>
              <option value="views-desc">조회수 높은순</option>
              <option value="likes-desc">좋아요 많은순</option>
            </select>
          </div>
        </div>
        
        <div className="mt-4 flex justify-between items-center">
          <span className="text-slate-600">
            총 <span className="font-bold text-blue-600">{pagination.totalPosts}</span>개의 게시글
          </span>
          <button
            onClick={() => setShowPostForm(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold"
          >
            글쓰기
          </button>
        </div>
      </div>

      {/* 게시글 목록 */}
      {loading ? (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">게시글을 불러오는 중...</p>
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-xl font-semibold text-slate-700 mb-2">게시글이 없습니다</h3>
          <p className="text-slate-500">첫 번째 게시글을 작성해보세요!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <div
              key={post.id}
              onClick={() => fetchPostDetail(post.id)}
              className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl p-6 cursor-pointer transition-all duration-300 hover:scale-[1.02] border border-white/20"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-slate-800 mb-2 line-clamp-2">{post.title}</h3>
                  <p className="text-slate-600 text-sm line-clamp-2">{post.content}</p>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                    {post.category}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm text-slate-500">
                <div className="flex items-center gap-4">
                  <span>👤 {post.author}</span>
                  <span>📅 {post.date} {post.time}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span>👁️ {post.views}</span>
                  <span>❤️ {post.likes}</span>
                  <span>💬 {post.comments.length}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 페이지네이션 */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={!pagination.hasPrev}
              className="px-4 py-2 rounded-xl bg-white/80 text-slate-700 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              이전
            </button>
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-4 py-2 rounded-xl transition-colors ${
                  page === pagination.currentPage
                    ? 'bg-blue-600 text-white'
                    : 'bg-white/80 text-slate-700 hover:bg-blue-50'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={!pagination.hasNext}
              className="px-4 py-2 rounded-xl bg-white/80 text-slate-700 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              다음
            </button>
          </div>
        </div>
      )}
    </div>
  );

  // 게시글 상세 뷰
  const renderPostDetail = () => {
    if (!selectedPost) return null;

    return (
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => setSelectedPost(null)}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            목록으로 돌아가기
          </button>
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-white/20">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-semibold rounded-full">
                {selectedPost.category}
              </span>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setEditingPost(selectedPost)}
                  className="text-slate-600 hover:text-blue-600 transition-colors"
                >
                  수정
                </button>
                <button
                  onClick={() => handleDeletePost(selectedPost.id)}
                  className="text-slate-600 hover:text-red-600 transition-colors"
                >
                  삭제
                </button>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-slate-800 mb-4">{selectedPost.title}</h1>
            <div className="flex items-center gap-4 text-sm text-slate-500 mb-6">
              <span>👤 {selectedPost.author}</span>
              <span>📅 {selectedPost.date} {selectedPost.time}</span>
              <span>👁️ {selectedPost.views}</span>
              <button
                onClick={() => handleLikePost(selectedPost.id)}
                className="flex items-center gap-1 hover:text-red-500 transition-colors"
              >
                ❤️ {selectedPost.likes}
              </button>
            </div>
          </div>

          <div className="prose max-w-none mb-8">
            <div className="whitespace-pre-wrap text-slate-700 leading-relaxed">
              {selectedPost.content}
            </div>
          </div>

          {/* 댓글 섹션 */}
          <div className="border-t border-slate-200 pt-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">댓글 ({selectedPost.comments.length})</h3>
            
            {/* 댓글 작성 */}
            <form onSubmit={handleSubmitComment} className="mb-6">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="댓글을 작성하세요..."
                  className="flex-1 px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                />
                <button
                  type="submit"
                  disabled={commentSubmitting || !newComment.trim()}
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
                >
                  {commentSubmitting ? '작성 중...' : '작성'}
                </button>
              </div>
            </form>

            {/* 댓글 목록 */}
            <div className="space-y-4">
              {selectedPost.comments.map((comment) => (
                <div key={comment.id} className="bg-slate-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold text-slate-700">{comment.author}</span>
                    <span className="text-sm text-slate-500">{comment.createdAt}</span>
                  </div>
                  <p className="text-slate-700">{comment.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 게시글 작성/수정 폼
  const renderPostForm = () => {
    const post = editingPost || newPost;
    const isEditing = !!editingPost;

    return (
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => {
              setShowPostForm(false);
              setEditingPost(null);
              setNewPost({ title: '', content: '', category: '자유게시판' });
            }}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            목록으로 돌아가기
          </button>
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-white/20">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">
            {isEditing ? '게시글 수정' : '새 게시글 작성'}
          </h2>

          <form onSubmit={isEditing ? handleEditPost : handleSubmitPost}>
            <div className="mb-6">
              <label className="block text-sm font-semibold text-slate-700 mb-2">제목</label>
              <input
                type="text"
                value={post.title}
                onChange={(e) => {
                  if (isEditing) {
                    setEditingPost(prev => prev ? { ...prev, title: e.target.value } : null);
                  } else {
                    setNewPost(prev => ({ ...prev, title: e.target.value }));
                  }
                }}
                placeholder="제목을 입력하세요"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-slate-700 mb-2">카테고리</label>
              <select
                value={post.category}
                onChange={(e) => {
                  if (isEditing) {
                    setEditingPost(prev => prev ? { ...prev, category: e.target.value } : null);
                  } else {
                    setNewPost(prev => ({ ...prev, category: e.target.value }));
                  }
                }}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
              >
                {categories.slice(1).map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-slate-700 mb-2">내용</label>
              <textarea
                value={post.content}
                onChange={(e) => {
                  if (isEditing) {
                    setEditingPost(prev => prev ? { ...prev, content: e.target.value } : null);
                  } else {
                    setNewPost(prev => ({ ...prev, content: e.target.value }));
                  }
                }}
                placeholder="내용을 입력하세요"
                rows={10}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 resize-none"
                required
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowPostForm(false);
                  setEditingPost(null);
                  setNewPost({ title: '', content: '', category: '자유게시판' });
                }}
                className="px-6 py-3 text-slate-600 hover:text-slate-800 transition-colors"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={submitting || !post.title.trim() || !post.content.trim()}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
              >
                {submitting ? (isEditing ? '수정 중...' : '작성 중...') : (isEditing ? '수정하기' : '작성하기')}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* 네비게이션 */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            홈으로 돌아가기
          </Link>
        </div>

        {/* 메인 콘텐츠 */}
        {showPostForm || editingPost ? renderPostForm() : selectedPost ? renderPostDetail() : renderPostList()}
      </div>
    </div>
  );
}


