import { openNotification } from '@/utils';
import { GlobalUserRoleEnum, ResultOperation } from '@/utils/constants';
import { Avatar, Space, Spin, Tag, Typography } from 'antd';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { PieChartComponent } from '../Graphs/Pie';
import { UserInfoProps } from '@/utils/types';
import { withRoles } from '@/lib/WithRoles';
import { ColumnsType } from 'antd/es/table';
import TableDir from '@/lib/TableDir';
import { UserOutlined } from '@ant-design/icons';

const { Text } = Typography;

const TopHealthcareUsers = () => {
  const [topUsers, setTopUsers] = useState<UserInfoProps[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function getTopUsers() {
      setLoading(true);
      try {
        const response = await fetch(`/api/users/dashboard`);
        const result = await response.json();

        if (response.status !== ResultOperation.Success) {
          openNotification({
            message: `Failed to get top healthcare users, ${result.message}`,
            type: 'error',
          });
        } else {
          setTopUsers(result.data.topUsers.data);
        }
      } catch (error) {
        console.log('Error while getting top users ', error);
        openNotification({
          message: `API Failed to get top healthcare users, ${error}`,
          type: 'error',
        });
      } finally {
        setLoading(false);
      }
    }

    getTopUsers();
  }, []);
  const columns: ColumnsType<object> = [
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
      render: (_, record: any) => (
        <Space className='flex justify-between flex-wrap'>
          <Space>
            <Avatar icon={<UserOutlined />} />
            <Link href={`/user/${record._id}`}>{record.name}</Link>
          </Space>
          <Text code>{record.appointmentCount} Total Appointments</Text>
        </Space>
      ),
    },
  ];
  return (
    <>
      <h1 className='text-xl md:text-3xl mb-3 font-bold mt-5'>Top Healthcare Users</h1>
      <Spin spinning={loading}>
        <PieChartComponent
          graphLabel='Top Healthcare Users'
          labels={Array(1).fill(topUsers.map((user) => user.name))[0]}
          tableData={Array(1).fill(topUsers.map((user) => user.appointmentCount))[0]}
        />
      </Spin>
      <TableDir columns={columns} dataSource={topUsers} loading={loading} />;
    </>
  );
};

export default withRoles(TopHealthcareUsers, [
  GlobalUserRoleEnum.ADMIN,
  GlobalUserRoleEnum.SCHEDULER,
]);
