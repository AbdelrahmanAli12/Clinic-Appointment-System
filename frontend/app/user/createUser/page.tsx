'use client';
import React, { useState } from 'react';
import { CreateUserForm } from '@/components/Users';
import { UserAddOutlined } from '@ant-design/icons';
import { Space, Spin } from 'antd';

const Home = () => {
  const [loading, setloading] = useState(false);

  return (
    <Spin spinning={loading} size='large'>
      <section
        id='createUser'
        className='w-screen min-h-screen flex flex-col justify-start items-center p-10 xl:pl-[20vw] xl:pr-[20vw]'
      >
        <Space className='text-4xl  m-2'>
          <UserAddOutlined />
          Create new user
        </Space>
        <CreateUserForm setloading={setloading} />
      </section>
    </Spin>
  );
};

export default Home;
