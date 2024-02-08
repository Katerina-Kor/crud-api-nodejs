import { URL } from "url";
import { IncomingMessage, ServerResponse } from "http";
import { StatusCodes } from "./responseData";
import { users } from "../data/users";
import { IUser, IUserFromRequest } from "../types";
import { validate as uuidValidate, v4 as uuidv4 } from 'uuid';

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
};

export const isInvalidBody = (body: Object) => {
  if ('username' in body && 'age' in body && 'hobbies' in body) return false;
  return true;
};

export const createUser = (body: IUserFromRequest) => {
  const newUser: IUser = {
    id: uuidv4(),
    username: body.username,
    age: body.age,
    hobbies: body.hobbies
  };

  users.push(newUser);

  return newUser;
};

export const updateUser = (id: string, body: IUserFromRequest) => {
  const userForUpdate = users.find((user) => user.id === id) as IUser;
  userForUpdate.username = body.username;
  userForUpdate.age = body.age;
  userForUpdate.hobbies = body.hobbies;

  return userForUpdate;
}

export const sendResponse = (response: ServerResponse, statusCode: StatusCodes, body?: string) => {
  const headers = body ? {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(body),
  } : undefined

  response.writeHead(statusCode, headers);
  response.end(body);
}