import { ResultOperation } from '@/utils/constants';
import { ResultProps } from '@/utils/types';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { revealToken } from '@/utils/server-only';

export async function POST(req: NextRequest) {
  try {
    const requestBody = await req.json();
    const baseUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/appointments/advancedFilter`;
    const url = new URL(baseUrl);
    const tokenCookie = cookies().get('token')?.value;
    if (!tokenCookie) {
      return NextResponse.json('Failed to get token cookie ', {
        status: ResultOperation.Failure,
      });
    }
    const token = await revealToken(tokenCookie ?? '');
    if (!token) {
      return NextResponse.json('Failed to reveal token ', {
        status: ResultOperation.Failure,
      });
    }
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    const jsonResponse = await response.json();
    return NextResponse.json(jsonResponse, { status: response.status });
  } catch (err) {
    console.error('error while getting appointment', err);
    const result: ResultProps = {
      operation: ResultOperation.Failure,
      message: `Failed to get appointment(s) in this time duration`,
      data: err,
    };
    return NextResponse.json(result, { status: result.operation });
  }
}
