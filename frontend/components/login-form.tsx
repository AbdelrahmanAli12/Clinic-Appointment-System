'use client';
import { ResultProps, loginProps } from '@/utils/types';
import { isSuccess, login, openNotification } from '@/utils';
import { Form, Input, Button } from 'antd';
import React, { useContext, useState } from 'react';
import { useRouter } from 'next/navigation';
import { setTokenCookie } from '@/utils/server-actions';
import { UserContext } from '@/context/UserContext';

type FieldType = {
  identifier?: string;
  password?: string;
  remember?: string;
};
const LoginForm = () => {
  const [user, setUser] = useContext(UserContext);
  const router = useRouter();
  const [loading, setloading] = useState(false);

  const submitLogin = async (e: loginProps) => {
    setloading(true);
    try {
      const loginResult: ResultProps = await login(e);

      if (!isSuccess(loginResult)) {
        return openNotification({
          type: 'error',
          message: `Client Failed to login, ${loginResult.data.message}`,
        });
      }
      setUser({ name: e.identifier });
      const saveTokenResult: ResultProps = await setTokenCookie(loginResult.data?.data);
      if (!isSuccess(saveTokenResult)) {
        return openNotification({
          type: 'error',
          message: saveTokenResult.data.message,
        });
      }

      router.push('/dashboard');
      openNotification({
        message: `Welcome Back ${e.identifier}`,
      });
    } catch (error) {
      console.error('Error while loggin in ', error);
      return openNotification({
        type: 'error',
        message: `${error}`,
      });
    } finally {
      setloading(false);
    }
  };

  return (
    <Form name='login__form' className='w-full max-w-lg' onFinish={submitLogin}>
      <Form.Item<FieldType>
        name='identifier'
        rules={[{ required: true, message: 'Please input your username or email!' }]}
      >
        <Input placeholder='Username or Email' />
      </Form.Item>

      <Form.Item<FieldType>
        name='password'
        rules={[{ required: true, message: 'Please input your password!' }]}
      >
        <Input.Password placeholder='Password' />
      </Form.Item>

      <Form.Item>
        <Button
          type='primary'
          htmlType='submit'
          className='overflow-hidden bg-primary'
          disabled={loading}
          loading={loading}
        >
          Sign In
        </Button>
      </Form.Item>
    </Form>
  );
};

export default LoginForm;
