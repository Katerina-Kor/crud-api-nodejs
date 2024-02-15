import http from 'http';
import { serverHandler } from './controllers/serverHandler';

const PORT = process.env.PORT || '5000';

export const server = http.createServer();

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
});

server.on('request', serverHandler);
  
server.on('error', (e) => {
  console.error(e.message);
});
