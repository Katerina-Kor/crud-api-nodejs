import http from 'http';
import { serverHandler } from './controllers/serverHandler';

const multi: boolean = true;
const PORT = process.env.PORT || '4000';

const server = http.createServer();

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
});

server.on('request', serverHandler);
  
server.on('error', (e) => {
  console.error(e.message);
});
