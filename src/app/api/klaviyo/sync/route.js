import { NextResponse } from 'next/server';
import { createOrUpdateProfile } from '../../../../../lib/klaviyo';

export async function POST(request) {
  try {
    const body = await request.json();
    const { user } = body;

    if (!user || !user.email) {
      return NextResponse.json(
        { error: 'User email is required' },
        { status: 400 }
      );
    }

    const result = await createOrUpdateProfile(user);

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Klaviyo Sync API Error:', error);
    return NextResponse.json(
      { error: 'Failed to sync user to Klaviyo' },
      { status: 500 }
    );
  }
}
