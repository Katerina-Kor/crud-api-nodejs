import { URL } from "url";
import { IncomingMessage, ServerResponse } from "http";
import { StatusCodes } from "../types";
import { users } from "../data/users";
import { IUser } from "../types";
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

export const getUserById = (id: string) => {
  return users.find((user: IUser) => user.id === id);
};

export const isInvalidId = (id: string) => {
  return !uuidValidate(id);
};

export const isInvalidBody = (body: Object) => {
  if ('username' in body && 'age' in body && 'hobbies' in body) return false;
  return true;
};

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
};

export const sendResponse = (response: ServerResponse, statusCode: StatusCodes, body: string | IUser | IUser[] = '') => {
  let contentType: string = typeof body === 'string' ? 'text/plain' :  'application/json';
  let sendBody: string = typeof body === 'string' ? body : JSON.stringify(body);
  
  const headers = {
    'Content-Type': contentType,
    'Content-Length': Buffer.byteLength(sendBody),
  };

  response.writeHead(statusCode, headers);
  response.end(sendBody);
};
