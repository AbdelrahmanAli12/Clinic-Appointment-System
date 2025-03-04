'use client';
import { GlobalAppointmentStatusEnum } from '@/utils/constants';
import { useAppointment } from '@/utils/hooks/use-appointment';
import React, { useEffect, useState } from 'react';
import { LineChartComponent } from '../Graphs';
import { Spin } from 'antd';

const CompletedAppointmentsLineGraph = () => {
  const { appointmentData, loading } = useAppointment({
    query: `?status=${GlobalAppointmentStatusEnum.COMPLETED}`,
  });
  const [graphLabels, setGraphLabels] = useState<[] | any>([]);

  useEffect(() => {
    const graphLabelsNumbers = new Array(12).fill(0);

    appointmentData.map((appointment) => {
      const appointmentMonth = new Date(appointment.desiredDateTime).getMonth();
      graphLabelsNumbers[appointmentMonth]++;
    });

    console.log(graphLabelsNumbers);
    setGraphLabels(graphLabelsNumbers);
  }, [appointmentData]);

  return (
    <Spin spinning={loading}>
      <LineChartComponent
        graphLabel={'Completed Appointments'}
        tableData={graphLabels}
        labels={[
          'January',
          'February',
          'March',
          'April',
          'May',
          'June',
          'July',
          'August',
          'September',
          'October',
          'November',
          'December',
        ]}
      />
    </Spin>
  );
};

export default CompletedAppointmentsLineGraph;
