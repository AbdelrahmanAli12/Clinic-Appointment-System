import React from 'react';
import { Input, Select, Button, Form } from 'antd';
import {
  GlobalAppointmentStatusEnum,
  GlobalDurationEnum,
  GlobalUserRoleEnum,
} from '@/utils/constants';
import { AdvancedFilterProps } from '@/utils/types';
import { withRoles } from '@/lib/WithRoles';

const { Option } = Select;
const AdvancedFilter: React.FC<AdvancedFilterProps> = ({ setFilterQuery }) => {
  const [form] = Form.useForm();
  const HealthcareUserNameFilterField = withRoles(
    () => (
      <Form.Item className='flex-1' name='healthcareUserName'>
        <Input placeholder='Healthcare user Name' />
      </Form.Item>
    ),
    [GlobalUserRoleEnum.ADMIN, GlobalUserRoleEnum.SCHEDULER],
  );

  const HealthcareUserCountryFilterField = withRoles(
    () => (
      <Form.Item className='flex-1' name='healthcareUserCountry'>
        <Input placeholder='Healthcare user Country ' />
      </Form.Item>
    ),
    [GlobalUserRoleEnum.ADMIN, GlobalUserRoleEnum.SCHEDULER],
  );

  const handleFilterSubmit = (filterCriteria: any) => {
    try {
      setFilterQuery(filterCriteria);
    } catch (error) {
      console.error('Filtering error:', error);
    }
  };

  const handleClearFilters = async () => {
    form.resetFields();
    setFilterQuery({});
  };

  return (
    <Form form={form} onFinish={handleFilterSubmit}>
      <div className='flex space-x-4'>
        <Form.Item className='flex-1' name='duration'>
          <Select placeholder='Duration'>
            {Object.entries(GlobalDurationEnum).map(([key, value]) => (
              <Option key={key} value={value}>
                {key}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item className='flex-1' name='status'>
          <Select placeholder='Status'>
            {Object.entries(GlobalAppointmentStatusEnum).map(([key, value]) => (
              <Option key={key} value={value}>
                {key}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </div>
      <div className='flex space-x-4'>
        <Form.Item className='flex-1' name='patientName'>
          <Input placeholder='Patient Name' />
        </Form.Item>

        <HealthcareUserNameFilterField />
      </div>
      <div className='flex space-x-4'>
        <Form.Item className='flex-1' name='patientCountry'>
          <Input placeholder='Patient Country' />
        </Form.Item>
        <HealthcareUserCountryFilterField />
      </div>
      <Form.Item className='flex-1'>
        <Button type='primary' htmlType='submit'>
          Apply Filters
        </Button>
        <span className='mx-2'></span>
        <Button type='primary' onClick={handleClearFilters}>
          Clear Filters
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AdvancedFilter;
