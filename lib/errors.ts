import { NextResponse } from 'next/server';

export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code: string = 'INTERNAL_ERROR',
    public context?: Record<string, any>
  ) {
    super(message);
    this.name = 'AppError';
  }
}

interface ErrorResponse {
  success: false;
  error: {
    message: string;
    code: string;
    context?: Record<string, any>;
  };
}

export function handleApiError(error: unknown): NextResponse<ErrorResponse> {
  console.error('API Error:', error);

  if (error instanceof AppError) {
    return NextResponse.json(
      {
        success: false,
        error: {
          message: error.message,
          code: error.code,
          context: error.context,
        },
      },
      { status: error.statusCode }
    );
  }

  // Rate limit error
  if (error instanceof Error && error.message.includes('rate limit')) {
    return NextResponse.json(
      {
        success: false,
        error: {
          message: 'Too many requests. Please try again later.',
          code: 'RATE_LIMIT_EXCEEDED',
        },
      },
      { status: 429 }
    );
  }

  // Default error response
  return NextResponse.json(
    {
      success: false,
      error: {
        message: 'An unexpected error occurred.',
        code: 'INTERNAL_ERROR',
      },
    },
    { status: 500 }
  );
}

export const ErrorCodes = {
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  INVALID_INPUT: 'INVALID_INPUT',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  SCAN_FAILED: 'SCAN_FAILED',
  DATABASE_ERROR: 'DATABASE_ERROR',
  SUBSCRIPTION_REQUIRED: 'SUBSCRIPTION_REQUIRED',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
} as const;