import type http from 'node:http';
import type { User } from './users.ts';

export function successResponse(
  response: http.ServerResponse, 
  statusCode: number, 
  data?: User | User[]
): void {
  response.writeHead(statusCode, { 'Content-Type': 'application/json' });
  if (data) {
    response.end(JSON.stringify(data));
  } else {
    response.end();
  }
}

export function errorResponse(
  response: http.ServerResponse,
  statusCode: number,
  error: string,
  message: string
): void {
  response.writeHead(statusCode, { 'Content-Type': 'application/json' });
  response.end(JSON.stringify({ error, message }));
}