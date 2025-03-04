import { ResultOperation } from '@/utils/constants';
import { ResultProps } from '@/utils/types';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const requestBody = await req.json();

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    const jsonResponse = await response.json();

    return NextResponse.json(jsonResponse, { status: response.status });
  } catch (error) {
    console.error('Failed to login ', error);
    const result: ResultProps = {
      operation: ResultOperation.Failure,
      message: 'API Failure : failed to login ' + JSON.stringify(error),
    };
    return NextResponse.json(result, { status: result.operation });
  }
}
