import {
  GlobalAppointmentStatusEnum,
  GlobalDurationEnum,
  GlobalUserRoleEnum,
  ResultOperation,
} from '@/utils/constants';
import { OpenNotificationProps, ResultProps, loginProps } from '@/utils/types';
import { notification } from 'antd';

export function isSuccess(result: ResultProps) {
  return result.operation === 200 ? true : false;
}

export function getStatusFilters() {
  return Array(1).fill(
    Object.keys(GlobalAppointmentStatusEnum).map((key) => {
      return {
        text: String(key),
        value: String(key).toLowerCase(),
      };
    }),
  )[0];
}
export function getDurationFilters() {
  return Array(1).fill(
    Object.keys(GlobalDurationEnum).map((key) => {
      return {
        text: String(key),
        value: String(key).toLowerCase(),
      };
    }),
  )[0];
}

export function getUserRoles() {
  const roles = Object.keys(GlobalUserRoleEnum).map((key) => ({
    text: String(key),
    value: GlobalUserRoleEnum[key as keyof typeof GlobalUserRoleEnum],
  }));

  return roles;
}

export function getColorFromText(status: string) {
  const statusColor: { [key: string]: string } = {
    [GlobalAppointmentStatusEnum.ACCEPTED]: 'green',
    [GlobalAppointmentStatusEnum.COMPLETED]: 'lime',
    [GlobalAppointmentStatusEnum.DEFERRED]: 'magenta',
    [GlobalAppointmentStatusEnum.PENDING]: 'grey',
    [GlobalAppointmentStatusEnum.REJECTED]: 'volcano',
    [GlobalAppointmentStatusEnum.STARTED]: 'processing',
    [GlobalAppointmentStatusEnum.VIEWED]: 'purple',
    [GlobalAppointmentStatusEnum.SUSPENDED]: 'error',
    [GlobalAppointmentStatusEnum.VISITDONE]: 'geekblue',
    [GlobalUserRoleEnum.ADMIN]: 'volcano',
    [GlobalUserRoleEnum.ACCOUNTANT]: 'lime',
    [GlobalUserRoleEnum.HEALTHCAREUSER]: 'volcano',
    [GlobalUserRoleEnum.PATIENT]: 'green',
    [GlobalUserRoleEnum.SCHEDULER]: 'purple',
  };

  return statusColor[status] ?? '#27374D';
}

export const openNotification = (props: OpenNotificationProps) => {
  const { message, type = 'success', placment, duration } = props;

  if (type === 'success') {
    notification.success({
      message: message,
      placement: placment,
      duration: duration,
    });
  } else if (type === 'error') {
    notification.error({
      message: message,
      placement: placment,
      duration: duration,
    });
  } else if (type === 'warn') {
    notification.warning({
      message: message,
      placement: placment,
      duration: duration,
    });
  } else if (type === 'info') {
    notification.info({
      message: message,
      placement: placment,
      duration: duration,
    });
  } else {
    notification.open({
      message: message,
      placement: placment,
      duration: duration,
    });
  }
};

export const login = async (props: loginProps) => {
  try {
    const logInResult: Response = await fetch(`/api/login`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(props),
    });
    const jsonData = await logInResult.json();

    const result: ResultProps = {
      operation: logInResult.status,
      data: jsonData,
    };

    return result;
  } catch (error) {
    console.error('Error login', error);
    const result: ResultProps = {
      operation: ResultOperation.Failure,
      data: error,
    };
    return result;
  }
};

export async function fetchAppointment(query: string) {
  try {
    const response = await fetch(`/api/appointments${query}`);
    const jsonResult = await response.json();

    const result: ResultProps = {
      operation: response.status,
      message: jsonResult.message ?? null,
      data: jsonResult.data,
    };

    return result;
  } catch (error) {
    const result: ResultProps = {
      operation: ResultOperation.Failure,
      message: 'API Failure: Failed to get appointment',
      data: error,
    };

    return result;
  }
}

