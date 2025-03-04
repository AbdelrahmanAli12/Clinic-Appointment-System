'use client';
import { LoginForm } from '@/components';
import React from 'react';

const Login = () => {
  return (
    <section id='login' className='w-[100vw] h-[100vh] flex justify-center items-center'>
      <div className='w-full max-w-[1440px] lg:min-w-[1040px] h-full xl:w-1/2 xl:h-[60vh] bg-textSecondary xl:rounded-lg flex flex-col xl:flex-row justify-start items-center p-10 gap-5 xl:shadow-2xl xl:shadow-secondary xl:border-black'>
        <div
          id='login__form'
          className='w-full h-1/2 xl:h-full xl:w-1/2 flex-1 order-2 xl:order-1 flex flex-col md:flex-row xl:flex-col  justify-center items-center gap-10 overflow-hidden'
        >
          <h1 className='text-3xl md:text-5xl xl:text-7xl font-bold leading-6 text-primary'>
            Get Started
          </h1>
          <LoginForm />
        </div>
        <div
          id='login__image'
          className="w-full xl:w-1/2 h-1/2 xl:h-full flex-1 order-1 xl:order-2  bg-[url('/login__form.png')] bg-contain bg-no-repeat bg-center"
        ></div>
      </div>
    </section>
  );
};

export default Login;
