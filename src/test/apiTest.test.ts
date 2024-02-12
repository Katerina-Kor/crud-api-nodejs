import request from "supertest";
import { server } from "..";
import { users } from "../data/users";

const usersEndpoint = '/api/users';

describe('Get method', () => {
  afterEach(() => {
    server.close()
  })

  it('Should return status code 200 after get request', async () => {
    const response = await request(server).get(usersEndpoint);
    expect(response.statusCode).toBe(200);
  });

  it('Should return all users after get request', async () => {
    const response = await request(server).get(usersEndpoint);
    expect(response.body.data).toEqual(users);
  });

  it('Should return specific user after get request with user id', async () => {
    const userId = users[0].id;
    const response = await request(server).get(`${usersEndpoint}/${userId}`);
    expect(response.body.data).toEqual(users[0]);
  });

  it('Should return status code 400 after get request with wrong id', async () => {
    const userWrongId = '1234';
    const response = await request(server).get(`${usersEndpoint}/${userWrongId}`);
    expect(response.statusCode).toBe(400);
  });  
});

describe('Post method', () => {
  afterEach(() => {
    server.close()
  });

  it('Should return new created user after post request', async () => {
    const response = await request(server).post(usersEndpoint).send({
      username: 'user',
      age: 20,
      hobbies: []
    });
    expect(response.body.data).toEqual(users[1]);
  });

  it('Should return status code 201 after post request', async () => {
    const response = await request(server).post(usersEndpoint).send({
      username: 'user',
      age: 20,
      hobbies: []
    });
    expect(response.statusCode).toBe(201);
  });

  it('Should return status code 400 after post request with missed required fields', async () => {
    const response = await request(server).post(usersEndpoint).send({
      username: 'user',
      hobbies: []
    });
    expect(response.statusCode).toBe(400);
  });
});

describe('Put method', () => {
  afterEach(() => {
    server.close()
  });

  it('Should return updated user after put request', async () => {
    const userId = users[0].id;
    const newUserData = {
      username: 'updateName',
      age: 20,
      hobbies: []
    };
    const response = await request(server).put(`${usersEndpoint}/${userId}`).send(newUserData);
    expect(response.body.data).toEqual({
      id: userId,
      ...newUserData
    });
  });

  it('Should return status code 200 after put request', async () => {
    const userId = users[0].id;
    const newUserData = {
      username: 'updateName',
      age: 20,
      hobbies: []
    };
    const response = await request(server).put(`${usersEndpoint}/${userId}`).send(newUserData);
    expect(response.statusCode).toBe(200);
  });

  it('Should return status code 400 after put request with missed required fields', async () => {
    const userId = users[0].id;
    const newUserData = {
      username: 'updateName',
      hobbies: []
    };
    const response = await request(server).put(`${usersEndpoint}/${userId}`).send(newUserData);
    expect(response.statusCode).toBe(400);
  });
});