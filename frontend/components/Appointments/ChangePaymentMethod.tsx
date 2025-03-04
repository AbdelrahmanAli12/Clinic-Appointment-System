import { GlobalPaymentMethodEnum, GlobalUserRoleEnum } from '@/utils/constants';
import React, { useState } from 'react';
import { isSuccess, openNotification, updateAppointmentController } from '@/utils';
import { CreditCardOutlined } from '@ant-design/icons';
import { Button, Form, Modal, Select, Statistic } from 'antd';
import { withRoles } from '@/lib/WithRoles';
import { ResultProps } from '@/utils/types';

const ChangePaymentMethod = (props: {
  id: string;
  oldPaymentMode: string;
  setModelUpdated: (e: any) => void;
}) => {
  const { id, oldPaymentMode, setModelUpdated } = props;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const onFinish = async (values: any) => {
    const reqBody = {
      paymentMode: values.paymentMode,
      _id: id,
    };
    const updateAppointmentResult: ResultProps = await updateAppointmentController(reqBody);

    if (!isSuccess(updateAppointmentResult))
      return openNotification({
        type: 'error',
        message: `Failed to update appointment : ${updateAppointmentResult.message ?? ''}`,
      });
    setModelUpdated(new Date().getTime());
    return openNotification({
      type: 'success',
      message: `Payment method updated successfully`,
    });
  };

  return (
    <>
      <Button type='primary' icon={<CreditCardOutlined />} onClick={() => setIsModalOpen(true)}>
        Change Payment Method
      </Button>
      <Modal
        title='Change Payment Method'
        open={isModalOpen}
        onOk={() => setIsModalOpen(false)}
        onCancel={() => setIsModalOpen(false)}
        footer={[]}
        width='80vw'
        className='w-80 max-w-lg'
        centered
      >
        <Statistic title='Current Payment Mode' value={oldPaymentMode ?? '-'} className='mb-5' />
        <Form form={form} layout='vertical' onFinish={onFinish}>
          <Form.Item label='Payment Method' name='paymentMode'>
            <Select>
              {Object.values(GlobalPaymentMethodEnum).map((paymentMode: any) => (
                <Select.Option key={paymentMode} value={paymentMode}>
                  {paymentMode}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <Button
              type='primary'
              htmlType='submit'
              onClick={() => {
                setIsModalOpen(false);
              }}
            >
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default withRoles(ChangePaymentMethod, [
  GlobalUserRoleEnum.ADMIN,
  GlobalUserRoleEnum.SCHEDULER,
  GlobalUserRoleEnum.HEALTHCAREUSER,
]);
