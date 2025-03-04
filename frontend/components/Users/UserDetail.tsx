'use client';
import { Descriptions, Checkbox } from 'antd';
import { UserInfoProps } from '@/utils/types';
import AddressViewer from '@/lib/AddressViewer';

const UserDetail = (props: { userInfo: UserInfoProps }) => {
  const { userInfo } = props;

  const userAdresses = userInfo.address;

  const descriptionItems = [
    {
      key: `${userInfo._id}-${userInfo?.username}-key`,
      label: `Name`,
      children: userInfo?.name,
    },
    {
      key: `${userInfo._id}-${userInfo?.phone}-phone`,
      label: `Phone Number`,
      children: userInfo?.phone ?? '-',
    },
    {
      key: `${userInfo._id}-${userInfo?.email}-email`,
      label: `Email Address`,
      children: userInfo?.email,
    },
    {
      key: `${userInfo._id}-${userInfo?.dateOfBirth}-birthdate`,
      label: 'Date of Birth',
      children: new Date(userInfo?.dateOfBirth).toLocaleDateString(),
    },
    {
      key: `${userInfo._id}-${userInfo?.email}-email`,
      label: 'Active',
      children: <Checkbox checked={userInfo?.active ?? true} disabled />,
    },
    {
      key: `${userInfo._id}-${userInfo?.active}-active`,
      label: 'Addresses',
      children: <AddressViewer addresses={userAdresses} />,
    },
  ];

  return (
    <>
      <Descriptions
        style={{
          width: '100%',
        }}
        layout='vertical'
        bordered
        items={descriptionItems}
      />
    </>
  );
};

export default UserDetail;
