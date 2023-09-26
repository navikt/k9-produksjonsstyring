// src/mocks/browser.js

/* eslint-disable import/extensions */
import handlers from "./handlers.ts";
import { setupWorker } from "msw";

// This configures a Service Worker with the given request handlers.
// eslint-disable-next-line import/prefer-default-export
export const worker = setupWorker(...handlers);
