import React, { useEffect, useState } from 'react';
import { useAppointment } from './use-appointment';
import { GlobalAppointmentStatusEnum } from '../constants';

export interface DashboardProps {
  identifier?: string;
  identifierValue?: any;
}

const useDashboard = (props: DashboardProps) => {
  const { identifier, identifierValue } = props;
  const { loading, appointmentData } = useAppointment({
    query: identifier && identifierValue ? `?${identifier}=${identifierValue}` : '',
  });
  const [allUsers, setAllUsers] = useState<string[]>([]);
  const [allZipCodes, setAllZipCodes] = useState([]);
  const [startedAppointments, setStartedAppointments] = useState(0);
  const [pendingAppointments, setPendingAppointments] = useState(0);
  const [acceptedAppointments, setAcceptedAppointments] = useState(0);
  const [suspendedAppointments, setSuspendedAppointments] = useState(0);
  const [visitDoneAppointments, setVisitDoneAppointments] = useState(0);
  const [rejectedAppointments, setRejectedAppointments] = useState(0);
  const [defferedAppointments, setDefferedAppointments] = useState(0);

  useEffect(() => {
    function getAppointmentsCount() {
      let startedAppointmentsCount = 0;
      let pendingAppointmentsCount = 0;
      let suspendedAppointmentsCount = 0;
      let acceptedAppointmentsCount = 0;
      let visitDoneAppointmentsCount = 0;
      let rejectedAppointmentsCount = 0;
      let defferedAppointmentsCount = 0;

      [...appointmentData].map((appointment) => {
        switch (String(appointment.status).toLowerCase()) {
          case GlobalAppointmentStatusEnum.STARTED:
            startedAppointmentsCount++;
            break;
          case GlobalAppointmentStatusEnum.PENDING:
            pendingAppointmentsCount++;
            break;
          case GlobalAppointmentStatusEnum.ACCEPTED:
            acceptedAppointmentsCount++;
            break;
          case GlobalAppointmentStatusEnum.REJECTED:
            rejectedAppointmentsCount++;
            break;
          case GlobalAppointmentStatusEnum.DEFERRED:
            defferedAppointmentsCount++;
            break;
          case GlobalAppointmentStatusEnum.SUSPENDED:
            suspendedAppointmentsCount++;
            break;
          case GlobalAppointmentStatusEnum.VISITDONE:
            visitDoneAppointmentsCount++;
            break;
          default:
            break;
        }
      });

      setStartedAppointments(startedAppointmentsCount);
      setPendingAppointments(pendingAppointmentsCount);
      setAcceptedAppointments(acceptedAppointmentsCount);
      setSuspendedAppointments(suspendedAppointmentsCount);
      setVisitDoneAppointments(visitDoneAppointmentsCount);
      setRejectedAppointments(rejectedAppointmentsCount);
      setDefferedAppointments(defferedAppointmentsCount);
    }

    function getAppointmentUsers() {
      setAllUsers(
        [...appointmentData].map(
          (appointment) =>
            appointment.healthcareUser?.name ?? appointment.healthcareUser?.username ?? '',
        ),
      );
    }

    getAppointmentsCount();
    getAppointmentUsers();
  }, [appointmentData]);

  return {
    loading,
    allUsers,
    startedAppointments,
    defferedAppointments,
    rejectedAppointments,
    visitDoneAppointments,
    suspendedAppointments,
    acceptedAppointments,
    pendingAppointments,
    allZipCodes,
  };
};

export default useDashboard;
