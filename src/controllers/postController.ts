import { ServerResponse, IncomingMessage } from "http";
import { getPathName, isInvalidBody, sendResponse, getBody } from "../utils/helpers";
import { Endpoints, IResponse, IUser, ResponseMessages, StatusCodes } from "../types";
import { addUser, createUser } from "./usersController";

export const processPostMethod = async (request: IncomingMessage, response: ServerResponse, bd: IUser[]) => {
  const pathName = getPathName(request.url, request.headers.host);
  
  if (pathName === Endpoints.USERS) {
    const body = await getBody(request);

    if (isInvalidBody(body)) {
      const bodyS: IResponse = {
        data: null,
        error: {
          code: StatusCodes.BAD_REQUEST,
          message: ResponseMessages.MISSED_FIELDS
        }
      }
      sendResponse(response, StatusCodes.BAD_REQUEST, bodyS);

      return;
    };

    const createdUser = createUser(body);
    addUser(createdUser, bd);

    const bodyS: IResponse = {
      data: createdUser,
      error: null
    }
    sendResponse(response, StatusCodes.CREATED, bodyS);

    return {
      type: 'add',
      user: createdUser
    }
  };

  const bodyS: IResponse = {
    data: null,
    error: {
      code: StatusCodes.NOT_FOUND,
      message: `${ResponseMessages.WRONG_ENDPOINT}: ${pathName}`
    }
  }
  sendResponse(response, StatusCodes.NOT_FOUND, bodyS);
};
