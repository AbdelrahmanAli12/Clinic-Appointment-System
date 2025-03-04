'use server';

import { ResultOperation } from '@/utils/constants';
import { ResultProps } from '@/utils/types';
import { cookies } from 'next/headers';
import { sealToken } from './server-only';

export const setTokenCookie = async (token: unknown) => {
  try {
    let isLoggedIn: string = token ? 'true' : 'false';
    const sealedToken = await sealToken(token);

    if (sealedToken == null) {
      const result: ResultProps = {
        operation: ResultOperation.Failure,
        message: 'Failed to seal token',
      };
      return result;
    }
    cookies().set({
      name: 'isLoggedIn',
      value: isLoggedIn,
      httpOnly: true,
    });

    cookies().set({
      name: 'token',
      value: `${sealedToken}`,
      httpOnly: true,
    });

    const result: ResultProps = {
      operation: ResultOperation.Success,
      message: 'Token saved',
    };
    return result;
  } catch (error) {
    console.error('Error setting token', error);

    const result: ResultProps = {
      operation: ResultOperation.Failure,
      message: 'Failed to save token',
      data: JSON.stringify(error),
    };
    return result;
  }
};
