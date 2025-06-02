'use client';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axiosInstance from '@/lib/axios';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';

const schema = yup.object({
  title: yup
    .string()
    .required('제목을 입력해주세요')
    .max(100, '제목은 100자 이내로 입력해주세요'),
  description: yup
    .string()
    .required('내용을 입력해주세요')
    .max(1000, '내용은 1000자 이내로 입력해주세요'),
});

type CreateBoardFormData = yup.InferType<typeof schema>;

export default function NewBoard() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const { register, handleSubmit, formState: { errors } } = useForm<CreateBoardFormData>({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const onSubmit = async (data: CreateBoardFormData) => {
    try {
      const response = await axiosInstance.post('/boards', data);
      console.log('게시글 작성 성공:', response.data);
      router.push('/');
    } catch (error: any) {
      console.error('게시글 작성 실패:', error);
      const errorMessage = error.response?.data?.message || error.message || '게시글 작성에 실패했습니다.';
      alert(`게시글 작성 실패: ${errorMessage}`);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              새 글 작성
            </h3>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  제목
                </label>
                <div className="mt-1">
                  <input
                    {...register('title')}
                    type="text"
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md text-gray-900"
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  내용
                </label>
                <div className="mt-1">
                  <textarea
                    {...register('description')}
                    rows={10}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md text-gray-900"
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  작성
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 