// Sentry disabled temporarily due to build issues
// import * as Sentry from '@sentry/nextjs';

export async function register() {
  // Sentry disabled temporarily
  // Only enable Sentry in production to avoid slowing down development
  // if (process.env.NODE_ENV === 'production') {
  //   if (process.env.NEXT_RUNTIME === 'nodejs') {
  //     await import('./sentry.server.config');
  //   }
  //
  //   if (process.env.NEXT_RUNTIME === 'edge') {
  //     await import('./sentry.edge.config');
  //   }
  // }
}

export const onRequestError = undefined;
// Sentry disabled temporarily
// export const onRequestError = process.env.NODE_ENV === 'production' 
//   ? Sentry.captureRequestError 
//   : undefined;
