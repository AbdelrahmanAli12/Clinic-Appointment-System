import React, { useState } from 'react';
import { Form, DatePicker, Select, Upload, Button, Input, Space, Divider } from 'antd';
import { createAppointment, openNotification } from '@/utils';
import {
  GlobalPaymentMethodEnum,
  GlobalUserRoleEnum,
  ROUTES,
  ResultOperation,
} from '@/utils/constants';
import useUsers from '@/utils/hooks/use-users';
import {
  AddressSchema,
  AppointmentProps,
  CreateComponentPorps,
  UserInfoProps,
} from '@/utils/types';
import { useRouter } from 'next/navigation';
import { CreateUser } from '../Users';
import AddressForm from '@/lib/AddressForm';

interface CreateAppointmentFormProps extends CreateComponentPorps {
  modelUpdated: any;
}

function getUser(username: string, users: UserInfoProps[]) {
  return [...users].filter((user) => user.username === username)[0];
}

const CreateAppointmentForm: React.FC<CreateAppointmentFormProps> = ({
  loading,
  setLoading,
  setModelUpdated,
  modelUpdated,
}) => {
  const { allUsers } = useUsers({ refreshToken: modelUpdated });
  const [selectedPatient, setSelectedPatient] = useState<UserInfoProps | any>({});
  const patients = allUsers.filter((user) => user.role === GlobalUserRoleEnum.PATIENT);
  const healthcareUsers = allUsers.filter(
    (user) => user.role === GlobalUserRoleEnum.HEALTHCAREUSER,
  );
  const [form] = Form.useForm();
  const router = useRouter();

  const onFinish = async (values: any) => {
    try {
      setLoading(true);
      const dateTime = new Date(values.desiredDateTime).getTime();
      const patient_Id = getUser(values.patient, patients)?._id;
      const healthcareUser_Id = getUser(values.healthcareUser, healthcareUsers)?._id;

      const body = {
        desiredDateTime: dateTime,
        patient: patient_Id,
        healthcareUser: healthcareUser_Id,
        appointmentNotes: values.appointmentNotes,
        paymentMode: values.paymentMode,
        fees: values.fees,
        address: {
          street: values.street ?? '',
          city: values.city ?? '',
          state: values.state ?? '',
          postalCode: values.postalCode ?? '',
          zipCode: values.zipCode ?? '',
          country: values.country ?? '',
          villaBuildingNum: values.villaBuildingNum ?? '',
          floorNum: values.floorNum ?? '',
          appartmentNum: values.appartmentNum ?? '',
          extraDirections: values.extraDirections ?? '',
        },
      };

      const createAppointmentResponse = await createAppointment(body);
      if (createAppointmentResponse != ResultOperation.Success) return;
      form.resetFields();
      router.push(ROUTES.APPOINTMENTPAGE);
    } catch (error) {
      console.error('Error creating appointment:', error);
      return openNotification({
        type: 'error',
        message: `API Failure: ${error}`,
      });
    } finally {
      setLoading(false);
    }
  };

  function handlePatientChange(patientUsername: any) {
    const patient: UserInfoProps = getUser(patientUsername, patients);
    setSelectedPatient(patient);

    const address: AddressSchema | any = patient?.address?.length > 0 ? patient.address[0] : [];
    form.setFieldsValue({
      floorNum: address?.floorNum,
      city: address?.city,
      postalCode: address?.postalCode,
      zipCode: address?.zipCode,
      appartmentNum: address?.appartmentNum,
      extraDirections: address?.extraDirections,
      country: address?.country,
      state: address?.state,
      street: address?.street,
    });
  }
  return (
    <Form
      form={form}
      name='Create Appointment'
      layout='vertical'
      autoComplete='off'
      className='w-full max-w-[1040px]'
      onFinish={onFinish}
    >
      <Space className='flex flex-row'>
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
        <Form.Item label='Status' name='status' initialValue='PENDING'>
          <Input disabled />
        </Form.Item>
      </Space>
      <Form.Item
        label='Patient'
        name='patient'
        rules={[{ required: true, message: 'Please select a patient!' }]}
      >
        <Select
          showSearch
          loading={loading}
          onChange={handlePatientChange}
          dropdownRender={(menu) => (
            <>
              {menu}
              <Divider style={{ margin: '8px 0' }} />
              <Space style={{ padding: '0 8px 4px' }}>
                <CreateUser
                  loading={loading}
                  setLoading={setLoading}
                  setModelUpdated={setModelUpdated}
                  view='appointment'
                />
              </Space>
            </>
          )}
          options={patients.map((user) => ({ label: user.username, value: user.username }))}
        />
      </Form.Item>
      <Form.Item label='Healthcare User' name='healthcareUser'>
        <Select
          showSearch
          loading={loading}
          options={healthcareUsers.map((user) => ({ label: user.username, value: user.username }))}
        />
      </Form.Item>
      <Form.Item label='Appointment Notes' name='appointmentNotes'>
        <Input.TextArea />
      </Form.Item>

      <Form.Item
        label='Payment Mode'
        name='paymentMode'
        rules={[{ message: 'Please select a payment mode!' }]}
      >
        <Select>
          {Object.values(GlobalPaymentMethodEnum).map((value) => (
            <Select.Option key={value} value={value}>
              {value}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item label='Fees' name='fees'>
        <Input type='number' min={0} />
      </Form.Item>
      <AddressForm />

      <Form.Item>
        <Button type='primary' htmlType='submit' loading={loading} disabled={loading}>
          Create Appointment
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CreateAppointmentForm;
