// import { IncomingMessage, ServerResponse } from "http";

// export type NextFuction = (request: IncomingMessage, response: ServerResponse) => void;

export interface IUser {
  id: string;
  username: string;
  age: number;
  hobbies: string[];
}