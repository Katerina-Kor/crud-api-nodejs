export interface IUser {
  id: string;
  username: string;
  age: number;
  hobbies: string[];
}

export interface IUserFromRequest extends Omit<IUser, 'id'> {};

export enum StatusCodes {
  'OK' = 200,
  'CREATED' = 201,
  'NO_CONTENT' = 204,
  'BAD_REQUEST' = 400,
  'NOT_FOUND' = 404,
  'INTERNAL_SERVER_ERROR' = 500
};

export enum RequestMethods {
  'GET' = 'GET',
  'POST' = 'POST',
  'PUT' = 'PUT',
  'DELETE' = 'DELETE'
};

export enum Endpoints {
  'USERS' = 'api/users',
  'CERTAIN_USER' = 'api/users/',
};

export enum ResponseMessages {
  'SERVER_ERROR' = 'Sorry, something went wrong on server. Try later',
  'NO_RESPONSE' = 'No response',
  'WRONG_ENDPOINT' = 'Sorry, cannot reach non-existing endpoint',
  'NOT_FOUND' = 'Not found',
  'INVALID_ID' = 'Invalid user id',
  'MISSED_FIELDS' = 'Missed required fields',
}