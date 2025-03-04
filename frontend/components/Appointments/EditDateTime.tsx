import { withRoles } from '@/lib/WithRoles';
import { isSuccess, openNotification } from '@/utils';
import { GlobalUserRoleEnum } from '@/utils/constants';
import { FieldTimeOutlined } from '@ant-design/icons';
import { Button, DatePicker, Form, Input, Modal, Space } from 'antd';
import React, { useState } from 'react';

const EditDateTime = (props: {
  id: string;
  oldDate: string;
  oldTime: string;
  setModelUpdated: (e: any) => void;
}) => {
  const { id, oldDate, oldTime, setModelUpdated } = props;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const onFinish = async (values: any) => {
    setIsModalOpen(false);
    const dateTime = new Date(values.desiredDateTime).getTime();
    const reqBody = {
      _id: id,
      desiredDateTime: dateTime,
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
      <Button icon={<FieldTimeOutlined />} type='primary' onClick={() => setIsModalOpen(true)}>
        Edit Date and Time
      </Button>
      <Modal
        title='Edit date and time'
        open={isModalOpen}
        onOk={() => setIsModalOpen(false)}
        onCancel={() => setIsModalOpen(false)}
        footer={[]}
        width='50vw'
        className='max-w-lg'
        centered
      >
        <Space>
          Current Date :{oldDate} Current Time :{oldTime}
        </Space>
        <Form layout='vertical' onFinish={onFinish}>
          <Form.Item
            label='Select Date and Time'
            name='desiredDateTime'
            rules={[
              { required: true, message: 'Please select a date!' },
              () => ({
                validator(_, value) {
                  const submittedDate = new Date(value).getTime();
                  if (!value || submittedDate >= new Date().getTime()) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Appointment date must not be in the past.'));
                },
              }),
            ]}
          >
            <DatePicker showTime format='MM-DD-YYYY HH:mm' />
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

export default withRoles(EditDateTime, [
  GlobalUserRoleEnum.ADMIN,
  GlobalUserRoleEnum.SCHEDULER,
  GlobalUserRoleEnum.HEALTHCAREUSER,
]);
