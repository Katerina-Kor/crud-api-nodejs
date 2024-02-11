import http, { ClientRequest} from 'http';
import cluster, { Worker } from 'cluster';
import { serverHandler } from './controllers/serverHandler.ts';
import { hostname } from 'os';
import { getBody, getData, sendResponse } from './utils/helpers.ts';
import { IResponse } from './types/index.ts';

const multi: boolean = true;
const PORT = process.env.PORT || '4000';

const server = http.createServer();

let number = 0;
const ports = [4001, 4002, 4003, 4004];

if (multi) {
  const workersArr: Worker[] = [];

  if (cluster.isPrimary) {
    for (let i = 1; i < 5; i++) {
      const worker = cluster.fork({
        workerPort: Number(PORT) + i,
        identificator: i,
      });
      workersArr.push(worker);
    };
    
    
    server.listen(PORT, () => {
      console.log(`Load balancer running at http://localhost:${PORT}`);
    });

    server.on('request', async (request, response) => {
      console.log('MASTER HANDLER', request.method)
      const port = ports[number];
      const options = {
        hostname: hostname(),
        port,
        path: request.url,
        method: request.method,
        headers: request.headers,
      };
      number = number === 3 ? 0 : number + 1;

      const req = http.request(options);

      req.on('response', async  (res) => {
        console.log('ANSWER', res.statusCode)
        const responseBody = await getBody(res, 'answer from worker');
        const statusCode = res.statusCode;
        // console.log('40', body);

        sendResponse(response, statusCode || 500, responseBody)

        request.on('error', () => {});
        
      })

      const method = request.method;
      let bodyS = '';

      if (method === 'POST') {
        console.log('ping');
        const body = await getBody(request, 'from master');
        console.log('51', body);

        bodyS = JSON.stringify(body)
        // req.write(JSON.stringify(body));

        // if (body.length > 0) {
        //   req.write(JSON.stringify(body));
        // }
      }
      req.setHeader('Content-Length', bodyS.length)
      
      req.end(bodyS, () => console.log('FINISH'));
      console.log('CLOSED OR NOT', req.sendDate)

    })


  } else {
    const workerPort = process.env.workerPort;
    const workerIdentificator = process.env.identificator;

    server.listen(workerPort, () => {
      console.log(`Worker server #${workerIdentificator} running at http://localhost:${workerPort}`)
    });

    server.on('request', async (req, res) => {
      console.log(`worker ${workerIdentificator} on ${workerPort} received the request`)
      await serverHandler(req, res)
    });
  }


} else {
  server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`)
  });

  server.on('request', serverHandler);
  
  server.on('error', (e) => {
    console.error(e.message);
  });
}
