import http from 'http';

import { serverHandler } from './controllers/serverHandler.ts';

const PORT = process.env.PORT || '4000';

const server = http.createServer(serverHandler);


server.listen(PORT, () => {
  console.log(`listening on port http://localhost:${PORT}`)
});

server.on('error', (e) => {
  console.error(e.message);
});