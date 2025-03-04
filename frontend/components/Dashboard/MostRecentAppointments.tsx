'use client';

import { AppointmentStatusTag } from '@/lib/AppointmentStatusTag';
import { useAppointment } from '@/utils/hooks/use-appointment';
import { List } from 'antd';
import React, { useContext } from 'react';
import { ChangeStatus } from '../Appointments';
import Link from 'next/link';
import { UserContext } from '@/context/UserContext';

const MostRecentAppointments = () => {
  const [loggedInUser, setLoggedInUser] = useContext(UserContext);
  const { appointmentData, loading } = useAppointment({ query: '?limit=5&mostRecent=true' });
  return (
    <>
      <h1 className='text-xl md:text-3xl mb-3 font-bold'>Most Recent Appointments</h1>
      <List
        loading={loading}
        bordered
        className='mb-5'
        itemLayout='horizontal'
        dataSource={appointmentData}
        renderItem={(item, index) => (
          <List.Item
            actions={[
              <AppointmentStatusTag status={item.status} />,
              window.innerWidth >= 768 && (
                <ChangeStatus
                  id={item._id}
                  oldStatus={item.status}
                  key={item._id}
                  role={loggedInUser?.role}
                />
              ),
            ]}
          >
            <List.Item.Meta
              title={
                <Link href={`/appointment/${item._id}`} className='underline'>
                  {item._id}
                </Link>
              }
              description={`Scheduled on ${new Date(item.desiredDateTime ?? '').toUTCString()}`}
            />
          </List.Item>
        )}
      />
    </>
  );
};

export default MostRecentAppointments;
