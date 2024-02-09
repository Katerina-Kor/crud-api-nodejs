import http from 'http';
import cluster, { Worker } from 'cluster';
import { serverHandler } from './controllers/serverHandler.ts';
import { hostname } from 'os';
import { getBody, getData, sendResponse } from './utils/helpers.ts';

const multi: boolean = true;
const PORT = process.env.PORT || '4000';

const server = http.createServer();

if (multi) {
  const workersArr: Worker[] = [];

  if (cluster.isPrimary) {
    for (let i = 1; i < 3; i++) {
      const worker = cluster.fork({
        workerPort: Number(PORT) + i,
        identificator: i,
      });
      workersArr.push(worker);
    };
    
    
    server.listen(PORT, () => {
      console.log(`Load balancer running at http://localhost:${PORT}`);
    });

    server.on('request', (request, response) => {
      const options = {
        hostname: hostname(),
        port: 4001,
        path: request.url,
        method: request.method,
        headers: request.headers,
      };

      const req = http.request(options, async (res) => {
        const body = await getBody(res);
        console.log(body);

        sendResponse(response, res.statusCode || 500, body)
        
      });

      req.end();

    })


  } else {
    const workerPort = process.env.workerPort;
    const workerIdentificator = process.env.identificator;
    console.log('check', `${workerPort}`)

    server.listen(workerPort, () => {
      console.log(`Worker server #${workerIdentificator} running at http://localhost:${workerPort}`)
    });

    server.on('request', serverHandler);
  }


} else {
  server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`)
  });
  
  server.on('error', (e) => {
    console.error(e.message);
  });
}
