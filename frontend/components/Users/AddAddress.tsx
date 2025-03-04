import { openNotification } from '@/utils';
import { UserInfoProps } from '@/utils/types';
import { MinusCircleOutlined, PlusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Divider, Form, Input, Modal, Space } from 'antd';
import React, { useState } from 'react';

const AddAddress = (props: {
  user: UserInfoProps;
  setPageLoading: (e: boolean) => void;
  pageLoading: boolean;
  setIsModelDataChanged: (e: any) => void;
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user, setPageLoading, pageLoading, setIsModelDataChanged } = props;

  async function submitAddresses(reqBody: any) {
    setPageLoading(true);
    setIsModalOpen(false);
    try {
      reqBody['id'] = user?._id;
      const response = await fetch('/api/users/addAddress', {
        method: 'PUT',
        body: JSON.stringify(reqBody),
      });
      const result = await response.json();
      openNotification({
        type: response.status === 200 ? 'success' : 'error',
        message:
          response.status === 200
            ? `Address(es) has been added successfully`
            : result.message ?? 'API Failed to add address(es)',
      });
      if (response.ok) {
        setIsModelDataChanged(new Date().getTime());
      }
    } catch (error) {
    } finally {
      setPageLoading(false);
    }
  }

  return (
    <>
      <Button type='primary' icon={<PlusCircleOutlined />} onClick={() => setIsModalOpen(true)}>
        Add an Address
      </Button>
      <Modal open={isModalOpen} onCancel={() => setIsModalOpen(false)} footer={[]} className='p-10'>
        <Form
          name='dynamic_form_nest_item'
          onFinish={submitAddresses}
          autoComplete='off'
          className='mt-10 mb-10'
        >
          <Form.List name='address'>
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <React.Fragment key={key}>
                    <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align='baseline'>
                      <Form.Item {...restField} name={[name, 'floorNum']}>
                        <Input placeholder='Floor Number' />
                      </Form.Item>
                      <Form.Item {...restField} name={[name, 'city']}>
                        <Input placeholder='City Name' />
                      </Form.Item>
                      <MinusCircleOutlined onClick={() => remove(name)} />
                    </Space>
                    <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align='baseline'>
                      <Form.Item {...restField} name={[name, 'appartmentNum']}>
                        <Input placeholder='Appartment Number' />
                      </Form.Item>
                      <Form.Item {...restField} name={[name, 'city']}>
                        <Input placeholder='Building/Villa Number' />
                      </Form.Item>
                    </Space>
                    <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align='baseline'>
                      <Form.Item
                        {...restField}
                        name={[name, 'zipCode']}
                        rules={[{ required: true, message: 'Missing first name' }]}
                      >
                        <Input placeholder='Zip Code' />
                      </Form.Item>
                      <Form.Item {...restField} name={[name, 'postalCode']}>
                        <Input placeholder='Postal Code' />
                      </Form.Item>
                    </Space>
                    <Form.Item {...restField} name={[name, 'street']}>
                      <Input placeholder='Street Name' />
                    </Form.Item>
                    <Form.Item {...restField} name={[name, 'state']}>
                      <Input placeholder='State' />
                    </Form.Item>
                    <Form.Item {...restField} name={[name, 'country']}>
                      <Input placeholder='Country' />
                    </Form.Item>
                    <Form.Item {...restField} name={[name, 'extraDirections']}>
                      <Input.TextArea className='max-h-[100px]' placeholder='Extra Directions...' />
                    </Form.Item>
                    <Divider plain></Divider>
                  </React.Fragment>
                ))}
                <Form.Item>
                  <Button type='dashed' onClick={() => add()} block icon={<PlusOutlined />}>
                    Add field
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
          <Form.Item>
            <Button type='primary' htmlType='submit'>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AddAddress;
