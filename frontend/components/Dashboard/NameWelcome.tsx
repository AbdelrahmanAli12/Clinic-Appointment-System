import { UserInfoProps } from '@/utils/types';
import { UserOutlined } from '@ant-design/icons';
import { Avatar, Badge, Dropdown, MenuProps } from 'antd';
import React from 'react';

const NameWelcome = (props: { user: UserInfoProps }) => {
  const { user } = props;

  const items: MenuProps['items'] = [
    {
      key: 'user__email',
      label: (
        <span className='text-lg italic'>
          <strong>Email:</strong> {user?.email ?? '...'}
        </span>
      ),
    },
    {
      key: 'user__name',
      label: (
        <span className='text-lg italic'>
          <strong>Username</strong>: {user?.username ?? '...'}
        </span>
      ),
    },
  ];
  return (
    <section
      id='username_viewer'
      className=' w-full h-max flex flex-col justify-center items-center lg:flex-row lg:justify-between lg:items-center mt-5 mb-[5rem] '
    >
      <div className='flex justify-center items-center gap-5 italic mb-5'>
        <Dropdown autoFocus={false} menu={{ items }} placement='bottom' arrow>
          <Badge count={user?.role ?? '...'}>
            <Avatar
              icon={<UserOutlined />}
              shape='square'
              size={{ xs: 60, sm: 100, md: 100, lg: 100, xl: 100, xxl: 100 }}
            />
          </Badge>
        </Dropdown>
      </div>
      <h1 className='text-3xl lg:text-4xl uppercase'>{user?.name ?? '...'}</h1>
    </section>
  );
};

export default NameWelcome;
