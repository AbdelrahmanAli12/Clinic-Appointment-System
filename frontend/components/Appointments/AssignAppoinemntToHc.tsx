import { GlobalUserRoleEnum } from '@/utils/constants';
import React, { useState } from 'react';
import { assignAppointmentToHealthcareUser } from '@/utils';
import { UsergroupAddOutlined } from '@ant-design/icons';
import { Button, Form, Modal, Select, Statistic } from 'antd';
import { withRoles } from '@/lib/WithRoles';
import useUsers from '@/utils/hooks/use-users';

const AssignAppointmentToHc = (props: {
  id: string;
  oldHealthcareUser: string;
  setModelUpdated: (e: any) => void;
}) => {
  const { allUsers } = useUsers({});
  const healthcareUsers = allUsers.filter(
    (user) => user.role === GlobalUserRoleEnum.HEALTHCAREUSER,
  );
  const { id, oldHealthcareUser } = props;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const onFinish = async (values: any) => {
    const reqBody = {
      healthcareUserId: values.healthcareUser,
      _id: id,
    };

    await assignAppointmentToHealthcareUser(reqBody);
    props.setModelUpdated(new Date().getTime());
  };

  return (
    <section>
      <>
        <Button type='primary' icon={<UsergroupAddOutlined />} onClick={() => setIsModalOpen(true)}>
          Assign Healthcare user
        </Button>
        <Modal
          title='Assign'
          open={isModalOpen}
          onOk={() => setIsModalOpen(false)}
          onCancel={() => setIsModalOpen(false)}
          footer={[]}
          className='w-80 max-w-lg'
          centered
        >
          <Statistic title='Current healthcare user' value={oldHealthcareUser ?? '-'} />
          <Form form={form} layout='vertical' onFinish={onFinish}>
            <Form.Item label='Healthcare User' name='healthcareUser'>
              <Select showSearch>
                {healthcareUsers.map((user) => (
                  <Select.Option key={user._id} value={user._id}>
                    {user.name}
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
    </section>
  );
};

export default withRoles(AssignAppointmentToHc, [
  GlobalUserRoleEnum.ADMIN,
  GlobalUserRoleEnum.SCHEDULER,
]);
