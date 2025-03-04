import { getColorFromText } from '@/utils';
import { GlobalAppointmentStatusEnum } from '@/utils/constants';
import { MinusOutlined, SyncOutlined } from '@ant-design/icons';
import { Tag } from 'antd';
import React from 'react';

export const AppointmentStatusTag = (props: { status: string | number | null | undefined }) => (
  <>
    {props.status ? (
      <Tag
        icon={props.status === GlobalAppointmentStatusEnum.STARTED && <SyncOutlined spin />}
        color={getColorFromText(String(props.status).toLowerCase())}
      >
        {String(props.status).toUpperCase()}
      </Tag>
    ) : (
      <MinusOutlined />
    )}
  </>
);
