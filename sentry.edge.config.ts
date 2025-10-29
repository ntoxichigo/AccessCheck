// This file configures the initialization of Sentry for edge features (middleware, edge routes, and so on).
// The config you add here will be used whenever one of the edge features is loaded.
// Note that this config is unrelated to the Vercel Edge Runtime and is also required when running locally.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/
// DISABLED TEMPORARILY DUE TO BUILD ISSUES

// import * as Sentry from "@sentry/nextjs";

// Sentry.init({
//   dsn: "https://fc4715cf297045a6a402de35a0a43d1b@o4510166881271808.ingest.de.sentry.io/4510166881665104",

//   // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
//   tracesSampleRate: 1,

//   // Enable logs to be sent to Sentry
//   enableLogs: true,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,
});
