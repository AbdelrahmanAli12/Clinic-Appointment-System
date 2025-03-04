import type { ColumnsType } from 'antd/es/table';
import {
  GlobalAppointmentStatusEnum,
  GlobalPaymentMethodEnum,
  GlobalUserRoleEnum,
} from '../constants';

export interface loginProps {
  identifier: string;
  password: string;
}

export interface ResultProps {
  operation: number;
  message?: string | null;
  data?: any | unknown;
}

export interface OpenNotificationProps {
  message: string;
  placment?: 'topRight' | 'topLeft';
  type?: 'error' | 'warn' | 'success' | 'info';
  duration?: number;
}

export interface HeaderItemsProps {
  key: string;
  label: string | JSX.Element;
  href: string;
  onclick?: () => void;
  icon?: JSX.Element;
  requiredPerm?: string[];
}

export interface TableDirProps {
  dataSource: object[];
  columns: ColumnsType<AppointmentProps | object>;
  loading?: boolean;
  rowKey?: string | ((record: {}) => string);
}

export interface StatisticCardProps {
  title: string;
  value: number | string;
  prefix?: JSX.Element;
  suffix?: JSX.Element;
}
export interface AdvancedFilterProps {
  setFilterQuery: (query: any) => void;
}

export interface UserInfoProps {
  _id: string;
  username: string;
  password?: string;
  name: string;
  phone: string;
  email: string;
  dateOfBirth: number;
  active: boolean;
  role: GlobalUserRoleEnum;
  address: AddressSchema[];
  appointmentCount?: number;
}

export interface AddressSchema {
  _id: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  zipCode: number;
  country: string;
  villaBuildingNum: number;
  floorNum: number;
  appartmentNum: string;
  extraDirections: string;
}

export interface AppointmentProps {
  _id: string;
  desiredDateTime: number;
  patientInfo?: UserInfoProps;
  healthcareUser?: UserInfoProps;
  appointmentNotes?: string;
  fees?: number;
  status: GlobalAppointmentStatusEnum;
  paymentMode: GlobalPaymentMethodEnum;
  attachments: any | unknown;
  address: AddressSchema;
}

export interface CreateComponentPorps {
  setModelUpdated: (newValue: any) => void;
  setLoading: (newValue: boolean) => void;
  loading: boolean;
}
