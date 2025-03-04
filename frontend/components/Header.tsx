'use client';
import { UserContext } from '@/context/UserContext';
import { GlobalUserRoleEnum, ROUTES } from '@/utils/constants';
import { setTokenCookie } from '@/utils/server-actions';
import { HeaderItemsProps } from '@/utils/types';
import {
  HomeFilled,
  AppstoreFilled,
  LogoutOutlined,
  UserOutlined,
  ProfileOutlined,
} from '@ant-design/icons';
import { Avatar, Badge, Button, Dropdown, MenuProps, Space } from 'antd';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { useContext, useMemo, useState } from 'react';

const headerItemsClassname: string = 'text-textSecondary';

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [loggedInUser, setLoggedInUser] = useContext(UserContext);
  const [isDropdownOpen, setisDropdownOpen] = useState(false);

  const logout = async () => {
    await setTokenCookie(false);
    router.push('/login');
  };

  const headerItems: HeaderItemsProps[] = [
    {
      key: 'home',
      label: 'Home',
      href: '/dashboard',
      icon: <HomeFilled />,
    },
    {
      key: 'appointments',
      label: 'All Appointments',
      href: '/appointment',
      icon: <AppstoreFilled />,
    },
    {
      key: 'users',
      label: 'Users',
      href: '/user',
      icon: <UserOutlined />,
      requiredPerm: [GlobalUserRoleEnum.ADMIN, GlobalUserRoleEnum.SCHEDULER],
    },
  ];

  const headerItemsRBAC: HeaderItemsProps[] = useMemo(
    () =>
      headerItems.filter(
        (item) =>
          (item.requiredPerm && item.requiredPerm.includes(loggedInUser?.role)) ||
          !item.requiredPerm,
      ),

    [loggedInUser?.role],
  );

  const items: MenuProps['items'] = [
    {
      key: 'user__name',
      label: <span className='text-lg italic'>{loggedInUser?.email ?? '...'}</span>,
    },
    {
      key: 'profile',
      label: (
        <Button
          className='w-full'
          onClick={() => router.push(`${ROUTES.USERPAGE}/${loggedInUser._id}`)}
          type='primary'
          icon={<ProfileOutlined />}
        >
          My Profile
        </Button>
      ),
    },
    {
      key: 'logout',
      label: (
        <Button className='w-full' onClick={logout} danger type='default' icon={<LogoutOutlined />}>
          Logout
        </Button>
      ),
    },
  ];

  if (!pathname.includes('login')) {
    return (
      <header
        id='header'
        className='z-[999] w-full bg-primary h-[5vh] flex md:justify-end justify-center items-center p-10 mb-5 sticky top-0  left-0'
      >
        <ul className='flex flex-row justify-end items-center gap-5'>
          {headerItemsRBAC?.map((item) => (
            <li
              key={item.key}
              className={`${headerItemsClassname} hover:bg-secondary p-5 rounded`}
              id={item.key}
            >
              <Link
                href={item.href}
                aria-label={`page redirect to ${item.label}`}
                onClick={item.onclick}
              >
                <div className='flex flex-row gap-2 justify-center items-center'>
                  <span>{item.icon}</span>
                  <span className='hidden md:block'>{item.label}</span>
                </div>
              </Link>
            </li>
          ))}
          <li
            key='userAvatar'
            className={`${headerItemsClassname} hover:bg-secondary p-5 rounded`}
            id='userAvatar__header'
          >
            <Dropdown open={isDropdownOpen} autoFocus={false} menu={{ items }}>
              <Badge count={loggedInUser?.role ?? '...'}>
                <Avatar
                  icon={<UserOutlined />}
                  shape='square'
                  size='large'
                  onClick={() => setisDropdownOpen((prev) => !prev)}
                />
              </Badge>
            </Dropdown>
          </li>
        </ul>
      </header>
    );
  }
};

export default Header;
