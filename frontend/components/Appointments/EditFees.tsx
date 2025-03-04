import { withRoles } from '@/lib/WithRoles';
import { isSuccess, openNotification } from '@/utils';
import { GlobalUserRoleEnum } from '@/utils/constants';
import { MoneyCollectOutlined } from '@ant-design/icons';
import { Button, Form, Input, Modal } from 'antd';
import React, { useState } from 'react';

const EditFees = (props: {
  id: string;
  currentFees: number;
  setModelUpdated: (e: any) => void;
}) => {
  const { id, currentFees, setModelUpdated } = props;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const onFinish = async (values: any) => {
    setIsModalOpen(false);
    const reqBody = {
      _id: id,
      fees: values.EditFees,
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
      message: `Appointment Fees updated successfully`,
    });
    return setModelUpdated(new Date().getTime());
  };
  return (
    <>
      <Button icon={<MoneyCollectOutlined />} type='primary' onClick={() => setIsModalOpen(true)}>
        Edit Fees
      </Button>
      <Modal
        title='Edit Fess'
        open={isModalOpen}
        onOk={() => setIsModalOpen(false)}
        onCancel={() => setIsModalOpen(false)}
        footer={[]}
        width='50vw'
        className='max-w-lg'
        centered
      >
        <Form layout='vertical' onFinish={onFinish}>
          <Form.Item name='EditFees' label='Change Fees' initialValue={currentFees}>
            <Input type='number' value={currentFees}></Input>
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

export default withRoles(EditFees, [
  GlobalUserRoleEnum.ADMIN,
  GlobalUserRoleEnum.SCHEDULER,
  GlobalUserRoleEnum.HEALTHCAREUSER,
]);
