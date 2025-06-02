'use client';

import { useEffect, useState } from 'react';
import axiosInstance from '@/lib/axios';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

interface Board {
  id: number;
  title: string;
  description: string;
  status: 'PUBLIC' | 'PRIVATE';
  user: {
    id: number;
    username: string;
  };
}

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const [boards, setBoards] = useState<Board[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    const fetchBoards = async () => {
      try {
        const response = await axiosInstance.get('/boards');
        setBoards(response.data);
      } catch (error) {
        console.error('게시물 조회 실패:', error);
      }
    };

    fetchBoards();
  }, [isAuthenticated, router]);

  const handleDelete = async (id: number) => {
    if (!confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
      return;
    }

    try {
      await axiosInstance.delete(`/boards/${id}`);
      setBoards(boards.filter(board => board.id !== id));
    } catch (error) {
      console.error('게시글 삭제 실패:', error);
      alert('게시글 삭제에 실패했습니다.');
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">게시판</h1>
            <p className="mt-2 text-sm text-gray-600">
              {user?.username}님, 환영합니다!
            </p>
          </div>
          <Link
            href="/boards/new"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            새 글 작성
          </Link>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {boards.map((board) => (
              <li key={board.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <Link href={`/boards/${board.id}`} className="text-sm font-medium text-indigo-600 truncate hover:text-indigo-900">
                      {board.title}
                    </Link>
                    <div className="ml-2 flex-shrink-0 flex items-center space-x-2">
                      <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {board.user?.username || '알 수 없음'}
                      </p>
                      {board.user.id === user?.id && (
                        <div className="flex space-x-2">
                          <Link
                            href={`/boards/${board.id}/edit`}
                            className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-white bg-blue-600 hover:bg-blue-700"
                          >
                            수정
                          </Link>
                          <button
                            onClick={() => handleDelete(board.id)}
                            className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-white bg-red-600 hover:bg-red-700"
                          >
                            삭제
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500">
                        {board.description}
                      </p>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {board.status}
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
