import { AddressSchema } from '@/utils/types';
import { EditFilled } from '@ant-design/icons';
import { Button, Collapse, Descriptions, Empty, Space } from 'antd';
import React from 'react';

const AddressViewer = (props: { addresses: AddressSchema | AddressSchema[] }) => {
  const { addresses } = props;
  const listOfAddresses =
    addresses && Array.isArray(addresses) ? addresses : !addresses ? [] : [addresses];
  return (
    <>
      {(!addresses || listOfAddresses.length === 0) && (
        <Empty description='Appointment does not have an address'>
          <Button type='primary' disabled>
            Add Address
          </Button>
        </Empty>
      )}
      <Collapse
        ghost
        items={listOfAddresses.map((address: AddressSchema, index) => {
          return {
            key: address._id,
            label: (
              <Space>
                {`Address(${index + 1})`}{' '}
                <Button type='text' icon={<EditFilled />} disabled></Button>
              </Space>
            ),
            children: (
              <Descriptions
                style={{ marginBottom: '2rem' }}
                layout='vertical'
                bordered
                items={Object.entries(address).map(([key, value]) => {
                  return {
                    key: `${key}-${address._id}`,
                    label: <span style={{ textTransform: 'capitalize' }}>{key}</span>,
                    children: value,
                  };
                })}
              />
            ),
          };
        })}
      />
    </>
  );
};

export default AddressViewer;
