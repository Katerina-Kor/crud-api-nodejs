import { URL } from "url";
import { IncomingMessage, ServerResponse } from "http";
import { StatusCodes } from "./responseData";
import { users } from "../data/users";
import { IUser } from "../types";
import { validate as uuidValidate } from 'uuid';

export const getRequestQuery = (requestUrl: string = '', requestHost: string = '') => {
  const query = new URL(requestUrl, `http://${requestHost}`);
  return query;
};

export const getUrl = (requestUrl: string | undefined) => {
  let url = '';

  if (requestUrl) {
    const urlWithoutSearch = requestUrl.split('?')[0];
    url = urlWithoutSearch.endsWith('/') ? urlWithoutSearch.slice(1, -1) : urlWithoutSearch.slice(1);
  };

  return url;
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
}

export const sendResponse = (response: ServerResponse, statusCode: StatusCodes, body?: string) => {
  const headers = body ? {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(body),
  } : undefined

  response.writeHead(statusCode, headers);
  response.end(body);
}