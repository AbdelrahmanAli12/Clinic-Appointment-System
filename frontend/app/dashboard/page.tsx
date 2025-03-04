'use client';
import { CompletedAppointmentsLineGraph } from '@/components/Appointments';
import { MostRecentAppointments, NameWelcome, TopHealthcareUsers } from '@/components/Dashboard';
import { BarChartComponent } from '@/components/Graphs';
import { UserContext } from '@/context/UserContext';
import { withRoles } from '@/lib/WithRoles';
import { GlobalUserRoleEnum } from '@/utils/constants';
import useDashboard from '@/utils/hooks/use-dashboard';
import { Spin } from 'antd';
import React, { useContext } from 'react';

const Home = () => {
  const [loggedInUser, setLoggedInUser] = useContext(UserContext);
  const {
    loading,
    startedAppointments,
    defferedAppointments,
    rejectedAppointments,
    visitDoneAppointments,
    suspendedAppointments,
    acceptedAppointments,
    pendingAppointments,
    allZipCodes,
  } = useDashboard({});

  const BarChartWithRoles = withRoles(
    () => (
      <BarChartComponent
        graphLabel='Appointment Counts'
        labels={[
          'Pending',
          'Started',
          'Accepted',
          'Deffered',
          'Rejected',
          'Visit done',
          'Suspended',
        ]}
        tableData={[
          pendingAppointments,
          startedAppointments,
          acceptedAppointments,
          defferedAppointments,
          rejectedAppointments,
          visitDoneAppointments,
          suspendedAppointments,
        ]}
      />
    ),
    [GlobalUserRoleEnum.ADMIN, GlobalUserRoleEnum.SCHEDULER, GlobalUserRoleEnum.HEALTHCAREUSER],
  );
  return (
    <section className='w-[100vw] h-max p-10 xl:pl-[20vw] xl:pr-[20vw]'>
      <NameWelcome user={loggedInUser} />
      <Spin spinning={loading}>
        <BarChartWithRoles />
      </Spin>
      <CompletedAppointmentsLineGraph />
      <MostRecentAppointments />
      <TopHealthcareUsers />
    </section>
  );
};

export default Home;
