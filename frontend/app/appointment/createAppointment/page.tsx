'use client';
import React, { useState } from 'react';

import CreateAppointmentForm from '@/components/Appointments/CreateAppointmentForm';
import { withRoles } from '@/lib/WithRoles';
import { GlobalUserRoleEnum } from '@/utils/constants';
import { MedicineBoxOutlined } from '@ant-design/icons';
import { Space } from 'antd';

const Home = () => {
  const [pageLoading, setPageLoading] = useState<boolean>(false);
  const [modelUpdated, setModelUpdated] = useState<any>('');

  return (
    <section className='w-screen min-h-screen flex flex-col justify-start items-center p-10 xl:pl-[20vw] xl:pr-[20vw]'>
      <Space className='text-4xl m-2'>
        <MedicineBoxOutlined />
        Create new appointment
      </Space>
      <CreateAppointmentForm
        loading={pageLoading}
        setLoading={setPageLoading}
        setModelUpdated={setModelUpdated}
        modelUpdated={modelUpdated}
      />
    </section>
  );
};

export default withRoles(Home, [GlobalUserRoleEnum.ADMIN, GlobalUserRoleEnum.SCHEDULER], true);
