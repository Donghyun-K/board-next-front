'use client';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axiosInstance from '@/lib/axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

const schema = yup.object({
  username: yup
    .string()
    .min(4, '사용자명은 최소 4자 이상이어야 합니다')
    .max(20, '사용자명은 최대 20자까지 가능합니다')
    .required('사용자명을 입력해주세요'),
  password: yup
    .string()
    .min(4, '비밀번호는 최소 4자 이상이어야 합니다')
    .max(20, '비밀번호는 최대 20자까지 가능합니다')
    .matches(/^[a-zA-Z0-9]*$/, '비밀번호는 영문자와 숫자만 사용 가능합니다')
    .required('비밀번호를 입력해주세요'),
});

type LoginFormData = yup.InferType<typeof schema>;

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await axiosInstance.post('/auth/signin', data);
      login(response.data.accessToken);
      router.push('/');
    } catch (error) {
      console.error('로그인 실패:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            로그인
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="username" className="sr-only">사용자명</label>
              <input
                {...register('username')}
                type="text"
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="사용자명"
              />
              {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>}
            </div>
            <div>
              <label htmlFor="password" className="sr-only">비밀번호</label>
              <input
                {...register('password')}
                type="password"
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="비밀번호"
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              로그인
            </button>
          </div>
        </form>
        <div className="text-center">
          <Link href="/signup" className="text-indigo-600 hover:text-indigo-500">
            계정이 없으신가요? 회원가입
          </Link>
        </div>
      </div>
    </div>
  );
} 