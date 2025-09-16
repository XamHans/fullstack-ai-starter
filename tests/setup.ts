import { setupServer } from 'msw/node';
import { afterAll, beforeAll, beforeEach } from 'vitest';
import { handlers } from './mocks/handlers';
import '@testing-library/jest-dom';

// Setup MSW server for API mocking
export const server = setupServer(...handlers);

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'bypass' });
});

afterAll(() => {
  server.close();
});

beforeEach(() => {
  server.resetHandlers();
});