export async function updateAppointment(body: unknown) {
  try {
    const response = await fetch(`/api/appointments/changeAppointmentStatus`, {
      method: 'PUT',
      body: JSON.stringify(body),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
    const jsonResult = await response.json();

    const result: ResultProps = {
      operation: response.status,
      data: jsonResult,
    };

    return result;
  } catch (error) {
    const result: ResultProps = {
      operation: ResultOperation.Failure,
      message: 'Failed to update appointment',
      data: error,
    };

    return result;
  }
}

export async function createAppointment(body: unknown) {
  try {
    const response = await fetch(`/api/appointments`, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    const jsonResult = await response.json();
    openNotification({
      type: response.status === 200 ? 'success' : 'error',
      message:
        response.status === 200
          ? `Appointment created successfully`
          : jsonResult.message ?? 'API Failed to create appointment',
    });
    return response.status;
  } catch (error) {
    console.log('Error creating appointment ' + error);
    openNotification({
      type: 'error',
      message: `API Failed to create appointment ${JSON.stringify(error)}`,
    });
    return ResultOperation.Failure;
  }
}

export async function advancedFilteredAppointments(body: unknown) {
  try {
    const response = await fetch(`/api/appointments/advancedFilter`, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
    const jsonResponse = await response.json();
    if (!response.ok) {
      openNotification({
        type: 'error',
        message: jsonResponse.message ?? 'Failed to get the appointments',
      });
    }
    return jsonResponse;
  } catch (error) {
    console.error('Failed to get advanced filter appointments ', error);
    const result: ResultProps = {
      operation: ResultOperation.Failure,
      message: `Failed to update appointment${error}`,
      data: error,
    };
    openNotification({
      message: `API Failure: ${result.message}`,
      type: 'error',
    });
    return result;
  }
}

export async function updateAppointmentController(body: unknown) {
  try {
    const response = await fetch(`/api/appointments/`, {
      method: 'PUT',
      body: JSON.stringify(body),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    const jsonResult = await response.json();
    if (!response.ok) {
      openNotification({
        type: 'error',
        message: jsonResult.message ?? 'Failed to get the appointments',
      });
    }
    return jsonResult;
  } catch (error) {
    const result: ResultProps = {
      operation: ResultOperation.Failure,
      message: 'Failed to update appointment',
      data: error,
    };

    return result;
  }
}

export async function assignAppointmentToHealthcareUser(body: unknown) {
  try {
    const response = await fetch(`/api/appointments/assignAppointmentToHealthcareUser`, {
      method: 'PUT',
      body: JSON.stringify(body),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
    const jsonResult = await response.json();
    if (!response.ok) {
      openNotification({
        type: 'error',
        message: jsonResult.message ?? 'Failed to assign the healthcare user',
      });
    }
    openNotification({
      type: 'success',
      message: `Healthcare user assigned successfully`,
    });
    return jsonResult;
  } catch (error) {
    const result: ResultProps = {
      operation: ResultOperation.Failure,
      message: 'Failed to update appointment',
      data: error,
    };

    return result;
  }
}

export async function upload(body: any) {
  try {
    const response = await fetch(`/api/appointments/attachment`, {
      method: 'PUT',
      body: JSON.stringify(body),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
    const jsonResult = await response.json();
    if (!response.ok) {
      return openNotification({
        type: 'error',
        message: `Failed to upload document: ${JSON.stringify(jsonResult.message) ?? ''}`,
      });
    }
    openNotification({
      type: 'success',
      message: `Attachment uploaded successfully`,
    });
    return jsonResult;
  } catch (error) {
    const result: ResultProps = {
      operation: ResultOperation.Failure,
      message: 'Failed to upload document',
      data: JSON.stringify(error),
    };

    return result;
  }
}

export async function fetchUser(identifier: any) {
  try {
    const response = await fetch(`/api/users/userData${identifier ? `?id=${identifier}` : ''}`);
    const data = await response.json();

    if (!response.ok) {
      openNotification({
        type: 'error',
        message: data.message ?? 'Failed to fetch user info',
      });
    }

    return data;
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
}

export async function updateUser(body: any) {
  try {
    const updateResponse = await fetch('/api/users', {
      method: 'PUT',
      body: JSON.stringify(body),
    });
    const updateResult = await updateResponse.json();
    openNotification({
      type: updateResponse.status === 200 ? 'success' : 'error',
      message:
        updateResponse.status === 200
          ? `User has been updated successfully`
          : updateResult.message ?? 'API Failed to create user',
    });
    return updateResponse.status;
  } catch (error) {
    console.error('Error while updating user');
    openNotification({
      type: 'error',
      message: `API Failed to update User ${error}`,
    });
    return ResultOperation.Failure;
  }
}

export function isValidEmail(email: string) {
  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

  return emailRegex.test(email);
}
export function isValidDateOfBirth(value: Date) {
  const currentDate = new Date();
  const minDate = new Date();
  minDate.setFullYear(currentDate.getFullYear() - 120);

  if (!value || (value >= minDate && value <= currentDate)) {
    return Promise.resolve();
  } else {
    return Promise.reject('Date of birth must not be in the future or more than 120 years old');
  }
}
export function isValidPhoneNumber(phoneNumber: string) {
  const isNonNegative = /^[0-9]+$/.test(phoneNumber);
  const isInRange = phoneNumber.length >= 7 && phoneNumber.length <= 15;
  return isNonNegative && isInRange;
}

export async function fetchAttachment(query: any) {
  try {
    const response = await fetch(`/api/appointments/attachment${query}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
    const jsonResult = await response.json();
    if (!response.ok) {
      return openNotification({
        type: 'error',
        message: `Failed to get attachment: ${jsonResult.message ?? ''}`,
      });
    }
    openNotification({
      type: 'success',
      message: `Attachment downloaded successfully`,
    });
    return jsonResult;
  } catch (error) {
    const result: ResultProps = {
      operation: ResultOperation.Failure,
      message: 'Failed to download attachment',
      data: error,
    };

    return result;
  }
}

export async function deleteAttachment(query: any) {
  try {
    const response = await fetch(`/api/appointments/attachment${query}`, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
    const jsonResult = await response.json();
    if (!response.ok) {
      return openNotification({
        type: 'error',
        message: `Failed to delete attachment: ${jsonResult.message ?? ''}`,
      });
    }
    openNotification({
      type: 'success',
      message: `Attachment deleted successfully`,
    });
    return jsonResult;
  } catch (error) {
    const result: ResultProps = {
      operation: ResultOperation.Failure,
      message: 'Failed to delete attachment',
      data: error,
    };

    return result;
  }
}
