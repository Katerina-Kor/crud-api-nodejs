import { IUser } from "../types";

class BDUsers {
  private users: IUser[] = [];

  public createUser = (user: IUser) => {
    this.users.push(user);
  }

  public getAllUsers = () => {
    return this.users;
  }
}

export const BDInstance = new BDUsers();

export const users: IUser[] = [
  {
    id: 'a74c46a2-f3c7-425c-9788-314456b25c0e',
    username: 'initial_user',
    age: 20,
    hobbies: []
  }
];