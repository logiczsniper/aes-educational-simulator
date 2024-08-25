import * as Sentry from '@sentry/browser';

export default defineNuxtPlugin((nuxtApp) => {
  Sentry.init({
    dsn: "https://a071909ac4494b9d87bed1b1507afc3e@o4505047049240576.ingest.sentry.io/4505047073423360",
    integrations: [new Sentry.BrowserTracing()],
    release: "aes-adventure-sentry@0.0.1"
  });
});