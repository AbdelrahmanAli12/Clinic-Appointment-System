import AddressForm from '@/lib/AddressForm';
import { withRoles } from '@/lib/WithRoles';
import { isSuccess, openNotification } from '@/utils';
import { GlobalUserRoleEnum } from '@/utils/constants';
import { AddressSchema } from '@/utils/types';
import { EditOutlined } from '@ant-design/icons';
import { Button, Form, Modal } from 'antd';
import React, { useState } from 'react';

const EditAddress = (props: {
  id: string;
  address: AddressSchema;
  setModelUpdated: (e: any) => void;
}) => {
  const { id, address, setModelUpdated } = props;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const onFinish = async (values: any) => {
    setIsModalOpen(false);
    const reqBody = {
      _id: id,
      address: values,
    };
    const updateAppointmentResult = await fetch('/api/appointments', {
      method: 'PUT',
      body: JSON.stringify(reqBody),
    });
    const result = await updateAppointmentResult.json();
    if (!isSuccess(result))
      return openNotification({
        type: 'error',
        message: `Failed to update appointment : ${result.message ?? ''}`,
      });
    openNotification({
      type: 'success',
      message: `Appointment Address updated successfully`,
    });
    return setModelUpdated(new Date().getTime());
  };
  return (
    <>
      <Button icon={<EditOutlined />} type='primary' onClick={() => setIsModalOpen(true)}>
        View and Edit Address
      </Button>
      <Modal
        title='Edit Address'
        open={isModalOpen}
        onOk={() => setIsModalOpen(false)}
        onCancel={() => setIsModalOpen(false)}
        footer={[]}
        width='50vw'
        className='max-w-lg'
        centered
      >
        <Form name='Update__Address' layout='vertical' onFinish={onFinish}>
          <Form.Item>
            <AddressForm address={address} />
          </Form.Item>
          <Form.Item>
            <Button type='primary' htmlType='submit' className='bg-primary'>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default withRoles(EditAddress, [
  GlobalUserRoleEnum.ADMIN,
  GlobalUserRoleEnum.SCHEDULER,
  GlobalUserRoleEnum.HEALTHCAREUSER,
]);
