'use client';

import { Button, Form, Modal, Select, Statistic } from 'antd';
import { useState } from 'react';
import { EditFilled } from '@ant-design/icons';
import { GlobalAppointmentStatusEnum, GlobalUserRoleEnum, ROUTES } from '@/utils/constants';
import { isSuccess, openNotification, updateAppointment } from '@/utils';
import { ResultProps } from '@/utils/types';
import { withRoles } from '@/lib/WithRoles';
import { useRouter } from 'next/navigation';

const { Option } = Select;

const ChangeStatus = (props: {
  id: string;
  oldStatus: string;
  role: string;
  setModelUpdated: (e: any) => void;
}) => {
  const { id, oldStatus, setModelUpdated } = props;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const router = useRouter();

  const onFinish = async (values: any) => {
    setIsModalOpen(false);
    const reqBody = {
      ...values,
      _id: id,
    };
    const updateAppointmentResult: ResultProps = await updateAppointment(reqBody);

    if (!isSuccess(updateAppointmentResult))
      return openNotification({
        type: 'error',
        message: `Failed to update appointment : ${updateAppointmentResult.message ?? ''}`,
      });
    openNotification({
      type: 'success',
      message: `Status updated successfully`,
    });
    if (values.status === GlobalAppointmentStatusEnum.COMPLETED) {
      router.push(ROUTES.APPOINTMENTPAGE);
    }

    return setModelUpdated(new Date().getTime());
  };

  const appointmentStatuses = Object.values(GlobalAppointmentStatusEnum);

  return (
    <>
      <Button
        hidden={oldStatus ? false : true}
        onClick={() => setIsModalOpen(true)}
        icon={<EditFilled />}
        type='primary'
        className='bg-primary'
      >
        Change Status
      </Button>
      <Modal
        title='Change Status'
        open={isModalOpen}
        onOk={() => setIsModalOpen(false)}
        onCancel={() => setIsModalOpen(false)}
        footer={[]}
        width='80vw'
        className='w-80 max-w-lg'
        centered
      >
        <Statistic
          title='Current Status'
          value={String(oldStatus).toUpperCase()}
          className='mb-5'
        />
        <Form form={form} name='control-hooks' onFinish={onFinish} style={{ maxWidth: 600 }}>
          <Form.Item name='status' label='Status' rules={[{ required: true }]}>
            <Select placeholder='Select an option to change status' allowClear>
              {appointmentStatuses.map(
                (status) =>
                  status !== oldStatus && (
                    <Option key={status}>{String(status).toLocaleUpperCase()}</Option>
                  ),
              )}
            </Select>
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

export default withRoles(ChangeStatus, [
  GlobalUserRoleEnum.ADMIN,
  GlobalUserRoleEnum.SCHEDULER,
  GlobalUserRoleEnum.HEALTHCAREUSER,
]);
