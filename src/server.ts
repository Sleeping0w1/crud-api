import http from 'node:http';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';

const server = http.createServer(function (request, response) {
  response.end('Hello!');
});
server.listen(PORT, function () {
  console.log(`Сервер запущен по адресу http://${HOST}:${PORT}`);
});
