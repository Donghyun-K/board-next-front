'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axiosInstance from '@/lib/axios';
import { useRouter } from 'next/navigation';

const schema = yup.object({
  title: yup.string().required('제목을 입력해주세요'),
  content: yup.string().required('내용을 입력해주세요'),
});

type PostFormData = yup.InferType<typeof schema>;

export default function EditPost({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [post, setPost] = useState<PostFormData | null>(null);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<PostFormData>({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axiosInstance.get(`/posts/${params.id}`);
        setPost(response.data);
        reset(response.data);
      } catch (error) {
        console.error('게시물 조회 실패:', error);
      }
    };

    fetchPost();
  }, [params.id, reset]);

  const onSubmit = async (data: PostFormData) => {
    try {
      await axiosInstance.put(`/posts/${params.id}`, data);
      router.push(`/posts/${params.id}`);
    } catch (error) {
      console.error('게시물 수정 실패:', error);
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
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              게시물 수정
            </h3>
            <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  제목
                </label>
                <div className="mt-1">
                  <input
                    {...register('title')}
                    type="text"
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                  {errors.title && (
                    <p className="mt-2 text-sm text-red-600">{errors.title.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                  내용
                </label>
                <div className="mt-1">
                  <textarea
                    {...register('content')}
                    rows={10}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                  {errors.content && (
                    <p className="mt-2 text-sm text-red-600">{errors.content.message}</p>
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
                  수정하기
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 