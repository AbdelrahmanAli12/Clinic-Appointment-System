import React from 'react';
import { Button, DatePicker, Form, Input, Select, Switch } from 'antd';
import {
  getUserRoles,
  isValidEmail,
  isValidDateOfBirth,
  isValidPhoneNumber,
  openNotification,
} from '@/utils';
import { GlobalUserRoleEnum } from '@/utils/constants';
import { UserInfoProps } from '@/utils/types';
import { withRoles } from '@/lib/WithRoles';
const { Option } = Select;

const userRoles = getUserRoles();

interface internalProps {
  setloading: (value: boolean) => void;
  setOpen: (newValue: boolean) => void;
  setModelUpdated: (newValue: any) => void;
}
const CreateUserForm = (props: internalProps) => {
  const { setloading, setModelUpdated, setOpen } = props;
  const [form] = Form.useForm();

  async function createUser(userInfo: UserInfoProps) {
    try {
      userInfo.dateOfBirth = new Date(userInfo.dateOfBirth).getTime();
      setloading(true);
      const response = await fetch('/api/users', {
        method: 'POST',
        body: JSON.stringify(userInfo),
      });

      const result = await response.json();
      openNotification({
        type: response.status === 200 ? 'success' : 'error',
        message:
          response.status === 200
            ? `${userInfo.name} has been created successfully`
            : result.message ?? 'API Failed to create user',
      });
      if (response.status === 200) {
        setModelUpdated(new Date().getTime());
        setOpen(false);
        form.resetFields();
      }
    } catch (error) {
      console.log('Error while creating user ', error);
      openNotification({
        type: 'error',
        message: `API Failure: ${error}`,
      });
    } finally {
      setloading(false);
    }
  }
  return (
    <Form
      form={form}
      name='Create User'
      layout='vertical'
      autoComplete='off'
      className='w-full max-w-[1040px]'
      onFinish={createUser}
    >
      <Form.Item label='Active' name='active' rules={[{ required: true }]} initialValue={true}>
        <Switch defaultChecked={true} style={{ border: '1px solid black' }} />
      </Form.Item>
      <Form.Item
        name='username'
        label='Username'
        rules={[{ required: true }]}
        normalize={(value, prevVal, prevVals) => String(value.trim()).toLowerCase()}
      >
        <Input placeholder='Input a unique username for the user' />
      </Form.Item>
      <Form.Item name='name' label='Name' rules={[{ required: true }]}>
        <Input placeholder='Ajay Ambar' />
      </Form.Item>
      <Form.Item
        name='email'
        label='Email Address'
        rules={[
          () => ({
            validator(_, value) {
              if (!value || isValidEmail(value)) {
                return Promise.resolve();
              }
              return Promise.reject(new Error(`${value} is not a valid email address.`));
            },
          }),
        ]}
        normalize={(value, prevVal, prevVals) => String(value.trim()).toLowerCase()}
      >
        <Input placeholder='a.example@gmail.com' />
      </Form.Item>
      <Form.Item
        name='dateOfBirth'
        label='Date of birth'
        rules={[
          { required: true, message: 'Please select a date of birth' },
          { validator: (_, value) => isValidDateOfBirth(value) },
        ]}
      >
        <DatePicker />
      </Form.Item>
      <Form.Item name='password' label='Password' rules={[{ required: true }]}>
        <Input.Password placeholder='t@HLpRl6HLj9pho78-Re' />
      </Form.Item>
      <Form.Item
        name='phone'
        label='Phone'
        rules={[
          () => ({
            required: true,
            validator(_, value) {
              if (!value || isValidPhoneNumber(value)) {
                return Promise.resolve();
              }
              return Promise.reject(new Error(`${value} is not a valid phone number.`));
            },
          }),
        ]}
      >
        <Input placeholder='917428730894' />
      </Form.Item>
      <Form.Item name='role' label='Role' rules={[{ required: true }]}>
        <Select placeholder='Select a user role'>
          {userRoles.map((role: any) => (
            <Option key={role.value} value={role.value}>
              {role.text}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item>
        <Button htmlType='submit' className='w-1/4'>
          Create
        </Button>
      </Form.Item>
    </Form>
  );
};

export default withRoles(CreateUserForm, [GlobalUserRoleEnum.ADMIN, GlobalUserRoleEnum.SCHEDULER]);
