'use client';
import { withRoles } from '@/lib/WithRoles';
import { openNotification } from '@/utils';
import { GlobalUserRoleEnum, ROUTES } from '@/utils/constants';
import { DeleteOutlined } from '@ant-design/icons';
import { Button, Popconfirm } from 'antd';
import { useRouter } from 'next/navigation';
import React from 'react';

interface DeleteAppointmentProps {
  iconOnly?: boolean;
  id: string;
}

const DeleteAppointment: React.FC<DeleteAppointmentProps> = ({ id, iconOnly }) => {
  const router = useRouter();

  const deleteAppointment = async () => {
    const deleteAppointmentResponse = await fetch(`/api/appointments`, {
      method: 'DELETE',
      body: JSON.stringify({
        id: id,
      }),
    });

    const result = await deleteAppointmentResponse.json();
    openNotification({
      type: deleteAppointmentResponse.status === 200 ? 'success' : 'error',
      message:
        deleteAppointmentResponse.status === 200
          ? `Appoointment has been deleted successfully`
          : result.message ?? 'API Failed to delete appoointment',
    });
    if (deleteAppointmentResponse.ok) {
      router.push(ROUTES.APPOINTMENTPAGE);
    }
  };

  return (
    <Popconfirm
      title='Delete the apppointment'
      description='Are you sure to delete this apppointment?'
      onConfirm={deleteAppointment}
      okText='Yes'
      cancelText='No'
      placement='bottom'
    >
      <Button danger icon={<DeleteOutlined />}>
        {!iconOnly && 'Delete'}
      </Button>
    </Popconfirm>
  );
};

export default withRoles(DeleteAppointment, [
  GlobalUserRoleEnum.ADMIN,
  GlobalUserRoleEnum.SCHEDULER,
]);
