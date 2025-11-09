import http from 'node:http';
import dotenv from 'dotenv';
import { basicPort, HTTP_STATUS_INTERNAL_SERVER_ERROR } from './constants.ts';
import { Users } from './users.ts';
import { createUser, deleteUser, getAllUsers, getUserById, notFound, updateUser } from './endpointsHandlers.ts';
import { errorResponse } from './ApiResponses.ts';

dotenv.config();

const PORT = process.env.PORT || basicPort;
const HOST = process.env.HOST || 'localhost';

await Users.initializeFromJSON('./src/users.json');

const server = http.createServer(function (request, response) {
  try {
    const { method, url } = request;

    if (url === '/users') {
      switch (method) {
        case 'GET': {
          getAllUsers(response);
          return;
        }
        case 'POST': {
          createUser(request, response);
          return;
        }
      }
    }

    if (url?.startsWith('/users/')) {
      const id = url.split('/')[2];

      switch (method) {
        case 'GET':
          getUserById(response, id);
          break;
        case 'PUT':
          updateUser(request, response, id);
          break;
        case 'DELETE':
          deleteUser(response, id);
          break;
        default:
          notFound(response, method, url);
      }
      return;
    }

    notFound(response, method, url);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    errorResponse(response, HTTP_STATUS_INTERNAL_SERVER_ERROR, 'Server error', errorMessage);
  }
});

server.listen(PORT, function () {
  console.log(`Сервер запущен по адресу http://${HOST}:${PORT}`);
});
