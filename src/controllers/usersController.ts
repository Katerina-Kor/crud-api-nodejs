import { IUser, IUserFromRequest } from "../types";
import { v4 as uuidv4 } from "uuid";

export const createUser = (body: IUserFromRequest) => {
  const newUser: IUser = {
    id: uuidv4(),
    username: body.username,
    age: body.age,
    hobbies: body.hobbies
  };

  return newUser;
};

export const addUser = (user: IUser, bd: IUser[]) => {
  bd.push(user);
};

export const getUserById = (id: string, bd: IUser[]) => {
  return bd.find((user: IUser) => user.id === id);
};

export const updateUser = (id: string, body: IUserFromRequest | IUser, bd: IUser[]) => {
  const userForUpdate = bd.find((user) => user.id === id) as IUser;
  userForUpdate.username = body.username;
  userForUpdate.age = body.age;
  userForUpdate.hobbies = body.hobbies;

  return userForUpdate;
};

export const deleteUser = (id: string, bd: IUser[]) => {
  const userForDeleteIndex = bd.findIndex((user) => user.id === id);
  bd.splice(userForDeleteIndex, 1);
};
