import { ResultOperation } from '@/utils/constants';
import { ResultProps } from '@/utils/types';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { revealToken } from '@/utils/server-only';

export async function GET(req: NextRequest) {
  try {
    const baseUrl: string = `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/all`;
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
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const jsonResponse = await response.json();

    return NextResponse.json(jsonResponse, { status: response.status });
  } catch (err) {
    console.error('Error while getting appointment ', err);
    const result: ResultProps = {
      operation: ResultOperation.Failure,
      message: `Failed to get appointment(s)`,
      data: err,
    };
    return NextResponse.json(result, { status: result.operation });
  }
}

export async function POST(req: NextRequest) {
  try {
    const requestBody = await req.json();

    const baseUrl: string = `${process.env.NEXT_PUBLIC_BACKEND_URL}/user`;
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
    console.error('Error while creating user ', err);
    const result: ResultProps = {
      operation: ResultOperation.Failure,
      message: `Failed to create user`,
      data: err,
    };
    return NextResponse.json(result, { status: result.operation });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const requestBody = await req.json();

    const baseUrl: string = `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/${requestBody.id}`;
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
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const jsonResponse = await response.json();

    return NextResponse.json(jsonResponse, { status: response.status });
  } catch (err) {
    console.error('error while deleting user ', err);
    const result: ResultProps = {
      operation: ResultOperation.Failure,
      message: `Failed to delete user(s)`,
      data: err,
    };
    return NextResponse.json(result, { status: result.operation });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const requestBody = await req.json();

    const baseUrl: string = `${process.env.NEXT_PUBLIC_BACKEND_URL}/user`;
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
      method: 'PUT',
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
    console.error('error while updating appointment ', err);
    const result: ResultProps = {
      operation: ResultOperation.Failure,
      message: `Failed to update appointment(s)`,
      data: JSON.stringify(err),
    };
    return NextResponse.json(result, { status: result.operation });
  }
}
