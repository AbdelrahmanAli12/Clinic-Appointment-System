'use client';
import React, { useState, useEffect } from 'react';
import TableDir from '@/lib/TableDir';
import Link from 'next/link';
import { AppointmentStatusTag } from '@/lib/AppointmentStatusTag';
import { ColumnsType } from 'antd/es/table';
import { advancedFilteredAppointments, getStatusFilters, openNotification } from '@/utils';
import CompletedAppointmentsListing from '@/components/Appointments/CompletedAppointments';
import PageActions from '@/lib/PageActions';
import { useRouter } from 'next/navigation';
import { GlobalUserRoleEnum, ROUTES } from '@/utils/constants';
import { AdvancedFilter, Calendar } from '@/components/Appointments';
import { withRoles } from '@/lib/WithRoles';
import ActionButton from '@/lib/ActionButton';
import { AppointmentProps } from '@/utils/types';

const StatusFilters = getStatusFilters();
const columns: ColumnsType<AppointmentProps | object> = [
  {
    title: 'Patient',
    dataIndex: '_id',
    key: 'id',
    render: (id: string, record: any) => (
      <Link className='text-primary underline' href={`/appointment/${id}`}>
        {record.patientInfo?.name}
      </Link>
    ),
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
    title: 'City',
    dataIndex: 'address',
    key: 'address',
    render: (value: any) => {
      return value.city;
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
    responsive: ['md'],
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
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    filters: StatusFilters,
    onFilter: (value, record: any) => record.status === value,
    render: (status: string) => <AppointmentStatusTag status={status} />,
  },
];

const AppointmentsListing = () => {
  const [query, setQuery] = useState({});
  const [appointmentData, setAppointmentData] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function getAppointment() {
      setLoading(true);

      try {
        const advancedAppointmentResult = await advancedFilteredAppointments(query);
        setAppointmentData(
          Array.isArray(advancedAppointmentResult.data) ? advancedAppointmentResult.data : [],
        );
      } catch (error) {
        console.error('Error getting appointment', error);
        openNotification({
          message: `API Failure: ${error}`,
          type: 'error',
        });
      } finally {
        setLoading(false);
      }
    }

    getAppointment();
  }, [query]);

  const CreateAppointmentWithRBAC = withRoles(
    () => (
      <ActionButton text='New' callback={() => router.push('/appointment/createAppointment')} />
    ),
    [GlobalUserRoleEnum.ADMIN, GlobalUserRoleEnum.SCHEDULER],
  );

  return (
    <div className='flex flex-col pb-5 w-full h-max p-10 max-w-[1040px]'>
      <AdvancedFilter setFilterQuery={setQuery} />
      <PageActions>
        <CreateAppointmentWithRBAC />
      </PageActions>
      <TableDir rowKey='_id' columns={columns} dataSource={appointmentData} loading={loading} />
      <CompletedAppointmentsListing />
      <Calendar appointments={appointmentData} />
    </div>
  );
};

export default AppointmentsListing;
