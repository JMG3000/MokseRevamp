import { NextRequest, NextResponse } from 'next/server';

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface ErrorResponse {
  error: string;
  missingFields?: string[];
}

interface SuccessResponse {
  message: string;
}

export async function POST(request: NextRequest): Promise<NextResponse<SuccessResponse | ErrorResponse>> {
  try {
    const body = await request.json();

    // Validate required fields
    const requiredFields: (keyof ContactFormData)[] = ['name', 'email', 'subject', 'message'];
    const missingFields = requiredFields.filter(field => !body[field]);

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          error: 'Missing required fields',
          missingFields,
        },
        { status: 400 }
      );
    }

    // TODO: Future integration - send email via email service (SendGrid, AWS SES, etc.)
    // For now, this placeholder confirms receipt without logging or echoing PII.

    return NextResponse.json(
      {
        message: 'Contact form submitted successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error processing contact form:', error);
    return NextResponse.json(
      {
        error: 'Failed to process contact form submission',
      },
      { status: 500 }
    );
  }
}
