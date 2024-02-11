import request from "supertest";
import { server } from "..";
import { users } from "../data/users";

describe('Server tests', () => {
  afterEach(() => {
    server.close()
  })

  it('Should return status code 200 and users after get request', async () => {
    const response = await request(server).get("/api/users");
    expect(response.statusCode).toBe(200);
    expect(response.body.data).toEqual(users)
  });

  it('Should return new created user and 201 status code after post request', async () => {
    const response = await request(server).post("/api/users").send({
      username: 'user',
      age: 20,
      hobbies: []
    })
    expect(response.statusCode).toBe(201);
    expect(response.body.data).not.toBeNull;
    expect(response.body.data).toEqual(users[1])
  });

  it('Should return user by id after get request', async () => {
    const response = await request(server).get(`/api/users/${users[0].id}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.data).toEqual(users[0])
  });
});