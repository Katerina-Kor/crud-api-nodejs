import cluster, { Worker } from 'cluster';
import http, { IncomingMessage, ServerResponse } from 'http';
import os, { hostname } from 'os';

const port = 6000;

const server = http.createServer();

console.log(`✅ ${cluster.isPrimary ? 'I am Primary' : `I am worker, my id is ${cluster.worker?.id}`}`);

const workers: Worker[] = [];

const requestPrimaryHandler = (request: IncomingMessage, response: ServerResponse) => {
  console.log(`request to primary: ${request.method}`);

  const options = {
    hostname: hostname(),
    port: 6001,
    path: request.url,
    method: request.method,
    // headers: request.headers,
  };

  console.log(options)

  http.request(options, (res) => {
    res.on('data', () => {
      console.log('res from worker')
    });
    res.on('end', () => {
      response.writeHead(200);
      response.end('response from master after response from worker')
    })
  }).end()
  // workers[0].send({ event: "request" });

  // workers[0].on('message', (message) => {
  //   console.log(`message receive in primary: ${message}`);

  // });

};

const requestWorkerHandler = (request: IncomingMessage, response: ServerResponse) => {
  console.log(`request to worker: ${request.method}`);

  response.writeHead(200);
  response.end(`response from worker ${process.pid}`)

};

// Check is cluster primary or not
if (cluster.isPrimary) {

  server.listen(port, () => {
    console.log(`Server running 🚀 at http://localhost:${port}/`);
  });

  server.on('request', requestPrimaryHandler);

  for (let i = 0; i < 2; i++) {
    const worker: Worker = cluster.fork(); // Forks worker for each CPU core
    workers.push(worker);
  }

  cluster.on('fork', (worker) => {
    console.log(`Worker #${worker.id} is online 👍`);
  });

  cluster.on('listening', (worker, address) => {
    console.log(`The worker #${worker.id} is now connected to port #${JSON.stringify(address.port)}`);
    // Worker is waiting for Primary message
    // worker.on('message', (message) => {
    //   if (message.cmd && message.cmd === 'notifyRequest') {
    //     numRequests += 1;
    //     console.log(`Requests received: ${numRequests}`);
    //   }
    //   console.log(`message receive in primary: ${message}`)
    // });

  });

  cluster.on('disconnect', (worker) => {
    console.log(`The worker #${worker.id} has disconnected 🥲`);
  });

  cluster.on('exit', (worker) => {
    console.log(`Worker ${worker.id} is dead 😵`);
    cluster.fork(); // Create another worker instead of dead one
  });

} else {
  server.on('request', requestWorkerHandler);

  const workerId = cluster.worker?.id || 0;
  server.listen(port + workerId, () => {
    console.log(`Server running 🚀 at http://localhost:${port + workerId}/`);
  });

  process.on('message', ({event, request, response}) => {
    console.log(`worker receive message: ${event}`);
    // server.emit('request', request, response);
    // @ts-ignore
    // process.send('back answer send from worker')
  })

}
