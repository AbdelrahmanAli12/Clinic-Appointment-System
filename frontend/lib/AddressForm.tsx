import { AddressSchema } from '@/utils/types';
import { Divider, Form, Input, Space } from 'antd';
import React from 'react';

const AddressForm = (props: { address?: AddressSchema }) => {
  return (
    <>
      <Divider plain>
        <strong>Address</strong>
      </Divider>
      <Space style={{ display: 'flex', marginBottom: 8 }} align='baseline'>
        <Form.Item
          label='Zip Code'
          name={'zipCode'}
          initialValue={props.address?.zipCode}
          rules={[{ required: true, message: 'Please select a date!' }]}
        >
          <Input placeholder='Zip Code' />
        </Form.Item>
        <Form.Item label='Postal Code' name={'postalCode'} initialValue={props.address?.postalCode}>
          <Input placeholder='Postal Code' />
        </Form.Item>
      </Space>
      <Space style={{ display: 'flex', marginBottom: 8 }} align='baseline'>
        <Form.Item name={'floorNum'} initialValue={props.address?.floorNum}>
          <Input placeholder='Floor Number' />
        </Form.Item>
        <Form.Item name={'city'} initialValue={props.address?.city}>
          <Input placeholder='City Name' />
        </Form.Item>
      </Space>
      <Space style={{ display: 'flex', marginBottom: 8 }} align='baseline'>
        <Form.Item name={'appartmentNum'} initialValue={props.address?.appartmentNum}>
          <Input placeholder='Appartment Number' />
        </Form.Item>
        <Form.Item name={'villaBuildingNum'} initialValue={props.address?.city}>
          <Input placeholder='Building/Villa Number' />
        </Form.Item>
      </Space>

      <Form.Item name={'street'} initialValue={props.address?.street}>
        <Input placeholder='Street Name' />
      </Form.Item>
      <Form.Item name={'state'} initialValue={props.address?.state}>
        <Input placeholder='State' />
      </Form.Item>
      <Form.Item name={'country'} initialValue={props.address?.country}>
        <Input placeholder='Country' />
      </Form.Item>
      <Form.Item name={'extraDirections'} initialValue={props.address?.extraDirections}>
        <Input.TextArea className='max-h-[100px]' placeholder='Extra Directions...' />
      </Form.Item>
      <Divider plain></Divider>
    </>
  );
};

export default AddressForm;
