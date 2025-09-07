export interface Comment {
  id: number;
  content: string;
  author: string;
  createdAt: string;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
  category: string;
  views: number;
  likes: number;
  comments: Comment[];
  date: string;
  time: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalPosts: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PostsResponse {
  posts: Post[];
  pagination: PaginationInfo;
}

export interface BoardFilters {
  search: string;
  category: string;
  sortBy: 'createdAt' | 'views' | 'likes' | 'title';
  sortOrder: 'asc' | 'desc';
  page: number;
  limit: number;
}


