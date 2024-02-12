import http from 'http';
import cluster, { Worker } from 'cluster';
import { serverHandler } from './controllers/serverHandler';
import { hostname, availableParallelism } from 'os';
import { getBody, sendResponse } from './utils/helpers';
import { IUser, ResponseMessages, StatusCodes } from './types/index';
import { users } from './data/users';
import { addUser, deleteUser, updateUser } from './controllers/usersController';

const PORT = process.env.PORT || '4000';

const server = http.createServer();

let currentNumber: number = 0;
const ports: number[] = [];
const numberOfWorkers = availableParallelism() - 1;

const workersArr: Worker[] = [];

if (cluster.isPrimary) {
  for (let i = 1; i <= numberOfWorkers; i++) {
    const workerPort = Number(PORT) + i;
    const worker = cluster.fork({
      workerPort: workerPort,
      identificator: i,
    });
    workersArr.push(worker);
    ports.push(workerPort);
    worker.send(users);
  };
    
  server.listen(PORT, () => {
    console.log(`Load balancer running at http://localhost:${PORT}`);
  });

  server.on('request', async (request, response) => {
    const port = ports[currentNumber];
    const options = {
      hostname: hostname(),
      port,
      path: request.url,
      method: request.method,
      headers: request.headers,
    };
    currentNumber = currentNumber === numberOfWorkers - 1 ? 0 : currentNumber + 1;

    const req = http.request(options);

    req.on('response', async  (res) => {
      const responseBody = await getBody(res, 'answer from worker');
        const statusCode = res.statusCode;

        sendResponse(response, statusCode || StatusCodes.INTERNAL_SERVER_ERROR, responseBody);

      request.on('error', (e) => {
        const body = {
          data: null,
          error: {
            code: 500,
            message: ResponseMessages.SERVER_ERROR
          }
        }
        sendResponse(response, StatusCodes.INTERNAL_SERVER_ERROR, body);
        console.error(e);
      });        
    })

    const method = request.method;
    let bodyS = '';

    if (method === 'POST' || method === 'PUT') {
      const body = await getBody(request, 'from master');
      bodyS = JSON.stringify(body)
    }
    req.setHeader('Content-Length', bodyS.length)
      
    req.end(bodyS);
  })

  cluster.on('listening', (worker) => {
    worker.on('message', (message) => {
      if (message.type === 'add') {
        addUser(message.user, users);
      } else if (message.type === 'delete') {
        deleteUser(message.user, users);
      } else if (message.type === 'update') {
        updateUser(message.user.id, message.user, users);
      }
      workersArr.filter((w) => w.id !== worker.id).forEach((w) => w.send(users));
    })
  })

} else {
  const workerPort = process.env.workerPort;
  const workerIdentificator = process.env.identificator;

  let bdInstance: IUser[];

  process.on('message', (message) => {
    bdInstance = message as IUser[];
  })

  server.listen(workerPort, () => {
    console.log(`Worker server #${workerIdentificator} running at http://localhost:${workerPort}`)
  });

  server.on('request', async (req, res) => {
    console.log(`worker ${workerIdentificator} on ${workerPort} received the request`)
    const answer = await serverHandler(req, res, bdInstance);

    if (answer) {
      process.send && process.send(answer);
    }
  });
}
