import { IncomingMessage } from "http";

export const getBody = (request: IncomingMessage, message?: string): Promise<any> => {
  return new Promise((resolve) => {
    let bodyBuffer: Buffer[] = [];

    request.on('data', (dataChunk: Buffer) => {
      bodyBuffer.push(dataChunk);
      console.log('chunk', dataChunk);
    });

    request.on('end', () => {
      const body = Buffer.concat(bodyBuffer).toString('utf8');
      console.log(`getBody: ${message}`, body, typeof body);

      resolve(JSON.parse(body));
    });

    request.on('error', () => resolve({}));
  })
};