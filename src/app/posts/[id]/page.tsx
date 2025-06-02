'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axiosInstance from '@/lib/axios';
import Link from 'next/link';

interface Post {
  id: number;
  title: string;
  content: string;
  author: {
    name: string;
  };
  createdAt: string;
}

export default function PostDetail({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axiosInstance.get(`/posts/${params.id}`);
        setPost(response.data);
      } catch (error) {
        console.error('게시물 조회 실패:', error);
      }
    };

    fetchPost();
  }, [params.id]);

  const handleDelete = async () => {
    if (window.confirm('정말로 삭제하시겠습니까?')) {
      try {
        await axiosInstance.delete(`/posts/${params.id}`);
        router.push('/');
      } catch (error) {
        console.error('게시물 삭제 실패:', error);
      }
    }
  };

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex justify-between items-start">
              <h1 className="text-2xl font-bold text-gray-900">{post.title}</h1>
              <div className="flex space-x-3">
                <Link
                  href={`/posts/${params.id}/edit`}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  수정
                </Link>
                <button
                  onClick={handleDelete}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                >
                  삭제
                </button>
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm text-gray-500">
              <p>작성자: {post.author.name}</p>
              <span className="mx-2">•</span>
              <p>{new Date(post.createdAt).toLocaleDateString()}</p>
            </div>
            <div className="mt-6 prose max-w-none">
              <p className="whitespace-pre-wrap">{post.content}</p>
            </div>
            <div className="mt-6">
              <Link
                href="/"
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                목록으로
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 