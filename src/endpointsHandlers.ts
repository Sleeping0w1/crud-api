import type http from 'node:http';
import { isUserData, User, Users } from './users.ts';
import {
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_CREATED,
  HTTP_STATUS_NO_CONTENT,
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_OK,
} from './constants.ts';
import { validateUUID } from './validateUUID.ts';
import { errorResponse, successResponse } from './ApiResponses.ts';

export function getAllUsers(response: http.ServerResponse): void {
  const allUsers = Users.getUsers();
  successResponse(response, HTTP_STATUS_OK, allUsers);
}

export function getUserById(response: http.ServerResponse, id: string): void {
  if (!validateUUID(id, response)) {
    return;
  }

  const user = Users.getUserById(id);
  if (user) {
    successResponse(response, HTTP_STATUS_OK, user);
  } else {
    errorResponse(response, HTTP_STATUS_NOT_FOUND, 'User not found', `User with ID ${id} doesn't exist`);
  }
}

export function updateUser(request: http.IncomingMessage, response: http.ServerResponse, id: string): void {
  if (!validateUUID(id, response)) {
    return;
  }

  let body = '';
  request.on('data', (chunk: Buffer) => {
    body += chunk.toString();
  });

  request.on('end', () => {
    try {
      const data: unknown = JSON.parse(body);
      if (isUserData(data)) {
        const userDataWithId = { ...data, id };
        const user = Users.updateUser(userDataWithId);

        if (user) {
          successResponse(response, HTTP_STATUS_OK, user);
        } else {
          errorResponse(response, HTTP_STATUS_NOT_FOUND, 'User not found', `User with ID ${id} doesn't exist`);
        }
      } else {
        errorResponse(response, HTTP_STATUS_BAD_REQUEST, 'Invalid data', 'Please provide valid user data');
      }
    } catch {
      errorResponse(response, HTTP_STATUS_BAD_REQUEST, 'Invalid JSON', 'Request body contains invalid JSON');
    }
  });
}

export function deleteUser(response: http.ServerResponse, id: string): void {
  if (!validateUUID(id, response)) {
    return;
  }

  if (Users.removeUser(id)) {
    successResponse(response, HTTP_STATUS_NO_CONTENT);
  } else {
    errorResponse(response, HTTP_STATUS_NOT_FOUND, 'User not found', `User with ID ${id} doesn't exist`);
  }
}

export function createUser(request: http.IncomingMessage, response: http.ServerResponse): void {
  let body = '';
  request.on('data', (chunk: Buffer) => {
    body += chunk.toString();
  });

  request.on('end', () => {
    try {
      const data: unknown = JSON.parse(body);
      if (isUserData(data)) {
        const user = Users.addUser(new User(data.username, data.age, data.hobbies));
        successResponse(response, HTTP_STATUS_CREATED, user);
      } else {
        errorResponse(response, HTTP_STATUS_BAD_REQUEST, 'Invalid data', 'Please provide valid user data');
      }
    } catch {
      errorResponse(response, HTTP_STATUS_BAD_REQUEST, 'Invalid JSON', 'Request body contains invalid JSON');
    }
  });
}

export function notFound(response: http.ServerResponse, method?: string, url?: string): void {
  response.writeHead(HTTP_STATUS_NOT_FOUND, { 'Content-Type': 'application/json' });
  response.end(
    JSON.stringify({
      error: 'Page not found',
      message: `Route ${method} ${url} not found`,
      availableRoutes: [
        'GET /users',
        'GET /users/{userId}',
        'POST /users',
        'PUT /users/{userId}',
        'DELETE /users/{userId}',
      ],
    })
  );
}