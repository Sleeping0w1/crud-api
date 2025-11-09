import type http from 'node:http';
import { validate } from 'uuid';
import { HTTP_STATUS_BAD_REQUEST } from './constants.ts';
import { errorResponse } from './ApiResponses.ts';
export function validateUUID(id: string, response: http.ServerResponse): boolean {
  if (!validate(id)) {
    errorResponse(response, HTTP_STATUS_BAD_REQUEST, 'Invalid UUID', 'User ID must be a valid UUID');
    return false;
  }
  return true;
}
