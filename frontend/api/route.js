import { NextResponse } from 'next/server';

export async function GET(request) {
  return NextResponse.json({ message: 'API is working' });
}

export async function POST(request) {
  try {
    const body = await request.json();
    return NextResponse.json({ received: body, message: 'Success' });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
