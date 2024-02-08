import http from 'http';
import { processGetMethod } from './methods/get';
// import { processPostMethod } from './methods/post.js';
// import { processPutMethod } from './methods/put.js';
// import { processDeleteMethod } from './methods/delete.js';
import { getBody } from './middlewares/getBody.ts';
import { StatusCodes, RequestMethods } from './utils/responseData';

const PORT = process.env.PORT || '4001';

const server = http.createServer((request, response) => {
  const method = request.method;
  console.log('method', method);

  switch (method) {
    case RequestMethods.GET:
      processGetMethod(request, response);
      break;
    
    case RequestMethods.POST:
      // getBody(request, response, processPostMethod);
      break;

    case RequestMethods.PUT:
      // getBody(request, response, processPutMethod);
      break;

    case RequestMethods.DELETE:
      // getBody(request, response, processDeleteMethod);
      break;

    default:
      response.writeHead(StatusCodes.BAD_REQUEST, 'No Response');
      response.end();
  }
});

server.listen(PORT, () => {
  console.log(`listening on port ${PORT}`)
});

// server.on('error', (e) => {
//   if (e.code === 'EADDRINUSE') {
//     console.error('Address in use, retrying...');
//     setTimeout(() => {
//       server.close();
//       server.listen(PORT);
//     }, 1000);
//   }
// });