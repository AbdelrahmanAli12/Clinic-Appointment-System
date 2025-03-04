import React from 'react';
import { Avatar, Space, Typography } from 'antd';
import useUsers from '@/utils/hooks/use-users';
import TableDir from '@/lib/TableDir';
import { ColumnsType } from 'antd/es/table';
import { getUserRoles } from '@/utils';
import Link from 'next/link';
import { UserOutlined } from '@ant-design/icons';
const { Text } = Typography;
const tableFilters = getUserRoles();

export const UserListing = (props: { modelUpdated: any }) => {
  const { allUsers, loading } = useUsers({ refreshToken: props.modelUpdated });

  const columns: ColumnsType<object> = [
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
      filters: tableFilters,
      onFilter: (value, record: any) =>
        String(record.role).toLowerCase() == String(value).toLowerCase(),

      render: (_, record: any) => (
        <div className='flex justify-between flex-wrap w-full'>
          <Space>
            <Avatar icon={<UserOutlined />} />
            <Link href={`/user/${record._id}`}>{record.username}</Link>
          </Space>

          <Text
            code
            style={{
              textTransform: 'capitalize',
            }}
          >{`${record.role}`}</Text>
        </div>
      ),
    },
  ];
  return <TableDir columns={columns} dataSource={allUsers} loading={loading} />;
};

export default UserListing;
