import { GlobalUserRoleEnum } from '@/utils/constants';
import React, { useState } from 'react';
import { isSuccess, openNotification, updateAppointmentController } from '@/utils';
import { CheckOutlined } from '@ant-design/icons';
import { Button, Form, Modal, Space, Statistic } from 'antd';
import { withRoles } from '@/lib/WithRoles';
import { ResultProps } from '@/utils/types';

const MarkPaymentAsReceived = (props: {
  id: string;
  isPaymentReceived: boolean;
  oldPaymentMode: string;
  setModelUpdated: (e: any) => void;
}) => {
  const { id, isPaymentReceived, oldPaymentMode, setModelUpdated } = props;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const onFinish = async (values: any) => {
    const reqBody = {
      isPaymentReceived: values.isPaymentReceived,
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
      message: `Appointment updated successfully`,
    });
  };

  return (
    <section>
      {!isPaymentReceived ? (
        <>
          <Button type='primary' icon={<CheckOutlined />} onClick={() => setIsModalOpen(true)}>
            Payment
          </Button>
          <Modal
            title='Payment'
            open={isModalOpen}
            onOk={() => setIsModalOpen(false)}
            onCancel={() => setIsModalOpen(false)}
            footer={[]}
            width='80vw'
            className='w-80 max-w-lg'
            centered
          >
            <Statistic value={isPaymentReceived ? 'Complete' : 'Incomplete'} className='mb-5' />
            <Form form={form} layout='vertical' onFinish={onFinish}>
              <Form.Item name='isPaymentReceived'>
                <h2>Are you sure you want to mark the payment of this appointment as received?</h2>
              </Form.Item>
              {oldPaymentMode === undefined ? (
                <>
                  <Space style={{ color: 'red' }}>
                    You must choose a payment method before proceeding with this step
                  </Space>
                </>
              ) : (
                <>
                  <Space className='flex flex-row'>
                    <Form.Item>
                      <Button
                        type='primary'
                        htmlType='submit'
                        onClick={() => {
                          setIsModalOpen(false);
                          form.setFieldsValue({ isPaymentReceived: true });
                        }}
                      >
                        Yes
                      </Button>
                    </Form.Item>
                    <Form.Item>
                      <Button
                        type='primary'
                        htmlType='button'
                        onClick={() => {
                          setIsModalOpen(false);
                        }}
                      >
                        No
                      </Button>
                    </Form.Item>
                  </Space>
                </>
              )}
            </Form>
          </Modal>
        </>
      ) : (
        <Button type='primary' disabled>
          <p style={{ color: '#29374d' }}>Payment has already been received.</p>
        </Button>
      )}
    </section>
  );
};

export default withRoles(MarkPaymentAsReceived, [
  GlobalUserRoleEnum.ADMIN,
  GlobalUserRoleEnum.SCHEDULER,
  GlobalUserRoleEnum.HEALTHCAREUSER,
]);
