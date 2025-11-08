import http from 'node:http';
import dotenv from 'dotenv';
import { Users } from './users';

dotenv.config();

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';

new Users();

const server = http.createServer(function (request, response) {
  const { method, url } = request;
  if (url === '/users' && method === 'GET') {
    const allUsers = Users.getUsers();
    response.writeHead(200, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify(allUsers));
  } else {
    response.writeHead(404, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify({
      error: 'Page not found',
      message: `Route ${method} ${url} not found`,
      availableRoutes: [
        'GET /users',
        'GET /users/{userId}',
        'POST /users',
        'PUT /users/{userId}',
        'DELETE /users/{userId}'
      ]
    }));
  }
});
server.listen(PORT, function () {
  console.log(`Сервер запущен по адресу http://${HOST}:${PORT}`);
});
