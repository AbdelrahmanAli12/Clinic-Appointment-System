'use client';

import { Calendar } from '@/components/Appointments';
import { NameWelcome } from '@/components/Dashboard';
import { AddAddress, DeleteUser, UpdateUser, UserDetail } from '@/components/Users';
import PageActions from '@/lib/PageActions';
import { fetchUser } from '@/utils';
import { GlobalUserRoleEnum } from '@/utils/constants';
import { useAppointment } from '@/utils/hooks/use-appointment';
import { UserInfoProps } from '@/utils/types';
import { Spin } from 'antd';
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const Home = ({ params }: { params: { id: string } }) => {
  const [pageLoading, setPageLoading] = useState<boolean>(false);
  const [userData, setUserData] = useState<UserInfoProps | any>({});
  const [isModelDataChanged, setIsModelDataChanged] = useState<any>('');
  const pathname = usePathname();

  function getQuery() {
    if (!userData) return '';
    const queryBase =
      userData?.role === GlobalUserRoleEnum.HEALTHCAREUSER
        ? 'healthcareUserInfo._id'
        : userData?.role === GlobalUserRoleEnum.PATIENT
        ? 'patientInfo._id'
        : null;
    if (queryBase) {
      return `?${queryBase}=${params.id}`;
    } else {
      return '';
    }
  }

  const { appointmentData, loading } = useAppointment({
    query: getQuery(),
    refreshToken: pathname,
  });

  useEffect(() => {
    async function getUserData() {
      try {
        setPageLoading(true);
        const userResponse = await fetchUser(params.id);
        if (!userResponse) return;
        setUserData(userResponse);
      } catch (error) {
        console.error('Failed to get user info ', error);
      } finally {
        setPageLoading(false);
      }
    }

    getUserData();
  }, [pathname, isModelDataChanged]);

  const pageLoader = pageLoading || loading;
  return (
    <Spin spinning={pageLoader} size='large'>
      <section className='w-screen h-max max-w-[1040px] p-10 overflow-hidden'>
        <NameWelcome user={userData} />

        <PageActions>
          <AddAddress
            user={userData}
            setPageLoading={setPageLoading}
            pageLoading={pageLoading}
            setIsModelDataChanged={setIsModelDataChanged}
          />
          <UpdateUser
            user={userData}
            setPageLoading={setPageLoading}
            pageLoading={pageLoading}
            setIsModelDataChanged={setIsModelDataChanged}
          />
          <DeleteUser
            id={params.id}
            setIsModelDataChanged={setIsModelDataChanged}
            active={userData?.active}
          />
        </PageActions>
        <UserDetail userInfo={userData} />
        {userData &&
          [GlobalUserRoleEnum.HEALTHCAREUSER, GlobalUserRoleEnum.PATIENT].includes(
            userData?.role,
          ) && (
            <>
              <h1 className='text-4xl mt-10 mb-2'>User Appointments</h1>
              <Calendar appointments={appointmentData} />
            </>
          )}
      </section>
    </Spin>
  );
};

export default Home;
