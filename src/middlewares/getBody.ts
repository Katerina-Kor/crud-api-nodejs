import { IncomingMessage } from "http";

export const getBody = (request: IncomingMessage): Promise<any> => {
  return new Promise((resolve) => {
    let bodyBuffer: Buffer[] = [];

    request.on('data', (dataChunk: Buffer) => {
      bodyBuffer.push(dataChunk);
    });

    request.on('end', () => {
      const body = Buffer.concat(bodyBuffer).toString('utf8');

      resolve(JSON.parse(body));
    });

    request.on('error', () => resolve({}));
  })
}
