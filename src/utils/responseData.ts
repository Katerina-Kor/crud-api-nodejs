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
}