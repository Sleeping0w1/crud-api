import type http from 'node:http';
import { validate } from 'uuid';
import { HTTP_BAD_REQUEST } from './constants.ts';
export function validateUUID(id: string, response: http.ServerResponse): boolean {
  if (!validate(id)) {
    response.writeHead(HTTP_BAD_REQUEST, { 'Content-Type': 'application/json' });
    response.end(
      JSON.stringify({
        error: 'Invalid userId format',
        message: 'UserId must be a valid UUID',
      })
    );
    return false;
  }
  return true;
}
