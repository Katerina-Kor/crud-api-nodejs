import { URL } from "url";
import { IncomingMessage, ServerResponse } from "http";
import { IResponse, StatusCodes } from "../types";
import { validate as uuidValidate } from 'uuid';

export const getPathName = (requestUrl: string = '', requestHost: string = '') => {
  const pathName = new URL(requestUrl, `http://${requestHost}`).pathname;

  return pathName.endsWith('/') ? pathName.slice(1, -1) : pathName.slice(1);
};

export const getUserId = (url: string) => {
  const slashIndex = url.lastIndexOf('/');
  const id = url.slice(slashIndex + 1);

  return id;
};

export const isInvalidId = (id: string) => {
  return !uuidValidate(id);
};

export const isInvalidBody = (body: Object) => {
  if ('username' in body && 'age' in body && 'hobbies' in body) return false;
  return true;
};

export const getBody = (request: IncomingMessage, message?: string): Promise<any> => {
  return new Promise((resolve) => {
    let bodyBuffer: Buffer[] = [];

    request.on('data', (dataChunk: Buffer) => {
      bodyBuffer.push(dataChunk);
    });

    request.on('end', () => {
      try {
        const body = Buffer.concat(bodyBuffer).toString('utf8');
        const bodyType = request.headers["content-type"]

        const resBody = bodyType === 'application/json'&& body.length > 0 ? JSON.parse(body) : body;

        resolve(resBody);
      } catch (error) {
        resolve({})
      }
    });

    request.on('error', () => resolve({}));
  })
};

export const sendResponse = (response: ServerResponse, statusCode: StatusCodes, body?: IResponse) => {
  const headers = {
    'Content-Type': 'application/json',
    'Content-Length': body ? Buffer.byteLength(JSON.stringify(body)): 0,
    'Keep-Alive': 'timeout=1'
  };

  response.writeHead(statusCode, headers);
  response.end(JSON.stringify(body));
};
