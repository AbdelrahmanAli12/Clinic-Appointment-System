import { useEffect, useState } from 'react';
import { fetchAppointment, openNotification } from '..';
import { ResultOperation } from '../constants';
import { AppointmentProps } from '../types';

interface UseAppointmentProps {
  query?: string;
  refreshToken?: any;
}

export const useAppointment = (props: UseAppointmentProps) => {
  const { query, refreshToken } = props;
  const [appointmentData, setAppointmentData] = useState<AppointmentProps[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function getAppointment() {
      setLoading(true);
      try {
        const getAppointmentResult = await fetchAppointment(query ?? '');

        if (getAppointmentResult.operation !== ResultOperation.Success) {
          openNotification({
            message: `API Failure : ${getAppointmentResult.message}`,
            type: 'error',
          });
          return setAppointmentData([]);
        }
        setAppointmentData(
          Array.isArray(getAppointmentResult.data) ? getAppointmentResult.data : [],
        );
      } catch (error) {
        console.log('Error getting appointment ', error);
        openNotification({
          message: `API Failure : ${error}`,
          type: 'error',
        });
      } finally {
        setLoading(false);
      }
    }

    getAppointment();
  }, [refreshToken]);

  return { appointmentData, loading };
};
