import { UserAddOutlined } from '@ant-design/icons';
import { Button, Drawer, Space } from 'antd';
import React, { useState } from 'react';
import { CreateUserForm } from '.';
import { CreateComponentPorps } from '@/utils/types';
import { withRoles } from '@/lib/WithRoles';
import { GlobalUserRoleEnum } from '@/utils/constants';

interface CreateUserProps extends CreateComponentPorps {
  view: 'appointment' | 'user';
}

const CreateUser: React.FC<CreateUserProps> = ({ setModelUpdated, setLoading, loading, view }) => {
  const [open, setOpen] = useState(false);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };
  return (
    <>
      <Button
        icon={<UserAddOutlined />}
        type={view === 'appointment' ? 'text' : 'primary'}
        onClick={showDrawer}
      >
        Create User
      </Button>
      <Drawer
        title={
          <Space>
            <UserAddOutlined className='text-xl' />
            <h1 className='text-xl'>New User</h1>
          </Space>
        }
        placement='bottom'
        onClose={onClose}
        open={open}
        height={window && window?.innerWidth < 640 ? '70vh' : '50vh'}
        className='max-h-[1020px]'
      >
        <CreateUserForm
          loading={loading}
          setloading={setLoading}
          setModelUpdated={setModelUpdated}
          setOpen={setOpen}
        />
      </Drawer>
    </>
  );
};

export default withRoles(CreateUser, [GlobalUserRoleEnum.ADMIN, GlobalUserRoleEnum.SCHEDULER]);
