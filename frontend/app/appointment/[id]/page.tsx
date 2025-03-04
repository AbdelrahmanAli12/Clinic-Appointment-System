'use client';

import { useAppointment } from '@/utils/hooks/use-appointment';
import { Descriptions, DescriptionsProps, Spin, Space, Button, Popconfirm } from 'antd';
import React, { useMemo, useState, useContext, useEffect } from 'react';
import {
  AddNotes,
  AssignAppoinemntToHc,
  ChangePaymentMethod,
  ChangeStatus,
  DeleteAppointment,
  EditAddress,
  EditDateTime,
  EditFees,
  MarkPaymentAsReceived,
  UploadAttachment,
} from '@/components/Appointments';
import { AppointmentStatusTag } from '@/lib/AppointmentStatusTag';
import { UserContext } from '@/context/UserContext';
import PageActions from '@/lib/PageActions';
import { MoneyCollectFilled } from '@ant-design/icons';
import { deleteAttachment, fetchAttachment } from '@/utils';
import Link from 'next/link';
import { ROUTES } from '@/utils/constants';
const AppointmentPage = ({ params }: { params: { id: string } }) => {
  const [loggedInUser, _] = useContext(UserContext);
  const [pageLoading, setPageLoading] = useState(false);
  const [modelUpdated, setModelUpdated] = useState<any>('');
  const { appointmentData, loading } = useAppointment({
    refreshToken: modelUpdated,
    query: `?_id=${params.id}`,
  });
  const spinLoading = useMemo(() => pageLoading || loading, [pageLoading, loading]);
  const isDataValid = appointmentData && appointmentData.length > 0;
  const appointment: any = useMemo(
    () => (isDataValid ? appointmentData[0] : {}),
    [appointmentData],
  );

  const healthcareUserInfo: any = useMemo(
    () => appointment?.healthcareUserInfo,
    [appointment?.healthcareUserInfo?.username],
  );
  const patientInfo: any = useMemo(
    () => appointment?.patientInfo,
    [appointment?.patientInfo?.username],
  );

  useEffect(() => {
    let myPara = document.getElementById('appointment_notes');

    if (myPara) {
      myPara.innerHTML = appointment.appointmentNotes ?? '';
    }
  }, [appointment.appointmentNotes]);

  const descriptionItemsTitle: { [key: string]: string } = {
    patientInfo: 'Patient Information',
    healthcareUserInfo: 'Healthcare User Information',
    appointmentInfo: 'Appointment Information',
  };
  async function handleAttachmentClick(filename: string) {
    const _id = appointment._id;
    const file = filename;
    const query = `?_id=${_id}&filename=${file}`;
    const response = await fetchAttachment(query);
    const url = response.data.attachments[0].data;
    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = filename;
    downloadLink.click();
    window.URL.revokeObjectURL(url);
  }
  async function handleDeleteAttachment(fileId: string) {
    const _id = appointment._id;
    const query = `?_id=${_id}&attachmentsId=${fileId}`;
    await deleteAttachment(query);
    setModelUpdated(new Date().getTime());
  }
  const descriptionItems: {
    [key: string]: DescriptionsProps['items'];
  } = isDataValid
    ? {
        appointmentInfo: [
          {
            key: `${appointment._id}-id`,
            label: `Id`,
            children: appointment._id,
          },
          {
            key: `${appointment.paymentMode}-payment`,
            label: `Payment Mode`,
            children: appointment.paymentMode,
          },
          {
            key: `${appointment.status}-status`,
            label: `Status`,
            children: <AppointmentStatusTag status={appointment.status} />,
          },
          {
            key: `${appointment.fees}-fees`,
            label: `Fees`,
            children: (
              <Space>
                <MoneyCollectFilled />
                {appointment.fees}
              </Space>
            ),
          },
          {
            key: `${appointment.desiredDateTime}-date`,
            label: `Desired Date`,
            children: new Date(appointment.desiredDateTime).toLocaleDateString(),
          },
          {
            key: `${appointment.desiredDateTime}-desiredTime`,
            label: `Desired Time`,
            children: new Date(appointment.desiredDateTime).toLocaleTimeString(),
          },
          {
            key: `${appointment.attachments}-attachments`,
            label: `Attachments`,
            children: appointment.attachments?.map((attachment: any, index: number) => (
              <Popconfirm
                key={`attachment-${index}`}
                title={`attachment-${index}`}
                onConfirm={() => handleAttachmentClick(attachment?.filename)}
                onCancel={() => handleDeleteAttachment(attachment?._id)}
                okText='Download'
                cancelText='Delete'
                className='m-1'
              >
                <Button>{attachment?.filename}</Button>
              </Popconfirm>
            )),
          },
        ],

        patientInfo: [
          {
            key: `${appointment._id}-${patientInfo?.username}-key`,
            label: `Name`,
            children: (
              <Link
                style={{ textDecoration: 'underline' }}
                href={`${ROUTES.USERPAGE}/${patientInfo?._id}`}
              >
                {patientInfo?.name}
              </Link>
            ),
          },
          {
            key: `${appointment._id}-${patientInfo?.phone}-phone`,
            label: `Phone Number`,
            children: patientInfo?.phone,
          },
          {
            key: `${appointment._id}-${patientInfo?.email}-email`,
            label: `Email Address`,
            children: patientInfo?.email,
          },
        ],
        healthcareUserInfo: [
          {
            key: `${appointment._id}-${healthcareUserInfo?.username}-key`,
            label: `Name`,
            children: healthcareUserInfo?.name,
          },
          {
            key: `${appointment._id}-${healthcareUserInfo?.phone}-phone`,
            label: `Phone Number`,
            children: healthcareUserInfo?.phone,
          },
          {
            key: `${appointment._id}-${healthcareUserInfo?.email}-email`,
            label: `Email Address`,
            children: healthcareUserInfo?.email,
          },
        ],
      }
    : {};

  return (
    <Spin spinning={spinLoading} size='large'>
      <section id='appointment_info_section' className='w-screen h-max max-w-[1040px] p-10'>
        {appointment && (
          <>
            <Space className='text-4xl  m-2'>Appointment Details</Space>
            <PageActions>
              <EditDateTime
                id={appointment._id}
                oldDate={new Date(appointment.desiredDateTime).toLocaleDateString()}
                oldTime={new Date(appointment.desiredDateTime).toLocaleTimeString()}
                setModelUpdated={setModelUpdated}
              ></EditDateTime>
              <ChangeStatus
                id={appointment?._id}
                oldStatus={appointment?.status}
                role={loggedInUser?.role}
                setModelUpdated={setModelUpdated}
              />
              <AddNotes
                preParsedNote={appointment.appointmentNotes ?? ''}
                id={appointment?._id}
                setPageLoading={setPageLoading}
                setModelUpdated={setModelUpdated}
              />
              <ChangePaymentMethod
                id={appointment?._id}
                oldPaymentMode={appointment?.paymentMode}
                setModelUpdated={setModelUpdated}
              />
              <MarkPaymentAsReceived
                id={appointment?._id}
                isPaymentReceived={appointment?.isPaymentReceived}
                oldPaymentMode={appointment?.paymentMode}
                setModelUpdated={setModelUpdated}
              />
              <EditAddress
                id={appointment?._id}
                address={appointment?.address}
                setModelUpdated={setModelUpdated}
              />
              <AssignAppoinemntToHc
                id={appointment?._id}
                oldHealthcareUser={appointment?.healthcareUserInfo?.name}
                setModelUpdated={setModelUpdated}
              />
              <UploadAttachment
                id={appointment?._id}
                currentAttachments={appointment?.attachments}
                setModelUpdated={setModelUpdated}
              />
              <EditFees
                id={appointment?._id}
                currentFees={appointment?.fees}
                setModelUpdated={setModelUpdated}
              />
              <DeleteAppointment iconOnly={false} id={appointment?._id} />
            </PageActions>

            {Object.keys(descriptionItems).map((item) => (
              <Descriptions
                key={`${item}-appointment?._id-${descriptionItems[item]}`}
                style={{
                  width: '100%',
                }}
                title={descriptionItemsTitle[item]}
                layout='vertical'
                bordered
                items={descriptionItems[item]}
              />
            ))}
          </>
        )}

        <div className='w-full mb-5 mt-5 flex flex-col justify-start items-start outline-dashed p-1'>
          <h3 className='text-lg'>
            <strong>Appointment Notes</strong>
          </h3>
          <div id='appointment_notes'></div>
        </div>
      </section>
    </Spin>
  );
};

export default AppointmentPage;
