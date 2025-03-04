'use client';

import { TableDirProps } from '@/utils/types';
import { Table } from 'antd';
import React from 'react';

const TableDir = (props: TableDirProps) => {
  const { dataSource, columns, loading, rowKey } = props;

  return (
    <Table
      className='w-full'
      rowKey={rowKey ?? '_id'}
      loading={loading}
      columns={columns}
      dataSource={dataSource}
      scroll={{ x: 0 }}
      size='large'
      pagination={{ position: ['bottomCenter'] }}
    />
  );
};

export default TableDir;
