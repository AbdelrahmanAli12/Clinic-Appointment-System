import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { AppointmentProps } from '@/utils/types';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useRouter } from 'next/navigation';

interface AppointmentCalendarProps {
  appointments: AppointmentProps[];
}

function getCalendarEvents(appointments: AppointmentProps[]) {
  return Array(1).fill(
    appointments.map((appointment) => {
      return {
        id: appointment._id,
        title: appointment.patientInfo?.name,
        start: new Date(appointment.desiredDateTime ?? ''),
      };
    }),
  )[0];
}
const Calendar: React.FC<AppointmentCalendarProps> = ({ appointments }) => {
  const router = useRouter();
  const calendarEvents = getCalendarEvents(appointments);
  return (
    <section id='calendar-view' className='mt-5 mb-5'>
      <FullCalendar
        aspectRatio={1}
        headerToolbar={{
          left: 'title',
          right: 'today prev,next',
          center: 'dayGridMonth,timeGridWeek,timeGridDay',
        }}
        handleWindowResize
        events={calendarEvents ?? []}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        selectable={true}
        weekends={false}
        eventClick={(e) => router.push(`/appointment/${e.event._def.publicId}`)}
      />
    </section>
  );
};

export default Calendar;
