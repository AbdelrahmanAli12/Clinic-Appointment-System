'use client';
import { CreateUser, UserListing } from '@/components/Users';
import PageActions from '@/lib/PageActions';
import { withRoles } from '@/lib/WithRoles';
import { GlobalUserRoleEnum } from '@/utils/constants';
import { Spin } from 'antd';
import React, { useState } from 'react';

const Home = () => {
  const [pageLoading, setPageLoading] = useState<boolean>(false);
  const [modelUpdated, setModelUpdated] = useState<any>('');

  return (
    <Spin spinning={false} size='large'>
      <section
        id='createUser'
        className='w-screen min-h-screen flex flex-col justify-start items-center p-10 max-w-[1040px]'
      >
        <PageActions>
          <CreateUser
            loading={pageLoading}
            setLoading={setPageLoading}
            setModelUpdated={setModelUpdated}
            view='user'
          />
        </PageActions>
        <UserListing modelUpdated={modelUpdated} />
      </section>
    </Spin>
  );
};

export default withRoles(Home, [GlobalUserRoleEnum.ADMIN, GlobalUserRoleEnum.SCHEDULER], true);
