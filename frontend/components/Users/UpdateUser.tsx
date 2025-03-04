import { UserContext } from '@/context/UserContext';
import { updateUser, isValidDateOfBirth } from '@/utils';
import { GlobalUserRoleEnum, ResultOperation } from '@/utils/constants';
import { UserInfoProps } from '@/utils/types';
import { EditFilled } from '@ant-design/icons';
import { Button, DatePicker, Form, Input, Modal, Switch } from 'antd';
import React, { useState, useEffect, useContext } from 'react';

const UpdateUser = (props: {
  user: UserInfoProps;
  setPageLoading: (e: boolean) => void;
  pageLoading: boolean;
  setIsModelDataChanged: (e: any) => void;
}) => {
  const [loggedInUser, setLoggedInUser] = useContext(UserContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user, setPageLoading, pageLoading, setIsModelDataChanged } = props;
  const [isEditingAllowed, setIsEditingAllowed] = useState(false);
  useEffect(() => {
    const isUserScheduler = loggedInUser.role === GlobalUserRoleEnum.SCHEDULER;
    const isUserBeingEditedAdminOrScheduler =
      user.role === GlobalUserRoleEnum.ADMIN || user.role === GlobalUserRoleEnum.SCHEDULER;
    setIsEditingAllowed(!(isUserScheduler && isUserBeingEditedAdminOrScheduler));
  }, [loggedInUser, user]);

  async function submitUpdateUser(updateBody: any) {
    setIsModalOpen(false);
    setPageLoading(true);
    if (updateBody.dateOfBirth) {
      updateBody.dateOfBirth = new Date(updateBody.dateOfBirth).getTime();
    }
    updateBody['_id'] = user?._id;
    const result = await updateUser(updateBody);
    if (result === ResultOperation.Success) {
      setIsModelDataChanged(new Date().getTime());
    }
    setPageLoading(false);
  }

  return (
    <>
      {!isEditingAllowed ? (
        ''
      ) : (
        <Button type='primary' icon={<EditFilled />} onClick={() => setIsModalOpen(true)}>
          Edit
        </Button>
      )}

      <Modal open={isModalOpen} onCancel={() => setIsModalOpen(false)} footer={[]}>
        <Form
          name='Create User'
          layout='vertical'
          autoComplete='off'
          className='w-full max-w-[1040px]'
          onFinish={submitUpdateUser}
        >
          <Form.Item
            label='Active'
            name='active'
            rules={[{ required: true }]}
            initialValue={user?.active}
          >
            <Switch defaultChecked={true} style={{ border: '1px solid #C0C0C0' }} />
          </Form.Item>

          <Form.Item name='name' label='Name' initialValue={user?.name}>
            <Input placeholder='Ajay Ambar' />
          </Form.Item>
          <Form.Item
            name='email'
            label='Email Address'
            normalize={(value, prevVal, prevVals) => String(value.trim()).toLowerCase()}
            initialValue={user?.email}
          >
            <Input placeholder='a.example@gmail.com' />
          </Form.Item>
          <Form.Item
            name='dateOfBirth'
            label='Date of birth'
            rules={[{ validator: (_, value) => isValidDateOfBirth(value) }]}
          >
            <DatePicker />
          </Form.Item>

          <Form.Item name='phone' label='Phone' initialValue={user?.phone}>
            <Input placeholder='917428730894' />
          </Form.Item>

          <Form.Item>
            <Button
              htmlType='submit'
              type='primary'
              className='w-1/4'
              loading={pageLoading}
              disabled={pageLoading}
            >
              Update
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default UpdateUser;
