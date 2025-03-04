'use client';
import { withRoles } from '@/lib/WithRoles';
import { openNotification } from '@/utils';
import { GlobalUserRoleEnum, ROUTES } from '@/utils/constants';
import { DisconnectOutlined } from '@ant-design/icons';
import { Button, Popconfirm } from 'antd';
import { useRouter } from 'next/navigation';
import React from 'react';

interface DeleteUserProps {
  iconOnly?: boolean;
  id: string;
  setIsModelDataChanged: (e: any) => void;
  active: boolean;
}

const DeleteUser: React.FC<DeleteUserProps> = ({ id, iconOnly, setIsModelDataChanged, active }) => {
  const router = useRouter();

  const deleteUser = async () => {
    const deleteUserResponse = await fetch(`/api/users`, {
      method: 'DELETE',
      body: JSON.stringify({
        id: id,
      }),
    });

    const result = await deleteUserResponse.json();
    openNotification({
      type: deleteUserResponse.status === 200 ? 'success' : 'error',
      message:
        deleteUserResponse.status === 200
          ? `User has been deleted successfully`
          : result.message ?? 'API Failed to delete user',
    });

    if (deleteUserResponse.ok) {
      setIsModelDataChanged(new Date().getTime());
    }
  };

  return (
    <Popconfirm
      title='Deactivate user'
      description='Are you sure to deactivate this user?'
      onConfirm={deleteUser}
      okText='Yes'
      cancelText='No'
      placement='bottom'
    >
      <Button danger icon={<DisconnectOutlined />} disabled={!active}>
        {!iconOnly && 'Deactivate'}
      </Button>
    </Popconfirm>
  );
};

export default withRoles(DeleteUser, [GlobalUserRoleEnum.ADMIN, GlobalUserRoleEnum.SCHEDULER]);
