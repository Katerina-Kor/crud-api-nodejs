import { users } from "../data/users";
import { IUser, IUserFromRequest } from "../types";
import { v4 as uuidv4 } from "uuid";

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
};

export const deleteUser = (id: string) => {
  const userForDeleteIndex = users.findIndex((user) => user.id === id);
  users.splice(userForDeleteIndex, 1);
};
