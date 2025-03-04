'use client';
import React, { createContext, useEffect, useState } from 'react';
import { UserInfoProps } from '@/utils/types/index';
import { usePathname } from 'next/navigation';
import { fetchUser } from '@/utils';

export const UserContext = createContext<any>({});
export const UserContextProvider = ({ children }: { children: JSX.Element }) => {
  const pathname = usePathname();
  const [user, setUser] = useState<UserInfoProps | null>(null);
  useEffect(() => {
    if (pathname.includes('login') || user?.email) {
      return;
    }
    const fetchData = async () => {
      try {
        const data = await fetchUser(null);
        setUser(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchData();
  }, [pathname]);

  return <UserContext.Provider value={[user, setUser]}>{children}</UserContext.Provider>;
};
