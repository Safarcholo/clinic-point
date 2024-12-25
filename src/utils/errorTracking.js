import * as Sentry from "@sentry/react";

export const initializeErrorTracking = () => {
  if (process.env.REACT_APP_ENVIRONMENT === 'production') {
    Sentry.init({
      dsn: process.env.REACT_APP_SENTRY_DSN,
      environment: process.env.REACT_APP_ENVIRONMENT,
      tracesSampleRate: 1.0,
    });
  }
};

export const logError = (error, context = {}) => {
  console.error(error);
  if (process.env.REACT_APP_ENVIRONMENT === 'production') {
    Sentry.captureException(error, { extra: context });
  }
}; 