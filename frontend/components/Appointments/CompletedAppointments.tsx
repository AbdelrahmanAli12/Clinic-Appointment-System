'use client';
import React from 'react';
import TableDir from '@/lib/TableDir';
import Link from 'next/link';
import { AppointmentStatusTag } from '@/lib/AppointmentStatusTag';
import { ColumnsType } from 'antd/es/table';
import { useAppointment } from '@/utils/hooks/use-appointment';
import { GlobalAppointmentStatusEnum, GlobalUserRoleEnum, ROUTES } from '@/utils/constants';
import { AppointmentProps } from '@/utils/types';
import { Checkbox, Space } from 'antd';
import { withRoles } from '@/lib/WithRoles';

const columns: ColumnsType<AppointmentProps | object> = [
  {
    title: 'Id',
    dataIndex: '_id',
    key: 'id',
  },
  {
    title: 'Date and Time',
    dataIndex: 'desiredDateTime',
    key: 'desiredDateTime',
    render: (value: number) => {
      const time = new Date(value).getTime();
      return new Date(time).toUTCString();
    },
    responsive: ['md'],
  },
  {
    title: 'Healthcare User',
    dataIndex: '_id',
    key: '_id',
    render: (_, record: any) => (
      <Link href={`${ROUTES.USERPAGE}/${record.healthcareUserInfo?._id}`}>
        {record.healthcareUserInfo?.name}
      </Link>
    ),
  },
  {
    title: 'Patient',
    dataIndex: '_id',
    key: '_id',
    render: (_, record: any) => (
      <Link href={`${ROUTES.USERPAGE}/${record.patientInfo?._id}`}>{record.patientInfo?.name}</Link>
    ),
  },
  {
    title: 'Payment Mode',
    dataIndex: 'paymentMode',
    key: 'paymentMode',
    responsive: ['md'],
  },
  {
    title: 'Fees',
    dataIndex: 'fees',
    key: 'fees',
    responsive: ['md'],
  },
  {
    title: 'Payment Done',
    dataIndex: 'isPaymentReceived',
    key: 'isPaymentReceived',
    responsive: ['md'],
    render: (isPaymentReceived: boolean) => (
      <Checkbox checked={isPaymentReceived ? true : false} disabled />
    ),
  },
];

const CompletedAppointmentsListing = () => {
  const { appointmentData, loading } = useAppointment({
    query: `?status=${GlobalAppointmentStatusEnum.COMPLETED}`,
  });

  return (
    <div className='w-full w-max-[1040px] h-max'>
      <Space>
        <h1 className='text-3xl mt-5 mb-5'>Completed Appointments </h1>{' '}
        <AppointmentStatusTag status={GlobalAppointmentStatusEnum.COMPLETED} />
      </Space>

      <TableDir rowKey='_id' columns={columns} dataSource={appointmentData} loading={loading} />
    </div>
  );
};

export default withRoles(CompletedAppointmentsListing, [
  (GlobalUserRoleEnum.ADMIN, GlobalUserRoleEnum.SCHEDULER, GlobalUserRoleEnum.HEALTHCAREUSER),
]);
