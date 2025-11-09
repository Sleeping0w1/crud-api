import http from 'node:http';
import dotenv from 'dotenv';
import { validate as validateUUID } from 'uuid';
import {  Users } from './users.ts';
import { basicPort, HTTP_BAD_REQUEST, HTTP_STATUS_NOT_FOUND, HTTP_STATUS_OK } from './constants.ts';

dotenv.config();

const PORT = process.env.PORT || basicPort;
const HOST = process.env.HOST || 'localhost';

await Users.initializeFromJSON('./src/users.json');

const server = http.createServer(function (request, response) {
  const { method, url } = request;
  if (url === '/users' && method === 'GET') {
    const allUsers = Users.getUsers();
    response.writeHead(HTTP_STATUS_OK, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify(allUsers));
  } else if (url?.startsWith('/users/') && method === 'GET') {
    const id = url.split('/')[2];
    if (!validateUUID(id)) {
      response.writeHead(HTTP_BAD_REQUEST, { 'Content-Type': 'application/json' });
      response.end(
        JSON.stringify({
          error: 'Invalid userId format',
          message: 'UserId must be a valid UUID',
        })
      );
      return;
    }
    const user = Users.getUserById(id);
    if (user) {
      response.writeHead(HTTP_STATUS_OK, { 'Content-Type': 'application/json' });
      response.end(JSON.stringify(user));
    } else {
      response.writeHead(HTTP_STATUS_NOT_FOUND, { 'Content-Type': 'application/json' });
      response.end(JSON.stringify({ error: 'Invalid userId', message: `record with id = ${id} doesn't exist` }));
    }
    return;
  } else {
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
});
server.listen(PORT, function () {
  console.log(`Сервер запущен по адресу http://${HOST}:${PORT}`);
});
