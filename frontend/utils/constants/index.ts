export const ResultOperation = {
  Failure: 500,
  Not_Found: 404,
  Unauthorized: 401,
  Bad_Request: 400,
  Forbidden: 403,
  Success: 200,
  Server_Error: 502,
  Conflict: 409,
};

export enum GlobalAppointmentStatusEnum {
  ACCEPTED = 'accepted',
  STARTED = 'started',
  SUSPENDED = 'suspended',
  REJECTED = 'rejected',
  VISITDONE = 'visitDone',
  COMPLETED = 'completed',
  DEFERRED = 'deferred',
  PENDING = 'pending',
  VIEWED = 'viewed',
}

export enum GlobalPaymentMethodEnum {
  CASH = 'cash',
  CREDITCARD = 'creditCard',
  CHEQUE = 'cheque',
}

export enum GlobalUserRoleEnum {
  ADMIN = 'admin',
  SCHEDULER = 'scheduler',
  HEALTHCAREUSER = 'healthcareUser',
  ACCOUNTANT = 'accountant',
  PATIENT = 'patient',
}

export enum GlobalDurationEnum {
  Today = 'today',
  PastWeek = 'past-week',
  PastMonth = 'past-month',
  PastYear = 'past-year',
  NextMonth = 'next-month',
  NextWeek = 'next-week',
  NextYear = 'next-year',
  CurrentWeek = 'current-week',
  CurrentMonth = 'current-month',
  CurrentYear = 'current-year',
}

export enum ROUTES {
  DASHBOARD = '/dashboard',
  USERPAGE = '/user',
  APPOINTMENTPAGE = '/appointment',
  CREATEUSER = '/user/createUser',
  CREATEAPPOINTMENT = '/appointment/createAppointment',
}
